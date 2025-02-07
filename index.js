
const errorHandler = require("./middleware/errorHandler");
const express = require("express");
const mongoose = require("mongoose");
const auth = require("./middleware/auth");
const role = require("./middleware/role"); // Ensure role middleware is included here
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const productRoutes = require("./routes/products");
const path = require("path");
const cors = require('cors');
require("dotenv").config();

// environment variable connecting to MongoDB
const MONGO_URL = process.env.MONGO_URL;

const app = express();
const port = process.env.PORT || 3003;

// Middleware to parse JSON bodies
app.use(express.json());

app.use(cors());

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to MongoDB
mongoose
.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    })
    .then(() => {
    console.log('Connected to MongoDB');
    })
    .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    });

// product routes
app.use('/products', productRoutes);    

//users route
app.use("/users", userRoutes);

//auth routes
app.use("/auth", authRoutes);

app.delete('/api/v2/admin/products/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
});
//app.delete('/api/v2/products/:id', (req,res) => {
//        const productId = req.params.id;
 //   });

//error handling middleware
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});