import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  name: { type: String, required: true },
  bicyclenumber: { type: String, required: true },
  rentalType: { 
    type: String, 
    enum: ["hourly", "daily", "weekly"], 
    required: true 
  },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  totalCost: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ["pending", "active", "completed", "cancelled"], 
    default: "pending" 
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);
