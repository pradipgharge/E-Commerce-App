const mongoose = require("mongoose");

//define category schema
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Create the Category model using the schema
const Category = mongoose.model("category", categorySchema);

module.exports = Category;
