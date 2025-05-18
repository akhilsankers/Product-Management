const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/CategoryController');

// Create a new category
router.post('/', categoryController.CreatedCategory);

// Get all categories
router.get('/', categoryController.GetCategory);

module.exports = router;
