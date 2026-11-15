require('dotenv').config();
const dns = require('dns');
// Fix Windows Node.js c-ares DNS SRV resolution issue for MongoDB Atlas
try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
    // ignore if not supported in environment
}

const mongoose = require('mongoose');

const LOCAL_URI = process.env.LOCAL_DATABASE_URL || 'mongodb://localhost:27017/machina';
const TARGET_URI = process.env.DATABASE_URL;

async function migrate() {
    if (!TARGET_URI || TARGET_URI.includes('localhost') || TARGET_URI.includes('127.0.0.1')) {
        console.error('ERROR: DATABASE_URL is not set to an external or Atlas MongoDB URI.');
        console.error('Please set DATABASE_URL (e.g. mongodb+srv://<user>:<password>@cluster.mongodb.net/machina) before running migration.');
        process.exit(1);
    }

    console.log(`Connecting to Local MongoDB: ${LOCAL_URI}`);
    const localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
    console.log('Local MongoDB connected.');

    console.log(`Connecting to Target MongoDB (Atlas): ${TARGET_URI.replace(/:([^:@]+)@/, ':****@')}`);
    const targetConn = await mongoose.createConnection(TARGET_URI).asPromise();
    console.log('Target MongoDB Atlas connected.');

    const collections = await localConn.db.listCollections().toArray();
    console.log(`Found ${collections.length} collections locally.`);

    for (const col of collections) {
        const name = col.name;
        if (name.startsWith('system.')) continue;

        const localCollection = localConn.db.collection(name);
        const targetCollection = targetConn.db.collection(name);

        const docs = await localCollection.find({}).toArray();
        console.log(`Migrating collection '${name}': ${docs.length} documents...`);

        if (docs.length > 0) {
            await targetCollection.deleteMany({});
            await targetCollection.insertMany(docs);
            console.log(`Successfully migrated '${name}' (${docs.length} documents).`);
        } else {
            console.log(`Collection '${name}' is empty, skipping.`);
        }
    }

    await localConn.close();
    await targetConn.close();
    console.log('\nMigration complete! All local collections and records have been synced to Atlas.');
}

migrate().catch(err => {
    console.error('Migration failed:', err.message);
    process.exit(1);
});
