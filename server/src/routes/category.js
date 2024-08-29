const express = require("express");
const Category = require("../models/category");
const { verifyToken } = require("../middlewares/auth");

const router = express.Router();

//route to get all categories
router.get("/", verifyToken, async (_, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json({ categories: categories });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

//route to get a category by Id
router.get("/:categoryId", verifyToken, async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId);
    if (!category) {
      return res.status(404).json({ msg: "Category not found" });
    }
    res.status(200).json({ category: category });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
