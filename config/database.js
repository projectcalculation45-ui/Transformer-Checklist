const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const { MongoClient } = require('mongodb');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'transformer.db');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const uri = 'mongodb+srv://projectcalculation45_db_user:HEMzpRmPm9fzfTVp@cluster0.3krktul.mongodb.net/?appName=Cluster0';

let client;
let mongoDb;

async function connectToDatabase() {
    try {
        client = new MongoClient(uri);
        await client.connect();
        mongoDb = client.db('transformer_db'); // You can change the database name if needed
        console.log('📊 Connected to MongoDB Atlas');
        return mongoDb;
    } catch (error) {
        console.error('❌ Error connecting to MongoDB:', error);
        throw error;
    }
}

function getDatabase() {
    if (!mongoDb) {
        throw new Error('Database not connected. Call connectToDatabase() first.');
    }
    return mongoDb;
}

// Initialize SQLite database for legacy modules
const db = new Database(DB_PATH);

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

// Disable foreign key constraints during MongoDB migration transition
db.pragma('foreign_keys = OFF');

// Set synchronous mode for data safety
db.pragma('synchronous = FULL');

console.log('📊 SQLite Database Configuration:');
console.log(`   Path: ${DB_PATH}`);
console.log(`   Journal Mode: ${db.pragma('journal_mode', { simple: true })}`);
console.log(`   Foreign Keys: ${db.pragma('foreign_keys', { simple: true })}`);
console.log(`   Synchronous: ${db.pragma('synchronous', { simple: true })}`);

// Initialize schema (use production schema)
const schemaPath = path.join(__dirname, 'schema-production.sql');
if (fs.existsSync(schemaPath)) {
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Split into individual statements and run them separately.
    // ALTER TABLE runs inside try/catch so adding an already-existing
    // column is silently ignored (idempotent migration).
    const statements = schema
        .replace(/--.*/g, '')
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0);

    for (const stmt of statements) {
        try {
            db.exec(stmt + ';');
        } catch (err) {
            if (!err.message.includes('duplicate column')) {
                console.warn(`⚠️ Schema migration warning: ${err.message}`);
            }
        }
    }

    console.log('✅ Database schema initialized (production)');
}

module.exports = db;
module.exports.connectToDatabase = connectToDatabase;
module.exports.getDatabase = getDatabase;
module.exports.client = client;
