const express = require('express');
const router = express.Router();
const imagesController = require('../controllers/imagesController')

router.use(express.json());

router.get('/:id', imagesController.getImage);
router.post('/save', imagesController.saveImage);


module.exports = router;