const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')

router.use(express.json());

router.post('/login', userController.login);
router.post('/register', userController.register);
router.post('/check:user', userController.checkUserName);


module.exports = router;