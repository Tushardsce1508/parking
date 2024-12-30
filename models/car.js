const mongoose = require("mongoose");

const CarSchema = new mongoose.Schema({
  ownerName: { type: String, required: true },
  carNumber: { type: String, required: true, unique: true },
  slot: { type: mongoose.Schema.Types.ObjectId, ref: "ParkingSlot" },
});

module.exports = mongoose.model("Car", CarSchema);
