const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { logAudit } = require('../utils/audit');
const { authenticate } = require('../middlewares/auth');

const CHECKLIST_MASTER_FILE = path.join(__dirname, '../data/checklist-master.json');

// Apply auth middleware to populated req.user
router.use(authenticate);

// GET /api/checklist/master
router.get('/master', (req, res) => {
    try {
        if (!fs.existsSync(CHECKLIST_MASTER_FILE)) {
            return res.status(404).json({ error: 'Checklist master file not found' });
        }
        const data = JSON.parse(fs.readFileSync(CHECKLIST_MASTER_FILE, 'utf8'));
        res.json(data);
    } catch (error) {
        console.error('Error reading checklist master:', error);
        res.status(500).json({ error: 'Failed to read checklist master data' });
    }
});

// POST /api/checklist/master (Admin Only)
router.post('/master', (req, res) => {
    try {
        const { role } = req.user || {};
        if (role !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Admins only.' });
        }

        const newData = req.body;
        if (!newData || typeof newData !== 'object') {
            return res.status(400).json({ error: 'Invalid data format' });
        }

        fs.writeFileSync(CHECKLIST_MASTER_FILE, JSON.stringify(newData, null, 2));

        logAudit(req.user, 'UPDATE', `checklist master structure updated`);

        res.json({ success: true, message: 'Checklist master updated successfully' });
    } catch (error) {
        console.error('Error updating checklist master:', error);
        res.status(500).json({ error: 'Failed to update checklist master data' });
    }
});

module.exports = router;
