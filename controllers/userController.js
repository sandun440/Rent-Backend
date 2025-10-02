import User from "../models/User.js";
import bcrypt from "bcrypt";

// Get all users (exclude blocked ones)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isBlocked: false }); // Only not-blocked users
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new user (registration)
export const createUser = async (req, res) => {
  try {
    const { name, email, password, type } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email already registered" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      type,
    });
    await user.save();
    res.status(201).json({ message: "User registered successfully", user: { name, email } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get a single user by email
export const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email, isBlocked: false });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ name: user.name, email: user.email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a user by email
export const updateUser = async (req, res) => {
  try {
    const { name, password } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const user = await User.findOneAndUpdate(
      { email: req.params.email, isBlocked: false },
      { $set: updateData },
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User updated successfully", user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


