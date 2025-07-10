const areasSchema = new mongoose.Schema({
    Areaname: { type: String, required: true },
    vehicleTypes: [{
      type: String,
      required: true
    }],
    prices: [{
      price: { type: Number, required: true }
    }]
  });
  
  const Area = mongoose.model('Area', areasSchema);