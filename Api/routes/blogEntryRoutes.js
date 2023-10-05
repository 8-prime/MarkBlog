const express = require('express');
const router = express.Router();
const blogEntriesController = require('../controllers/blogEntryController');

router.use(express.json());

router.get('/', blogEntriesController.getDisplayEntries);
router.get('/byId/:id', blogEntriesController.getEntryById);
router.get('/find/:search', blogEntriesController.findEntries);
router.post('/add', blogEntriesController.addEntry);
router.put('/edit', blogEntriesController.editEntry);

module.exports = router;