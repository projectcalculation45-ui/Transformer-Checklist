const { getDatabase } = require('../config/database');

// Lazy reference avoids circular dependency (checklist ↔ revision) while keeping
// the dependency explicit and mockable from tests.
let _revisionService = null;
const revSvc = () => {
    if (!_revisionService) {
        _revisionService = require('./revision.service');
    }
    return _revisionService;
};

class ChecklistService {
    constructor() {
        this.db = null;
        this.collection = null;
    }

    _getCollection() {
        if (!this.collection) {
            this.db = getDatabase();
            this.collection = this.db.collection('checklists');
        }
        return this.collection;
    }

    /**
     * Get checklist for a work order and stage (returns full row + parsed items).
     */
    async getChecklist(wo, stage) {
        const collection = this._getCollection();
        const checklist = await collection.findOne({ wo, stage });
        if (!checklist) {
            return null;
        }
        return { ...checklist, items: checklist.items ? checklist.items : [] };
    }

    /**
     * Get all checklists for a work order.
     */
    async getChecklistsByWO(wo) {
        const collection = this._getCollection();
        const checklists = await collection.find({ wo }).toArray();
        return checklists.map(c => ({ ...c, items: c.items ? c.items : [] }));
    }

    /* ═══════════════════════════════════════════════════════════════════
     * LOW-LEVEL ITEM HELPERS (Issue 1 separation; Issue 5 deduplication)
     * ═══════════════════════════════════════════════════════════════════ */

    /**
     * Get the flat items array for a wo + stage. Returns [] when no record exists.
     */
    async getItems(wo, stage) {
        const checklist = await this.getChecklist(wo, stage);
        if (!checklist) {
            return [];
        }
        return checklist.items || [];
    }

    /**
     * Persist the items array for a wo + stage (upsert).
     * For concurrent-safe updates, use withTransaction() instead.
     */
    async setItems(wo, stage, items, completedBy = null) {
        const collection = this._getCollection();
        const existing = await collection.findOne({ wo, stage });

        const updateData = {
            items,
            completedBy,
            lastUpdated: new Date()
        };

        if (existing) {
            await collection.updateOne({ wo, stage }, { $set: updateData });
        } else {
            await collection.insertOne({
                wo,
                stage,
                items,
                completedBy,
                lastUpdated: new Date()
            });
        }
    }

    /**
     * Execute a MongoDB transaction for atomic read-modify-write operations.
     */
    async withTransaction(fn) {
        const collection = this._getCollection();
        const session = this.db.startSession();

        try {
            return await session.withTransaction(async () => {
                return await fn({
                    getItems: async (wo, stage) => await this.getItems(wo, stage),
                    setItems: async (wo, stage, items, by) => await this.setItems(wo, stage, items, by)
                });
            });
        } finally {
            await session.endSession();
        }
    }

    /**
     * Verify a Work Order exists in the transformers table.
     * Used by routes for object-level access control before modifying checklist data.
     */
    async findTransformer(wo) {
        const transformerCollection = this.db.collection('transformers');
        return await transformerCollection.findOne({ wo }, { projection: { wo: 1, customerId: 1, stage: 1, customerVisible: 1 } });
    }

    /* ═══════════════════════════════════════════════════════════════════
     * ADMIN / ANALYTICS QUERIES
     * ═══════════════════════════════════════════════════════════════════ */

    async getAllChecklists() {
        const collection = this._getCollection();
        return await collection.find({}).sort({ lastUpdated: -1 }).toArray();
    }

    async getPendingQA() {
        const collection = this._getCollection();
        return await collection.find({
            $or: [
                { qaApproved: { $ne: true } },
                { qaApproved: { $exists: false } }
            ]
        }).sort({ lastUpdated: -1 }).toArray();
    }

    async getPendingSupervisor() {
        const collection = this._getCollection();
        return await collection.find({
            $or: [
                { supervisorApproved: { $ne: true } },
                { supervisorApproved: { $exists: false } }
            ]
        }).sort({ lastUpdated: -1 }).toArray();
    }

    /* ═══════════════════════════════════════════════════════════════════
     * CHECKLIST-LEVEL OPERATIONS
     * ═══════════════════════════════════════════════════════════════════ */

    /**
     * Save or update a checklist row.
     */
    saveChecklist(wo, stage, items, metadata = {}) {
        const existing = this.getChecklist(wo, stage);
        if (existing) {
            db.prepare(`
                UPDATE checklists
                SET items = ?, completedBy = ?, lastUpdated = datetime('now')
                WHERE wo = ? AND stage = ?
            `).run(JSON.stringify(items), metadata.completedBy || null, wo, stage);
        } else {
            db.prepare(`
                INSERT INTO checklists (wo, stage, items, completedBy)
                VALUES (?, ?, ?, ?)
            `).run(wo, stage, JSON.stringify(items), metadata.completedBy || null);
        }
        return this.getChecklist(wo, stage);
    }

    /**
     * Lock checklist and mark it QA-approved.
     *
     * Issue 1 fix: verifies that the checklist has at least one item and that
     * every item has been filled in (actualValue present) before setting the
     * qaApproved / locked flags, preventing a blank checklist from being
     * rubber-stamped as approved.
     */
    lockChecklist(wo, stage, _userId) {
        const checklist = this.getChecklist(wo, stage);
        if (!checklist) {
            throw new Error('Checklist not found');
        }

        const items = checklist.items || [];
        if (items.length === 0) {
            throw new Error('Cannot lock an empty checklist — no items have been recorded.');
        }

        const incompleteItems = items.filter(i => !i.actualValue || String(i.actualValue).trim() === '');
        if (incompleteItems.length > 0) {
            throw Object.assign(
                new Error(`Cannot lock checklist: ${incompleteItems.length} item(s) have no recorded value.`),
                { status: 422, incompleteCount: incompleteItems.length }
            );
        }

        const result = db.prepare(`
            UPDATE checklists
            SET locked = 1, qaApproved = 1, lastUpdated = datetime('now')
            WHERE wo = ? AND stage = ?
        `).run(wo, stage);

        if (result.changes === 0) {
            throw new Error('Checklist not found');
        }
        return this.getChecklist(wo, stage);
    }

    /**
     * Mark checklist-level supervisor approval.
     */
    markSupervisorApproved(wo, stage, supervisorUsername) {
        const result = db.prepare(`
            UPDATE checklists
            SET supervisorApproved = 1,
                supervisorApprovedBy = ?,
                supervisorApprovedAt = datetime('now'),
                lastUpdated = datetime('now')
            WHERE wo = ? AND stage = ?
        `).run(supervisorUsername, wo, stage);

        if (result.changes === 0) {
            throw new Error('Checklist not found');
        }
        return this.getChecklist(wo, stage);
    }

    /**
     * Reject checklist (clears qaApproved, records reason).
     */
    rejectChecklist(wo, stage, reason) {
        const result = db.prepare(`
            UPDATE checklists
            SET qaApproved = 0, rejectionReason = ?, lastUpdated = datetime('now')
            WHERE wo = ? AND stage = ?
        `).run(reason, wo, stage);

        if (result.changes === 0) {
            throw new Error('Checklist not found');
        }
        return this.getChecklist(wo, stage);
    }

    /**
     * Items awaiting supervisor sign-off (tech done, supervisor not done).
     */
    getSupervisorPendingItems(wo, stage) {
        const checklist = this.getChecklist(wo, stage);
        if (!checklist) {
            return [];
        }
        return (checklist.items || []).filter(i => i.techSignedOff && !i.supervisorSignedOff);
    }

    /**
     * Items awaiting QA sign-off (supervisor done, QA not done).
     */
    getQAPendingItems(wo, stage) {
        const checklist = this.getChecklist(wo, stage);
        if (!checklist) {
            return [];
        }
        return (checklist.items || []).filter(i => i.supervisorSignedOff && !i.qaSignedOff);
    }

    /**
     * Tier completion summary for a checklist.
     */
    getChecklistSummary(wo, stage) {
        const checklist = this.getChecklist(wo, stage);
        if (!checklist) {
            return { total: 0, techDone: 0, supervisorDone: 0, qaDone: 0 };
        }
        const items = checklist.items || [];
        return {
            total:          items.length,
            techDone:       items.filter(i => i.techSignedOff).length,
            supervisorDone: items.filter(i => i.supervisorSignedOff).length,
            qaDone:         items.filter(i => i.qaSignedOff).length
        };
    }

    /**
     * Clear checklist (admin only).
     */
    clearChecklist(wo, stage) {
        return db.prepare('DELETE FROM checklists WHERE wo = ? AND stage = ?').run(wo, stage).changes > 0;
    }

    /* ═══════════════════════════════════════════════════════════════════
     * REVISION PASS-THROUGH (convenience — delegates to revisionService)
     * Routes that already import checklistService can call saveRevision /
     * getRevisions / compareVersions on it without a second import.
     * revisionService is resolved lazily on first call to break the circular
     * dependency that would arise from a top-level require.
     * ═══════════════════════════════════════════════════════════════════ */

    saveRevision(wo, stage, items, changeReason = null, createdBy = 'system') {
        return revSvc().saveRevision(wo, stage, items, changeReason, createdBy);
    }

    getRevisions(wo, stage) {
        return revSvc().getRevisions(wo, stage);
    }

    getRevision(wo, stage, revision) {
        return revSvc().getRevision(wo, stage, revision);
    }

    restoreRevision(wo, stage, revision, restoredBy) {
        return revSvc().restoreRevision(wo, stage, revision, restoredBy, this);
    }

    compareVersions(itemsA, itemsB) {
        return revSvc().compareVersions(itemsA, itemsB);
    }
}

module.exports = new ChecklistService();
