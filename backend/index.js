const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 


app.use('/uploads/products', express.static(path.join(__dirname, './assets/Product')));


// Connect to MongoDB
require('./config/db');

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/category', require('./routes/categoryRoutes'));
app.use('/api/subcategory', require('./routes/subCategoryRoutes'));
app.use('/api/product', require('./routes/productRoutes'));
app.use('/api/favorites',require('./routes/favoriteRoutes'));
// Server Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
