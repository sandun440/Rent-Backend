import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Will be hashed
  type: { type: String, required: true, enum: ["customer", "admin"], default: "customer" }, 
  isBlocked: { type: Boolean, default: false }, // To soft-delete or deactivate users
});

export default mongoose.model("User", userSchema);