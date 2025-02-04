const express = require("express");
const router = express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");
const bcrypt = require("bcryptjs");

// POST /users/register - Register a new user
router.post("/users/register", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const user = new User({
            email,
            password: hashedPassword,
            name,
        });

        // Save the user to the database
        await user.save();

        // Send a success response
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST login route
router.post("/users/login", async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        
        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        res.json({ message: "Login successful", user});

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
});

//Get all users (admin only)
router.get("/", auth, async (req, res) => {
    if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied." });
    }

    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Get a single user by ID
router.get("/:id", auth, async (req, res) => {
    try {
    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
    } catch (error) {
    res.status(500).json({ error: error.message });
    }
});

//Update a user by ID
router.put("/:id", auth, async (req, res) => {
    try {
    const { name, email, password, role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    if (name) {
        user.name = name;
    }
    if (email) {
        user.email = email;
    }
    if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
    }
    if (role) {
        user.role = role;
    }

    await user.save();
    res.json(user);
    } catch (error) {
    res.status(400).json({ error: error.message });
    }
});

//Delete a user by ID (admin only)
router.delete("/:id", auth, async (req, res) => {
    if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied." });
    }

    try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
    } catch (error) {
    res.status(500).json({ error: error.message });
    }
});

module.exports = router;