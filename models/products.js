const mongoose = require("mongoose");

const productsSchema = mongoose.Schema({

    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: {type: String, required: true },
    stock: {type: Number, required: true },
    imageUrl: {type: String, required: true }

});

const Products = mongoose.model("Products", productsSchema)

//default export
module.exports = Products;