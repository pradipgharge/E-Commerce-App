const express = require("express");
const Review = require("../models/review");
const Product = require("../models/product");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth");

//route to get all reviews for a product
router.get("/", async (req, res) => {
  try {
    const { productId } = req.params.productId;

    const reviews = Review.find({ product: productId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({ reviews: reviews });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

//route to get a specific review
router.get("/:reviewId", async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, reviewId } = req.params;

    const review = await Review.findOne({
      product: productId,
      user: userId,
    }).populate("user", "name");
    if (!review) {
      return res.status(404).json({ msg: "Review not found" });
    }

    res.status(200).json({ review: review });
  } catch (error) {
    console.log(error);
  }
});

//route to post a review for a product
router.post("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params.productId;
    const { rating, title, comment } = req.body;

    //Check if user has already reviewed the product
    const existingReview = Review.findOne({ user: userId, product: productId });
    if (existingReview) {
      res.status(400).json({ msg: "You have already reviewed this product" });
    }

    const review = new Review({
      user: userId,
      product: productId,
      rating: rating,
      title: title,
      comment: comment,
    });

    await review.save();
    res.status(201).json({ review: review });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

//route to update a review by reviewId
router.put("/:reviewId", async (req, res) => {
  try {
    const userId = req.user.userId;
    const { reviewId, productId } = req.params;
    const { rating, title, comment } = req.body;

    const review = await Review.findOne({
      _id: reviewId,
      product: productId,
      user: userId,
    });
    if (!review) {
      return res.status(404).json({
        msg: "Review not found or you are not authorized to update it!",
      });
    }

    // Update the review
    review.rating = rating;
    review.comment = comment;

    await review.save();
    res.status(200).json({ msg: "Review updated", review: review });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

//route to delete a review
router.delete("/:reviewId", async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, reviewId } = req.params;

    const review = await Review.findOne({ product: productId, user: userId });
    if (!review) {
      return res.status(400).json({
        msg: "Review not found or you are not authorized to delete it",
      });
    }

    await review.remove();
    res.status(200).json({ msg: "Review deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
