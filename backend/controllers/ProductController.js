const path = require('path');
const fs = require('fs');
const multer = require('multer');
const Product = require('../models/Product');
const Variant = require('../models/Variant'); // Import Variant model

// Setup upload directory
const uploadDir = path.join(__dirname, '../assets/Product');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// ================= CREATE PRODUCT =================

const createProduct = async (req, res) => {
  try {
    const { title, category, subcategory, description, variants } = req.body;

    // Parse variants if they come as JSON string
    let parsedVariants;
    try {
      parsedVariants = typeof variants === 'string' ? JSON.parse(variants) : variants;
    } catch (e) {
      return res.status(400).json({ message: 'Invalid variants format' });
    }

    // Validate variants
    if (!Array.isArray(parsedVariants) || parsedVariants.length === 0) {
      return res.status(400).json({ message: 'At least one variant is required' });
    }

    const invalidVariant = parsedVariants.find(v =>
      v.price === undefined || v.quantity === undefined
    );
    if (invalidVariant) {
      return res.status(400).json({ message: 'All variants must have price and quantity' });
    }

    const images = req.files?.map(file => file.filename) || [];

    // Step 1: Create Product
    const product = await Product.create({
      title,
      category,
      subcategory,
      description,
      images
    });

    // Step 2: Create Variants linked to this product
    const variantDocs = await Variant.insertMany(
      parsedVariants.map(v => ({ ...v, product: product._id }))
    );

    // Optional: Attach variants to response
    const productWithVariants = {
      ...product.toObject(),
      variants: variantDocs
    };

    res.status(201).json(productWithVariants);
  } catch (err) {
    console.error('Create Product Error:', err);
    res.status(400).json({
      message: err.message.includes('validation failed')
        ? 'Validation failed: ' + err.message.split(': ')[1]
        : 'Failed to create product'
    });
  }
};

// Placeholder stubs for other methods — implement as needed
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().lean();
    const result = await Promise.all(
      products.map(async (product) => {
        const variants = await Variant.find({ product: product._id }).lean();
        return { ...product, variants };
      })
    );
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const variants = await Variant.find({ product: product._id }).lean();
    res.status(200).json({ ...product, variants });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch product' });
  }
};

const updateProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    console.log(productId);
    console.log(req.body);
    const { title, category, subcategory, description, variants } = req.body;
    console.log(req.body);

    // Parse variants if they come as JSON string
    let parsedVariants;
    try {
      parsedVariants = typeof variants === 'string' ? JSON.parse(variants) : variants;
    } catch (e) {
      return res.status(400).json({ message: 'Invalid variants format' });
    }

    // Validate variants
    if (!Array.isArray(parsedVariants) || parsedVariants.length === 0) {
      return res.status(400).json({ message: 'At least one variant is required' });
    }

    const invalidVariant = parsedVariants.find(v =>
      v.price === undefined || v.quantity === undefined
    );
    if (invalidVariant) {
      return res.status(400).json({ message: 'All variants must have price and quantity' });
    }

    // Step 1: Update product fields (excluding images)
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        title,
        category,
        subcategory,
        description,
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Step 2: Remove existing variants for this product
    await Variant.deleteMany({ product: productId });

    // Step 3: Insert new variants linked to this product
    const variantDocs = await Variant.insertMany(
      parsedVariants.map(v => ({ ...v, product: productId }))
    );

    // Attach variants to response
    const productWithVariants = {
      ...updatedProduct.toObject(),
      variants: variantDocs
    };

    res.status(200).json(productWithVariants);
  } catch (err) {
    console.error('Update Product Error:', err);
    res.status(400).json({
      message: err.message.includes('validation failed')
        ? 'Validation failed: ' + err.message.split(': ')[1]
        : 'Failed to update product'
    });
  }
};



// ================= EXPORT =================

module.exports = {
  upload,
  createProduct,
  getProducts,
  getProductById,
  updateProductById
};
