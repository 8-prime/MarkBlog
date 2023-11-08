const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { getDbClient } = require('../utils/clientUtils');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

require('dotenv').config()

const saltRounds = 10;

exports.login = async (req, res) => {
    const { user, password } = req.body;
    
    if (!user || !password) {
        res.status(400).send('Invalid email or password');
        return;
    }
    
    const client = getDbClient();
    const db = client.db('users');
    const collection = db.collection('users')


    const existing = await collection.findOne({ user });
    if(!existing) {
        res.status(400).send('Invalid username or password');
        return;
    }
    
    bcrypt.compare(password, existing.password, function(err, result) {
        if (!result){
            console.log("wrong pw");
            res.status(400).send('Invalid username or password');
            return;
        }

        const token = jwt.sign(existing, process.env.JWT_SECRET , { expiresIn: '1h'});

        res.cookie('jwt', token);
        res.status(200).send({jwt: token});
        // result == false
    });
}

exports.register = async (req, res) => {
    const { user, password } = req.body;

    if (!user || !password) {
        res.status(400).send('Invalid email or password');
        return;
    }
    
    const client = getDbClient();
    const db = client.db('users');
    const collection = db.collection('users')
    
    const existing = await collection.findOne({ user });
    if(existing) {
        res.status(400).send('Invalid username');
        return;
    }

    
    const hashPw = await bcrypt.hash(password, saltRounds);

    console.log(hashPw);

    const newUser = {
        _id: new ObjectId(),
        user,
        password: hashPw
    }

    await collection.insertOne(newUser);

    const token = await jwt.sign(newUser, process.env.JWT_SECRET , { expiresIn: '1h'});

    res.cookie('jwt', token);
    res.status(201).send({jwt:token});
}