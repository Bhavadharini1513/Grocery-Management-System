const express = require("express");
const Item = require("../models/Item");
const auth = require("../middleware/auth");

const router = express.Router();

// @route   GET api/items
// @desc    Get all items for a user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const items = await Item.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(items);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   POST api/items
// @desc    Add new item
// @access  Private
router.post("/", auth, async (req, res) => {
  const { name, quantity, category, list } = req.body;

  try {
    const newItem = new Item({
      name,
      quantity,
      category,
      list,
      user: req.user.id,
    });

    const item = await newItem.save();
    res.json(item);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT api/items/:id
// @desc    Update item
// @access  Private
router.put("/:id", auth, async (req, res) => {
  const { name, quantity, category, purchased } = req.body;

  try {
    let item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ msg: "Item not found" });
    }

    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    item = await Item.findByIdAndUpdate(
      req.params.id,
      { $set: { name, quantity, category, purchased } },
      { new: true }
    );

    res.json(item);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   DELETE api/items/:id
// @desc    Delete item
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    let item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ msg: "Item not found" });
    }

    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    await Item.findByIdAndRemove(req.params.id);
    res.json({ msg: "Item removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
