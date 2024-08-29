const express = require("express");
const Cart = require("../models/cart");
const Product = require("../models/product");
const { verifyToken } = require("../middlewares/auth");

const router = express.Router();

//route to get all items from the cart of a user
router.get("/", verifyToken, async (req, res) => {
  try {
    const { userId } = req.body;
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart) {
      return res.status(404).json({ msg: "Cart not found" });
    }
    res.status(200).json({ cart: cart });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

//route to add new item to the cart of a user
router.post("/", verifyToken, async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    //check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ msg: "Product not found" });
    }

    // Find the user's cart or create a new one
    let cart = await Cart.findOne({ user: userId });

    if (cart) {
      const existingItemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );
      if (existingItemIndex !== -1) {
        // If the item is already in the cart, update its quantity
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        // If the item is not in the cart, add it as a new item
        cart.items.push({
          product: productId,
          quantity: quantity,
        });
      }
    } else {
      cart = new Cart({
        user: userId,
        items: [{ product: productId, quantity: quantity }],
      });
    }

    // Save the updated cart
    await cart.save();

    res
      .status(200)
      .json({ msg: "Item added to cart successfully", cart: cart });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

//route to update count of an existing item in the cart of a user
router.put("/:productId", verifyToken, async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    //Find the user's cart
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the item in the cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingItemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    if (quantity > 0) {
      // Update the quantity
      cart.items[existingItemIndex].quantity = quantity;
    } else {
      // Remove the item if quantity is 0 or negative
      cart.items.splice(existingItemIndex, 1);
    }

    // Save the updated cart
    await cart.save();

    res.status(200).json({
      msg: quantity > 0 ? "Cart updated succesfully" : "Item removed from cart",
      cart: cart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

//route to remove an item form the cart of a user
router.delete("/:productId", verifyToken, async (req, res) => {
  try {
    const { userId, productId } = req.body;

    //Find the user's cart
    const cart = Cart.findOne({ user: userId });

    if (!cart) {
      res.status(404).json({ msg: "Cart not found!" });
    }

    // Find the index of the item to remove
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingItemIndex === -1) {
      res.status(404).json({ msg: "'Item not found in cart'" });
    }

    // Remove the item from the cart
    cart.items.splice(itemIndex, 1);

    // Save the updated cart
    await cart.save();

    res.status(200).json({
      message: "Item removed from cart successfully",
      cart: cart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
