import express from "express";
import { getAllUsers, createUser, getUserById, updateUser, deleteUser } from "../controllers/userController.js";

const router = express.Router();

// Get all users
router.get("/users", getAllUsers);

// Create a new user
router.post("/users", createUser);

// Get a single user by email
router.get("/users/:email", getUserById);

// Update a user by email
router.put("/users/:email", updateUser);

// Delete a user by email
router.delete("/users/:email", deleteUser);

export default router;