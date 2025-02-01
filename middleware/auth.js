const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = (req, res, next) => {
    let token;

    try {
        token = req.header("Authorization").replace("Bearer ", "");
    } catch (error) {
        return res
        .status(401)
        .json({ message: "Authorization header is missing." });
    }

    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
    res.status(400).json({ error: "Invalid token." });
    }
};

module.exports = auth;