const express = require("express");
const Car = require("../models/Car");

const router = express.Router();

// Register a car
router.post("/register", async (req, res) => {
  try {
    const car = new Car(req.body);
    await car.save();
    res.status(201).json(car);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get car details
router.get("/:carNumber", async (req, res) => {
  try {
    const car = await Car.findOne({ carNumber: req.params.carNumber }).populate("slot");
    res.json(car);
  } catch (err) {
    res.status(404).json({ error: "Car not found" });
  }
});

module.exports = router;
