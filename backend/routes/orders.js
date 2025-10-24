const express = require("express");
const auth = require("../middleware/auth");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const router = express.Router();

// @route   GET api/orders
// @desc    Get user's orders or all orders (admin)
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const user = await require("../models/User").findById(req.user.id);
    let orders;

    if (user.role === "admin") {
      orders = await Order.find()
        .populate("user", "username email")
        .populate("items.product")
        .sort({ createdAt: -1 });
    } else {
      orders = await Order.find({ user: req.user.id })
        .populate("items.product")
        .sort({ createdAt: -1 });
    }

    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "username email")
      .populate("items.product");
    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    // Check if user owns the order or is admin
    const user = await require("../models/User").findById(req.user.id);
    if (order.user._id.toString() !== req.user.id && user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied" });
    }

    res.json(order);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Order not found" });
    }
    res.status(500).send("Server error");
  }
});

// @route   POST api/orders
// @desc    Create new order from cart
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product"
    );
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ msg: "Cart is empty" });
    }

    // Check stock availability
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return res
          .status(400)
          .json({ msg: `Insufficient stock for ${item.product.name}` });
      }
    }

    // Calculate total
    const total = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    // Create order
    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const newOrder = new Order({
      user: req.user.id,
      items: orderItems,
      total,
    });

    const order = await newOrder.save();

    // Update product stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    await order.populate("items.product");
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT api/orders/:id/status
// @desc    Update order status (admin only)
// @access  Private (Admin only)
router.put("/:id/status", auth, async (req, res) => {
  const { status } = req.body;

  try {
    // Check if user is admin
    const user = await require("../models/User").findById(req.user.id);
    if (user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied. Admin only." });
    }

    let order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    order = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true }
    )
      .populate("user", "username email")
      .populate("items.product");

    res.json(order);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Order not found" });
    }
    res.status(500).send("Server error");
  }
});

module.exports = router;
