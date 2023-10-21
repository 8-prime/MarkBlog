const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()


function getDbClient() {
    const uri = process.env['MONGODB_URL'];

    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    return client;
}

module.exports = {
    getDbClient
}