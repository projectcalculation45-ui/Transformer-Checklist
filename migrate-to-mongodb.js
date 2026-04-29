/**
 * Migration Script: SQLite → MongoDB Atlas
 * Run once with: node migrate-to-mongodb.js
 */
require('dotenv').config();

const Database = require('better-sqlite3');
const { MongoClient } = require('mongodb');
const path = require('path');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://projectcalculation45_db_user:HEMzpRmPm9fzfTVp@cluster0.3krktul.mongodb.net/?appName=Cluster0';
const DB_PATH = path.join(__dirname, 'data', 'transformer.db');

async function migrate() {
    console.log('\n🚀 Starting SQLite → MongoDB Migration...\n');

    // Connect to SQLite
    let sqlite;
    try {
        sqlite = new Database(DB_PATH, { readonly: true });
        console.log('✅ Connected to local SQLite database');
    } catch (err) {
        console.error('❌ Could not open SQLite database:', err.message);
        process.exit(1);
    }

    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI);
    try {
        await client.connect();
        console.log('✅ Connected to MongoDB Atlas');
    } catch (err) {
        console.error('❌ Could not connect to MongoDB:', err.message);
        process.exit(1);
    }

    const db = client.db('transformer_db');

    // Get all tables in SQLite
    const tables = sqlite.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all();
    console.log(`\n📋 Found ${tables.length} tables to migrate: ${tables.map(t => t.name).join(', ')}\n`);

    let totalMigrated = 0;

    for (const { name } of tables) {
        try {
            const rows = sqlite.prepare(`SELECT * FROM "${name}"`).all();
            if (rows.length === 0) {
                console.log(`   ⏭️  ${name}: empty, skipping`);
                continue;
            }

            const collection = db.collection(name);
            const existingCount = await collection.countDocuments();

            if (existingCount > 0) {
                console.log(`   ⚠️  ${name}: already has ${existingCount} docs in MongoDB — skipping to avoid duplicates`);
                continue;
            }

            // Parse JSON columns where possible
            const parsedRows = rows.map(row => {
                const parsed = { ...row };
                for (const [key, val] of Object.entries(parsed)) {
                    if (typeof val === 'string' && (val.startsWith('{') || val.startsWith('['))) {
                        try { parsed[key] = JSON.parse(val); } catch (_) { /* keep as string */ }
                    }
                }
                return parsed;
            });

            await collection.insertMany(parsedRows);
            console.log(`   ✅ ${name}: migrated ${rows.length} records`);
            totalMigrated += rows.length;
        } catch (err) {
            console.error(`   ❌ ${name}: error — ${err.message}`);
        }
    }

    console.log(`\n🎉 Migration complete! ${totalMigrated} total records moved to MongoDB Atlas.`);
    console.log('   Your Render website should now show all your data.\n');

    sqlite.close();
    await client.close();
}

migrate().catch(err => {
    console.error('Fatal migration error:', err);
    process.exit(1);
});
