const Favorite = require("../models/favorites"); 
const Product = require('../models/Product');

// Add product to favorites
const addFavorite = async (req, res) => {
  try {
    const userId = req.user._id;      
    const { productId } = req.body;   


    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res.status(404).json({ message: 'Product not found' });
    }

    
    const favorite = await Favorite.create({ user: userId, product: productId });
    res.status(201).json(favorite);
  } catch (err) {
   
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Product already favorited by user' });
    }
    console.error(err);
    res.status(500).json({ message: 'Failed to add favorite' });
  }
};

// Remove favorite
const removeFavorite = async (req, res) => {
  try {
    const userId = req.user._id;               // user id from protect middleware
    const productId = req.params.productId;   // product id from URL param

    const result = await Favorite.findOneAndDelete({ user: userId, product: productId });

    if (!result) return res.status(404).json({ message: 'Favorite not found' });

    res.status(200).json({ message: 'Favorite removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to remove favorite' });
  }
};

// Get all favorites for logged in user
const getFavorites = async (req, res) => {
  try {
    const userId = req.user._id;
    const favorites = await Favorite.find({ user: userId }).populate('product');
    res.json(favorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addFavorite,
  getFavorites,
  removeFavorite,
};
