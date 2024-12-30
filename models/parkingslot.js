const mongoose = require("mongoose");

const ParkingSlotSchema = new mongoose.Schema({
  slotNumber: { type: String, required: true, unique: true },
  isAvailable: { type: Boolean, default: true },
});

module.exports = mongoose.model("ParkingSlot", ParkingSlotSchema);
