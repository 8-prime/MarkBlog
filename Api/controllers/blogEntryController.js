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
    const client = getDbClient();
    const db = client.db('blogs');
    const collection = db.collection('blogEntries')
    try {

        const results = await collection.find({}, displayProjection).toArray();

        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        client.close();
    }
}

exports.getEntryById = async (req, res) => {
    const client = getDbClient();
    const db = client.db('blogs');
    const collection = db.collection('blogEntries')
    try {
        const id = req.params.id;


        const result = await collection.findOne({ _id: new ObjectId(id) });

        if (!result) {
            return res.status(404).json({ message: 'Document not found' });
        }

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Server error' })
    } finally {
        client.close();
    }
}

exports.findEntries = async (req, res) => {
    const client = getDbClient();
    const db = client.db('blogs');
    const collection = db.collection('blogEntries')
    try {
        console.log("Called Method");
        console.log(req.params);
        const searchTerms = req.params.search.split(',').map(term => term.trim());
        console.log(searchTerms);
        if (searchTerms.length === 0) {
            return res.status(400).json({ message: 'No search terms provided' });
        }


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

        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        client.close();
    }
}

exports.addEntry = async (req, res) => {
    const client = getDbClient();
    const db = client.db('blogs');
    const collection = db.collection('blogEntries')
    try {

        const newEntry = req.body;
        newEntry._id = new ObjectId();
        const result = await collection.insertOne(newEntry);

        res.status(200).json({ message: 'Entry added successfully', insertedId: result.insertedId });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        client.close();
    }
}

exports.editEntry = async (req, res) => {
    const client = getDbClient();
    const db = client.db('blogs');
    const collection = db.collection('blogEntries')
    try {
        const updatedData = req.body;
        const updateId = updatedData._id;
        delete updatedData._id;
        console.log(updatedData);
        const result = await collection.updateOne({ _id: new ObjectId(updateId) }, { $set: updatedData });

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: 'Document not found or no changes were made' });
        }

        res.json({ message: 'Document updated successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        client.close();
    }
}

exports.removeEntry = async (req, res) => {
    const client = getDbClient();
    const db = client.db('blogs');
    const collection = db.collection('blogEntries')
    try {
        const id = req.params.id;


        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 1) {
            res.status(200).json({message: "Item has been deleted"});
        } else {
            res.status(500).json({message: "There was an error removing the item"});
        }

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        client.close();
    }
}