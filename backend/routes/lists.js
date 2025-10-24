const express = require("express");
const List = require("../models/List");
const auth = require("../middleware/auth");

const router = express.Router();

// @route   GET api/lists
// @desc    Get all lists for a user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const lists = await List.find({ user: req.user.id })
      .populate("items")
      .sort({ createdAt: -1 });
    res.json(lists);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   POST api/lists
// @desc    Create new list
// @access  Private
router.post("/", auth, async (req, res) => {
  const { name, description } = req.body;

  try {
    const newList = new List({
      name,
      description,
      user: req.user.id,
    });

    const list = await newList.save();
    res.json(list);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT api/lists/:id
// @desc    Update list
// @access  Private
router.put("/:id", auth, async (req, res) => {
  const { name, description } = req.body;

  try {
    let list = await List.findById(req.params.id);
    if (!list) {
      return res.status(404).json({ msg: "List not found" });
    }

    if (list.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    list = await List.findByIdAndUpdate(
      req.params.id,
      { $set: { name, description } },
      { new: true }
    );

    res.json(list);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   DELETE api/lists/:id
// @desc    Delete list
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    let list = await List.findById(req.params.id);
    if (!list) {
      return res.status(404).json({ msg: "List not found" });
    }

    if (list.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    await List.findByIdAndRemove(req.params.id);
    res.json({ msg: "List removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
