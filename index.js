const errorHandler = require("./middleware/errorHandler");
const express = require("express");
const mongoose = require("mongoose");
const auth = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users")
const productRoutes = require("./routes/products");
const path = require("path");
require("dotenv").config();

// environment variable connecting to MongoDB
const MONGO_URL = process.env.MONGO_URL;

const app = express();
const port = process.env.PORT || 3003;

// Middleware to parse JSON bodies
app.use(express.json());

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
app.use("/users", auth, userRoutes);

//auth routes
app.use("/auth", authRoutes);

//error handling middleware
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});