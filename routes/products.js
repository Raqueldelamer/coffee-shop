// routes/products.js
const Router = require("express").Router;
const Product = require("../models/Product");  // Import the Product model
const productRoutes = Router();

// Get all products
productRoutes.get("/", async (req, res) => {
    try {
        const products = await Product.find();  // Fetch products
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

// Create a new product
productRoutes.post("/", async (req, res) => {
    const { name, description, price, category } = req.body;

    if (!name || !description || !price || !category) {
        return res.status(400).json({ error: "All fields (name, description, price, category) are required." });
    }

    try {
        // Create a new product 
        const newProduct = new Product({
            name,
            description,
            price,
            category,
        });

        // Save the new product to MongoDB
        const savedProduct = await newProduct.save();

        // Respond with the saved product
        res.status(201).json({
            message: "Product added successfully",
            product: savedProduct,
        });
    } catch (err) {
        res.status(500).json({ error: "Failed to add product" });
    }
});

// Get a single product by ID
productRoutes.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json(product);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch product" });
    }
});

// Update a product by ID
productRoutes.put("/:id", async (req, res) => {
    const { name, description, price, category } = req.body;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { name, description, price, category },
            { new: true }  // Return the updated product
        );

        if (!updatedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json({
            message: "Product updated successfully",
            product: updatedProduct,
        });
    } catch (err) {
        res.status(500).json({ error: "Failed to update product" });
    }
});

// Delete product by ID
productRoutes.delete("/:id", async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json({ message: "Product deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete product" });
    }
});

module.exports = productRoutes;
