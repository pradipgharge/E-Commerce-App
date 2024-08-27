const mongoose = require("mongoose");

//define user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    uniqure: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Create the User model using the schema
const User = mongoose.model("user", userSchema);

module.exports = User;
