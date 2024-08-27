const mongoose = require("mongoose");

//define product schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    min: [1, "Price of the product should be above 1."],
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  imageURL: {
    type: String,
    required: true,
  },
  stockQuantity: {
    type: Number,
    min: [0, "Stock can't be lower than 0."],
    required: true,
  },
});

// Create the Product model using the schema
const Product = mongoose.model("product", productSchema);

module.exports = Product;
