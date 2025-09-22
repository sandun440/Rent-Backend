import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Will be hashed
  isActive: { type: Boolean, default: true }, // To soft-delete or deactivate users
});

export default mongoose.model("User", userSchema);