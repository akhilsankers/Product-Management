const express = require('express');
const router = express.Router();
const subCategoryController = require('../controllers/subcategoryController');

// Create a new subcategory
router.post('/', subCategoryController.createSubCategory);

// Get all subcategories
router.get('/', subCategoryController.getSubCategories);

module.exports = router;
