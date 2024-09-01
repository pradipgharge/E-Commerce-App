const express = require("express");
const Product = require("../models/product");
const Wishlist = require("../models/wishlist");
const { verifyToken } = require("../middlewares/auth");

const router = express.Router();

//route to get all products in wishlist
router.get("/", verifyToken, async (req, res) => {
  try {
    const { userId } = req.body;
    const wishlist = await Wishlist.findOne({ user: userId }).populate(
      "items.product"
    );

    if (!wishlist) {
      return res.status(404).json({ msg: "Wishlist not found!" });
    }

    res.status(200).json({ wishlist: wishlist });
  } catch (error) {
    console.log(error);
    res.status(400).send("Internal Server Error");
  }
});

//route to add a product to wishlist
router.post("/", verifyToken, async (req, res) => {
  try {
    const { userId, productId } = req.body;

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    // Find the user's wishlist or create a new one
    const wishlist = await Wishlist.findOne({ user: userId }).populate(
      "items.product"
    );
    if (!wishlist) {
      wishlist = new Wishlist({
        user: req.user.userId,
        items: [{ product: productId }],
      });
    } else {
      const itemExists = wishlist.items.some(
        (item) => item.product.toString === productId
      );

      if (itemExists) {
        return res.status(400).json({ msg: "Product already in wishlist" });
      }

      wishlist.items.push({ product: productId });
    }

    await wishlist.save();
    res.status(200).json({ msg: "Product added to wishlist", wishlist });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

//route to remove product from wishlist
router.delete("/delete", verifyToken, async (req, res) => {
  try {
    const { userId, productId } = req.body;

    // Find the user's wishlist
    const wishlist = Wishlist.findOne({ user: userId });
    if (!wishlist) {
      res.status(404).json({ msg: "wishlist not found!" });
    }

    const itemIndex = wishlist.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ msg: "Product not found in wishlist" });
    }

    wishlist.splice(itemIndex, 1);
    await wishlist.save();

    res
      .status(200)
      .json({ msg: "Product removed from wishlist", wishlist: wishlist });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
