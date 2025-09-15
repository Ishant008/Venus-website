const Product = require('../models/Product');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Fetch all products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Fetch single product by ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Add new product with Cloudinary image upload
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category } = req.body;
        if (!req.file) return res.status(400).json({ message: 'Image is required' });

        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'products',
        });

        const product = new Product({
            name,
            description,
            price,
            category,
            image: result.secure_url,
            image_public_id: result.public_id // store public_id
        });

        await product.save();

        fs.unlinkSync(req.file.path); // remove local file
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


// Delete product by ID
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Delete image from Cloudinary
        if (product.image_public_id) {
            await cloudinary.uploader.destroy(product.image_public_id);
        }

        // Delete product from MongoDB
        await Product.findByIdAndDelete(req.params.id);

        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


// Update product by ID with optional Cloudinary image
const updateProduct = async (req, res) => {
    try {
        const updateData = { ...req.body };

        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // If new image is provided, delete old image first
        if (req.file) {
            if (product.image_public_id) {
                await cloudinary.uploader.destroy(product.image_public_id);
            }

            // Upload new image
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'products',
            });
            updateData.image = result.secure_url;
            updateData.image_public_id = result.public_id;

            // Remove local file after upload
            fs.unlinkSync(req.file.path);
        }

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(updatedProduct);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


module.exports = { getAllProducts, getProductById, addProduct, deleteProduct, updateProduct };
