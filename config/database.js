const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://projectcalculation45_db_user:HEMzpRmPm9fzfTVp@cluster0.3krktul.mongodb.net/?appName=Cluster0';

let client;
let db;

async function connectToDatabase() {
    try {
        client = new MongoClient(uri);
        await client.connect();
        db = client.db('transformer_db'); // You can change the database name if needed
        console.log('📊 Connected to MongoDB Atlas');
        return db;
    } catch (error) {
        console.error('❌ Error connecting to MongoDB:', error);
        throw error;
    }
}

function getDatabase() {
    if (!db) {
        throw new Error('Database not connected. Call connectToDatabase() first.');
    }
    return db;
}

module.exports = {
    connectToDatabase,
    getDatabase,
    client
};
            }
        }
    }

    console.log('✅ Database schema initialized (production)');
}

module.exports = db;
