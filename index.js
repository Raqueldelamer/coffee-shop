
const errorHandler = require("./middleware/errorHandler");
const express = require("express");
const mongoose = require("mongoose");
const auth = require("./middleware/auth");
const role = require("./middleware/role"); // Ensure role middleware is included here
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
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

// Routes setup
app.post('/api/v1/users/register', userRoutes);
app.post('/api/v1/users/login', userRoutes);
app.use('/api/v1/products', productRoutes);  // Use '/api/v1/products' for product routes

app.use("/users", auth, userRoutes); // Use the auth middleware here for user routes

app.use("/auth", authRoutes); // Auth routes without auth middleware (for login/registration)

app.delete('/api/v1/products/:id',
    auth, (req,res) => {
        const productId = req.params.id;
    });

// Error handling middleware
app.use(errorHandler);

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});



// // environment variable connecting to MongoDB
// const MONGO_URL = process.env.MONGO_URL;

// const app = express();
// const port = process.env.PORT || 3003;

// // Middleware to parse JSON bodies
// app.use(express.json());

// // Serve static files
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // Connect to MongoDB
// mongoose
// .connect(MONGO_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     })
//     .then(() => {
//     console.log('Connected to MongoDB');
//     })
//     .catch((error) => {
//     console.error('Error connecting to MongoDB:', error);
//     });

// // product routes
// app.use('/products', productRoutes);    

// //users route
// app.use("/users", auth, userRoutes);

// //auth routes
// app.use("/auth", authRoutes);

// app.delete('/api/v1/products/:id',
//     isAdmin, (req,res) => {
//         const productId = req.params.id;
//     });

// //error handling middleware
// app.use(errorHandler);

// app.listen(port, () => {
//     console.log(`Server is running at http://localhost:${port}`);
// });