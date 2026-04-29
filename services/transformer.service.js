const { getDatabase } = require('../config/database');

class TransformerService {
    constructor() {
        this.db = getDatabase();
        this.collection = this.db.collection('transformers');
    }

    /**
     * Get all transformers with optional filters
     */
    async findAll(filters = {}) {
        const query = {};

        if (filters.customerId) {
            query.customerId = filters.customerId;
        }

        if (filters.stage) {
            query.stage = filters.stage;
        }

        const transformers = await this.collection.find(query).sort({ createdAt: -1 }).toArray();

        return transformers.map(t => this._parseTransformer(t));
    }

    /**
     * Find transformer by work order
     */
    async findByWO(wo) {
        const transformer = await this.collection.findOne({ wo });
        if (!transformer) {
            return null;
        }

        return this._parseTransformer(transformer);
    }

    /**
     * Create new transformer
     */
    async create(transformerData) {
        const now = new Date();
        const doc = {
            wo: transformerData.wo,
            customerId: transformerData.customerId,
            customer: transformerData.customer,
            rating: transformerData.rating,
            hv: transformerData.hv,
            lv: transformerData.lv,
            stage: transformerData.stage || 'winding',
            designData: transformerData.designData || {},
            createdBy: transformerData.createdBy,
            createdAt: now,
            updatedAt: now
        };

        await this.collection.insertOne(doc);
        return this._parseTransformer(doc);
    }


    /**
     * Update transformer
     */
    async update(wo, transformerData) {
        const updateDoc = {
            updatedAt: new Date(),
            updatedBy: transformerData.updatedBy
        };

        if (transformerData.customer !== undefined) updateDoc.customer = transformerData.customer;
        if (transformerData.customerId !== undefined) updateDoc.customerId = transformerData.customerId;
        if (transformerData.rating !== undefined) updateDoc.rating = transformerData.rating;
        if (transformerData.hv !== undefined) updateDoc.hv = transformerData.hv;
        if (transformerData.lv !== undefined) updateDoc.lv = transformerData.lv;
        if (transformerData.designData !== undefined) updateDoc.designData = transformerData.designData;
        if (transformerData.stage !== undefined) updateDoc.stage = transformerData.stage;
        if (transformerData.currentStage !== undefined) updateDoc.currentStage = transformerData.currentStage;
        if (transformerData.stageProgress !== undefined) updateDoc.stageProgress = transformerData.stageProgress;
        if (transformerData.stageHistory !== undefined) updateDoc.stageHistory = transformerData.stageHistory;
        if (transformerData.actuals !== undefined) updateDoc.actuals = transformerData.actuals;

        await this.collection.updateOne({ wo }, { $set: updateDoc });
        return this.findByWO(wo);
    }


    /**
     * Delete transformer
     */
    async delete(wo) {
        const result = await this.collection.deleteOne({ wo });
        return result.deletedCount > 0;
    }

    /**
     * Toggle customer visibility for a transformer's checklist.
     * When visible=true, customer users are allowed to view the checklist.
     */
    async setCustomerVisible(wo, visible, updatedBy) {
        const updateDoc = {
            customerVisible: visible,
            customerVisibleUpdatedBy: updatedBy,
            customerVisibleUpdatedAt: new Date()
        };

        await this.collection.updateOne({ wo }, { $set: updateDoc });
        return this.findByWO(wo);
    }

    /**
     * Parse transformer from database (ensure proper data types)
     */
    _parseTransformer(transformer) {
        return {
            ...transformer,
            customerVisible: Boolean(transformer.customerVisible),
            designData: transformer.designData || {},
            actuals: transformer.actuals || {},
            stageHistory: transformer.stageHistory || []
        };
    }
}

module.exports = new TransformerService();
