const mongoose = require("mongoose");
const User = require("../models/user");
const Product = require("../models/product");

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: Product,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Wishlist = mongoose.model("wishlist", wishlistSchema);

module.exports = Wishlist;
