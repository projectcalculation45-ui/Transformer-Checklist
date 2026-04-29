/**
 * Block Layout Routes
 * Auth: JWT cookie (authenticate) — from middlewares/auth.js
 * Admin-only mutations use requireRole(['admin'])
 */

const express = require('express');
const router  = express.Router();
const { authenticate, requireRole } = require('../middlewares/auth');
const blockLayoutService = require('../services/block-layout.service');

// ─── GET /:stage/:sectionIndex ─────────────────────────────────────────────
// All authenticated users can read layouts (so block wrappers render for everyone)
router.get('/:stage/:sectionIndex', authenticate, (req, res) => {
    try {
        const { stage, sectionIndex } = req.params;
        const layout = blockLayoutService.getLayout(stage, Number(sectionIndex));
        return res.json({ success: true, layout });
    } catch (err) {
        console.error('[block-layout] GET error:', err);
        return res.status(500).json({ error: 'Failed to read layout', detail: err.message });
    }
});

// ─── GET /all/layouts ──────────────────────────────────────────────────────
router.get('/all/layouts', authenticate, requireRole(['admin']), (req, res) => {
    try {
        const layouts = blockLayoutService.getAllLayouts();
        return res.json({ success: true, layouts });
    } catch (err) {
        return res.status(500).json({ error: 'Failed to read all layouts', detail: err.message });
    }
});

// ─── POST /:stage/:sectionIndex ────────────────────────────────────────────
// Admin saves a new block tree
router.post('/:stage/:sectionIndex', authenticate, requireRole(['admin']), (req, res) => {
    try {
        const { stage, sectionIndex } = req.params;
        const { cells } = req.body;

        if (!cells || typeof cells !== 'object') {
            return res.status(400).json({ error: 'cells object is required' });
        }

        const savedBy = req.user.username || req.user.userId || 'admin';
        const layout  = blockLayoutService.saveLayout(stage, Number(sectionIndex), { cells }, savedBy);
        return res.json({ success: true, layout });
    } catch (err) {
        console.error('[block-layout] POST error:', err);
        return res.status(500).json({ error: 'Failed to save layout', detail: err.message });
    }
});

// ─── POST /:stage/:sectionIndex/lock ──────────────────────────────────────
router.post('/:stage/:sectionIndex/lock', authenticate, requireRole(['admin']), (req, res) => {
    try {
        const { stage, sectionIndex } = req.params;
        const lockedBy = req.user.username || req.user.userId || 'admin';
        const layout   = blockLayoutService.lockLayout(stage, Number(sectionIndex), lockedBy);
        return res.json({ success: true, layout });
    } catch (err) {
        console.error('[block-layout] LOCK error:', err);
        return res.status(500).json({ error: 'Failed to lock layout', detail: err.message });
    }
});

// ─── POST /:stage/:sectionIndex/unlock ────────────────────────────────────
router.post('/:stage/:sectionIndex/unlock', authenticate, requireRole(['admin']), (req, res) => {
    try {
        const { stage, sectionIndex } = req.params;
        const { reason }     = req.body;
        const unlockedBy     = req.user.username || req.user.userId || 'admin';
        const layout         = blockLayoutService.unlockLayout(stage, Number(sectionIndex), unlockedBy, reason || '');
        return res.json({ success: true, layout });
    } catch (err) {
        console.error('[block-layout] UNLOCK error:', err);
        return res.status(500).json({ error: 'Failed to unlock layout', detail: err.message });
    }
});

// ─── DELETE /:stage/:sectionIndex ─────────────────────────────────────────
// Reset section layout to default single-leaf
router.delete('/:stage/:sectionIndex', authenticate, requireRole(['admin']), (req, res) => {
    try {
        const { stage, sectionIndex } = req.params;
        const resetBy = req.user.username || req.user.userId || 'admin';
        const layout  = blockLayoutService.resetLayout(stage, Number(sectionIndex), resetBy);
        return res.json({ success: true, layout, message: 'Layout reset to default' });
    } catch (err) {
        console.error('[block-layout] DELETE error:', err);
        return res.status(500).json({ error: 'Failed to reset layout', detail: err.message });
    }
});

module.exports = router;
