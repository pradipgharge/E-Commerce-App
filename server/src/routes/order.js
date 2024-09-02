const express = require("express");
const Order = require("../models/order");
const { verifyToken } = require("../middlewares/auth");

const router = express.Router();

//route to create a new order
router.post("/", verifyToken, async (req, res) => {
  try {
    const { userId, items, totalAmount, shippingAddress } = req.body;

    const newOrder = new Order({
      user: userId,
      items: items,
      totalAmount: totalAmount,
      shippingAddress: shippingAddress,
      status: "pending", // Default status when order is created
    });

    const savedOrder = await newOrder.save();
    res
      .status(200)
      .json({ msg: "Order created successfully", order: savedOrder });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

//route to get all orders of a user
router.get("/", verifyToken, async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await Order.find({ user: userId }).populate("items.product");
    res.status(200).json({ orders: orders });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

//route to get a single order by id
router.get("/:orderId", verifyToken, async (req, res) => {
  try {
    const { orderId } = req.params.orderId;
    const order = await Order.findById({ orderId }).populate("items.porduct");

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    res.status(200).json({ order: order });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//route to update an order
router.put("/:orderId", verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    const { orderId } = req.params.orderId;

    // Find the order and ensure it belongs to the user
    let order = await Order.findById({ orderId }).populate("items.porduct");

    if (!order || order.user.toString() !== req.user.userId) {
      return res.status(404).json({ msg: "Order not found" });
    }

    // Allow user to update certain fields like status (e.g., cancel the order)
    if (status) {
      order.status = status;
    }

    const updatedOrder = await order.save();
    res.status(200).json({ order: updatedOrder });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
