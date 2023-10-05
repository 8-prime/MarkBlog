const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { getDbClient } = require('../utils/clientUtils');

require('dotenv').config()

const displayProjection = {
    _id: 1, // Exclude the _id field
    title: 1, // Include the title field
    tags: 1, // Include the tags field
    markdowntext: 0
};

exports.getDisplayEntries = async (req, res) => {
    try {
        const client = getDbClient();
        const db = client.db('blogs');
        const collection = db.collection('blogEntries')

        const results = await collection.find({}, displayProjection).toArray();
        client.close();

        res.json(results);

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

exports.getEntryById = async (req, res) => {
    try {
        const id = req.params.id;

        const client = getDbClient();
        const db = client.db('blogs');
        const collection = db.collection('blogEntries')

        const result = await collection.findOne({ _id: new ObjectId(id) });

        client.close();

        if (!result) {
            return res.status(404).json({ message: 'Document not found' });
        }

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Server error' })
    }
}

exports.findEntries = async (req, res) => {
    try {
        const searchTerms = req.query.search.split(',').map(term => term.trim());
        if (searchTerms.length === 0) {
            return res.status(400).json({ message: 'No search terms provided' });
        }

        const client = getDbClient();
        const db = client.db('blogs');
        const collection = db.collection('blogEntries')

        const query = {
            $and: searchTerms.map(term => ({
                $or: [
                    { Name: { $regex: term, $options: 'i' } },
                    { tags: { $in: [term] } },
                    { markdowntext: { $regex: term, $options: 'i' } },
                ],
            })),
        };

        const results = await collection.find(query, displayProjection).toArray();
        client.close();

        res.json(results);

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

exports.addEntry = async (req, res) => {
    try {
        console.log("Starting to add entry");

        const client = getDbClient();
        const db = client.db('blogs');
        const collection = db.collection('blogEntries')

        console.log("Created db instance");

        const newEntry = req.body;
        newEntry._id = new ObjectId();
        console.log(newEntry);
        const result = await collection.insertOne(newEntry);
        client.close();
        console.log("Inserted");
        res.json({ message: 'Entry added successfully', insertedId: result.insertedId });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

exports.editEntry = async (req, res) => {
    try {
        const updatedData = req.body;

        const client = getDbClient();
        const db = client.db('blogs');
        const collection = db.collection('blogEntries')

        const result = await collection.updateOne({ _id: new ObjectId(updatedData._id) }, { $set: updatedData });

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: 'Document not found or no changes were made' });
        }

        res.json({ message: 'Document updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}