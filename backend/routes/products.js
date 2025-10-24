const express = require("express");
const auth = require("../middleware/auth");
const Product = require("../models/Product");

const router = express.Router();

// @route   GET api/products
// @desc    Get all products
// @access  Public
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/products/:id
// @desc    Get product by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Product not found" });
    }
    res.status(500).send("Server error");
  }
});

// @route   POST api/products
// @desc    Add new product
// @access  Private (Admin only)
router.post("/", auth, async (req, res) => {
  const { name, description, price, stock, category, image } = req.body;

  try {
    // Check if user is admin
    const user = await require("../models/User").findById(req.user.id);
    if (user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied. Admin only." });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      stock,
      category,
      image,
    });

    const product = await newProduct.save();
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT api/products/:id
// @desc    Update product
// @access  Private (Admin only)
router.put("/:id", auth, async (req, res) => {
  const { name, description, price, stock, category, image } = req.body;

  try {
    // Check if user is admin
    const user = await require("../models/User").findById(req.user.id);
    if (user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied. Admin only." });
    }

    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: { name, description, price, stock, category, image } },
      { new: true }
    );

    res.json(product);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Product not found" });
    }
    res.status(500).send("Server error");
  }
});

// @route   DELETE api/products/:id
// @desc    Delete product
// @access  Private (Admin only)
router.delete("/:id", auth, async (req, res) => {
  try {
    // Check if user is admin
    const user = await require("../models/User").findById(req.user.id);
    if (user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied. Admin only." });
    }

    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    await Product.findByIdAndRemove(req.params.id);
    res.json({ msg: "Product removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Product not found" });
    }
    res.status(500).send("Server error");
  }
});

module.exports = router;
