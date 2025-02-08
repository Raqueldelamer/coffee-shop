const express = require("express");
const productRoutes = express.Router();
//const adminProductRoutes = express.Router();
const Product = require("../models/product");
const upload = require("../middleware/uploads");
const auth = require("../middleware/auth");
const role = require("../middleware/role"); // Import role middleware here
const { validateProduct } = require("../middleware/validate");

// Create a new product with image upload (admin only)
productRoutes.post("/products", auth,
    role("admin"),  // only admins can add products
    upload.single("image"),
    validateProduct,
    async (req, res) => {
        if (!req.file) {
            console.error("File not uploaded");
            
            return res.status(400).json({ error: "File upload failed" });
        }

        try {
            const { name, description, price, category, stock } = req.body;
            const imageUrl = req.file.path;

            const product = new Product({
                name,
                description,
                price,
                category,
                stock,
                imageUrl,
            });

            const savedProduct = await product.save();
            res.status(201).json(savedProduct);
        } catch (error) {
            console.error("Error adding new product: ", error);
            res.status(400).json({ error: error.message });
        }
    }
);

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

// Get all products with pagination and filter by category
productRoutes.get("/", async (req, res) => {
    try {
        const { page = 1, limit = 50, category, sortBy, sortOrder = "asc" } = req.query;
        const filter = category ? { category } : {};
        const sort = sortBy ? { [sortBy]: sortOrder === "asc" ? 1 : -1 } : {};

        const products = await Product.find(filter)
            .sort(sort)
            .limit(parseInt(limit))
            .skip((page - 1) * limit);

        const total = await Product.countDocuments(filter);
        res.json({ total, products });
    } catch (error) {
        console.error("Error retrieving all products: ", error);
        res.status(500).json({ error: error.message });
    }
});

// Update a product by ID
productRoutes.put("/:id", upload.single("image"), validateProduct, async (req, res) => {
    const { name, description, price, category, stock } = req.body;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { name, description, price, category, stock },
            { new: true }
        );


        if (!updatedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json({
            message: "Product updated successfully",
            product: updatedProduct,
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to update product" });
    }
});

// Delete product by ID (admin only)
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







