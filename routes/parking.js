const express = require("express");
const ParkingSlot = require("../models/ParkingSlot");

const router = express.Router();

// Get all parking slots
router.get("/", async (req, res) => {
  try {
    const slots = await ParkingSlot.find();
    res.json(slots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update slot availability
router.put("/:id", async (req, res) => {
  try {
    const slot = await ParkingSlot.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(slot);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
