const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  ram: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price must be positive']
  },
  quantity: {
    type: Number,
    required: true,
    min: [0, 'Quantity must be positive']
  }
});

module.exports = mongoose.model('Variant', variantSchema);
