const Category = require("../models/Category")


//Create a new Category
const CreatedCategory = async (req, res) => {
    try {
        const { name } = req.body;

        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        const category = new Category({ name });
        await category.save();

        res.status(201).json({ message: 'Category created', category });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


// Getting the created category

const GetCategory = async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = {
    CreatedCategory,
    GetCategory
}
