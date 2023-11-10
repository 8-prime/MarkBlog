const express = require('express');
const router = express.Router();
const blogEntriesController = require('../controllers/blogEntryController');
const { isAuthenticated } = require("../middleware/authCheck")

router.use(express.json());

router.get('/', blogEntriesController.getDisplayEntries);
router.get('/byId/:id', blogEntriesController.getEntryById);
router.get('/find/:search', blogEntriesController.findEntries);
router.get('/findByCreator', isAuthenticated, blogEntriesController.addEntry);
router.post('/add', isAuthenticated, blogEntriesController.addEntry);
router.put('/edit', isAuthenticated, blogEntriesController.editEntry);
router.delete('/remove/:id', isAuthenticated, blogEntriesController.removeEntry);

module.exports = router;