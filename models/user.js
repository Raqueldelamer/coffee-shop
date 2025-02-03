const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: [6, 'Password must be at least 6 characters.'] },
    role: { type: String, enum: ["user", "admin"], default: "user" },
});

//Hash the password before saving the user
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
    return next();
    }

    try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
    } catch (error) {
    next(error);
    }
});

//Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;