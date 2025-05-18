const express = require('express');
const router = express.Router();

const {
  upload,           // multer instance exported from your controller
  createProduct,
  getProducts,
  getProductById,
  updateProductById
} = require('../controllers/ProductController');

router.post('/', upload.array('images', 5), createProduct);
router.get('/', getProducts);
router.get('/:id', getProductById);

router.put('/:id', updateProductById);
module.exports = router;
