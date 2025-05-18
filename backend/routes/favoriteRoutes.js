const express = require('express');
const router = express.Router();
const {
  addFavorite,
  getFavorites,
  removeFavorite,
} = require('../controllers/favoriteController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getFavorites)
  .post(protect, addFavorite);
router.route('/:productId').delete(protect, removeFavorite);

module.exports = router;
