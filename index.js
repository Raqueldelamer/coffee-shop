const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3004;
const productRoutes = require("./routes/products");
require("dotenv").config();

// environment variable connecting to MongoDB
const MONGO_URL = process.env.MONGO_URL;



// Middleware to parse JSON bodies
app.use(express.json());

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

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});