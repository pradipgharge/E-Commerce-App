const express = require("express");
const Product = require("../models/product");
const { verifyToken } = require("../middlewares/auth");

const router = express.Router();

//route to get all products from the db
router.get("/", verifyToken, async (_, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ products: products });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

//route to get a product by productId from the db
router.get("/:productId", verifyToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }
    res.status(200).json({ product: product });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
