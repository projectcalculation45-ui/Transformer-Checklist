const { getDatabase } = require('../config/database');

class UserService {
    constructor() {
        this.db = null;
        this.collection = null;
    }

    _getCollection() {
        if (!this.collection) {
            this.db = getDatabase();
            this.collection = this.db.collection('users');
        }
        return this.collection;
    }

    /**
     * Get all users (password hash excluded)
     */
    async findAll() {
        const collection = this._getCollection();
        const users = await collection.find({}, {
            projection: { password: 0 }
        }).toArray();

        return users.map(user => ({
            ...user,
            permissions: user.permissions || []
        }));
    }

    /**
     * Find user by userId (password hash excluded)
     */
    async findByUserId(userId) {
        const collection = this._getCollection();
        const user = await collection.findOne({ userId }, {
            projection: { password: 0 }
        });

        if (!user) {
            return null;
        }

        return {
            ...user,
            permissions: user.permissions || []
        };
    }

    /**
     * Find user with password hash (for auth only)
     */
    async findByUserIdWithPassword(userId) {
        const collection = this._getCollection();
        const user = await collection.findOne({ userId });

        if (!user) {
            return null;
        }

        return {
            ...user,
            permissions: user.permissions || []
        };
    }

    /**
     * Create new user
     */
    async create(userData) {
        const collection = this._getCollection();
        const doc = {
            userId: userData.userId,
            password: userData.password,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            department: userData.department,
            customerId: userData.customerId,
            customerName: userData.customerName,
            permissions: userData.permissions || [],
            createdAt: new Date()
        };

        await collection.insertOne(doc);
        return this.findByUserId(userData.userId);
    }

    /**
     * Update user
     */
    async update(userId, userData) {
        const collection = this._getCollection();
        const updateDoc = {
            updatedAt: new Date()
        };

        if (userData.name !== undefined) updateDoc.name = userData.name;
        if (userData.email !== undefined) updateDoc.email = userData.email;
        if (userData.role !== undefined) updateDoc.role = userData.role;
        if (userData.department !== undefined) updateDoc.department = userData.department;
        if (userData.customerId !== undefined) updateDoc.customerId = userData.customerId;
        if (userData.customerName !== undefined) updateDoc.customerName = userData.customerName;
        if (userData.permissions !== undefined) updateDoc.permissions = userData.permissions;

        await collection.updateOne({ userId }, { $set: updateDoc });
        return this.findByUserId(userId);
    }

    /**
     * Update user password
     */
    async updatePassword(userId, newPassword) {
        const collection = this._getCollection();
        await collection.updateOne({ userId }, {
            $set: {
                password: newPassword,
                updatedAt: new Date()
            }
        });
        return true;
    }

    /**
     * Delete user
     */
    async delete(userId) {
        const collection = this._getCollection();
        const result = await collection.deleteOne({ userId });
        return result.deletedCount > 0;
    }
}

module.exports = new UserService();
