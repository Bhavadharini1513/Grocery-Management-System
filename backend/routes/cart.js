const express = require("express");
const auth = require("../middleware/auth");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const router = express.Router();

// @route   GET api/cart
// @desc    Get user's cart
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product"
    );
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
      await cart.save();
    }
    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   POST api/cart
// @desc    Add item to cart
// @access  Private
router.post("/", auth, async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ msg: "Insufficient stock" });
    }

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    await cart.populate("items.product");
    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT api/cart/:productId
// @desc    Update cart item quantity
// @access  Private
router.put("/:productId", auth, async (req, res) => {
  const { quantity } = req.body;

  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ msg: "Cart not found" });
    }

    const item = cart.items.find(
      (item) => item.product.toString() === req.params.productId
    );
    if (!item) {
      return res.status(404).json({ msg: "Item not found in cart" });
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter(
        (item) => item.product.toString() !== req.params.productId
      );
    } else {
      const product = await Product.findById(req.params.productId);
      if (product.stock < quantity) {
        return res.status(400).json({ msg: "Insufficient stock" });
      }
      item.quantity = quantity;
    }

    await cart.save();
    await cart.populate("items.product");
    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   DELETE api/cart/:productId
// @desc    Remove item from cart
// @access  Private
router.delete("/:productId", auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ msg: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== req.params.productId
    );
    await cart.save();
    await cart.populate("items.product");
    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   DELETE api/cart
// @desc    Clear cart
// @access  Private
router.delete("/", auth, async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user.id }, { items: [] });
    res.json({ msg: "Cart cleared" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
