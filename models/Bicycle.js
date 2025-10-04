import mongoose from "mongoose";

const bicycleSchema = new mongoose.Schema({
  bicyclenumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { 
    type: String, 
    enum: ["Mountain", "Road", "Other"],
    required: true },
  pricePerHour: { type: Number, required: true },
  pricePerDay: { type: Number, required: true },
  pricePerWeek: { type: Number, required: true },
  isAvailable: { type: Boolean, default: true },
});

export default mongoose.model("Bicycle", bicycleSchema);
