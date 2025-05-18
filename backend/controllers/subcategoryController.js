const SubCategory = require("../models/subCategory.js");

// Create new subcategory
const createSubCategory = async (req, res) => {
  try {
    const { category, subCategory } = req.body;  // <-- here

    // Check if subCategory already exists under the same category
    const existingSubCat = await SubCategory.findOne({ category, subCategory });
    if (existingSubCat) {
      return res.status(400).json({ message: "SubCategory already exists" });
    }

    // Create and save new subcategory
    const newSubCategory = new SubCategory({ category, subCategory });
    await newSubCategory.save();

    res.status(201).json({ message: "SubCategory created", subCategory: newSubCategory });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all subcategories (optionally filtered by category)
const getSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find();

    res.status(200).json(subCategories);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  createSubCategory,
  getSubCategories,
};
