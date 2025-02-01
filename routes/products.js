// routes/products.js
const express = require("express");
const productRoutes = express.Router();
const Product = require("../models/product");
const upload = require("../middleware/upload");
const auth = require("../middleware/auth");
const role = require("../middleware/role");
const { validateProduct } = require("../middleware/validate");

// Get all products
productRoutes.get("/", async (req, res) => {
    try {
        const products = await Product.find();  // Fetch products
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

// // Create a new product w/ image upload (admin only)
productRoutes.post(
    "/",
    auth,
    role("admin"),
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

        //save to database
        const savedProduct = await product.save();

        res.status(201).json(savedProduct);
        } catch (error) {
        console.error("Error adding new product: ", error);
        res.status(400).json({ error: error.message });
        }
    }
);
// // Create a new product
// productRoutes.post("/", auth, role("admin"), upload.single("image"), validateProduct,
//     async (req, res) => {
//     const { name, description, price, category } = req.body;

//     if (!name || !description || !price || !category) {
//         return res.status(400).json({ error: "All fields (name, description, price, category) are required." });
//     }

//     try {
//         // Create a new product 
//         const newProduct = new Product({
//             name,
//             description,
//             price,
//             category,
//         });

//         // Save the new product to MongoDB
//         const savedProduct = await newProduct.save();

//         // Respond with the saved product
//         res.status(201).json({
//             message: "Product added successfully",
//             product: savedProduct,
//         });
//     } catch (err) {
//         res.status(500).json({ error: "Failed to add product" });
//     }
// });

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
        const {
            page = 1,
            limit = 10,
            category,
            sortBy,
            sortOrder = "asc",
        } = req.query;

      //filter based on the category (if provided)
        const filter = category ? { category } : {};

      //sort based on the sortBy and sortOrder (if provided)
        const sort = sortBy ? { [sortBy]: sortOrder === "asc" ? 1 : -1 } : {};

      // Query the database to get products with filters, sorting, and pagination
        const products = await Product.find(filter)
        .sort(sort)
        .limit(parseInt(limit))
        .skip((page - 1) * limit);

      // Send the total count and the retrieved products as a response
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
            { new: true }  // Return the updated product
        );

        // Check if the product exists
        const existingProduct = await Product.findById(productId);
            if (!existingProduct) {
        return res.status(404).json({ error: "Product not found" });
        }

      // Update image URL only if a new file is provided
        const imageUrl = existingProduct.imageUrl;
            if (req.file && req.file.path) {
            imageUrl = req.file.path;
        }

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
