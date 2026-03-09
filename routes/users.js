import express from "express";
import { getAllUsers, createUser, getUserById, updateUser, loginUser } from "../controllers/userController.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";


const router = express.Router();

// Get all users
router.get("/users", verifyToken, isAdmin, getAllUsers);


// Create a new user
router.post("/users", createUser);

// Login user
router.post("/login", loginUser);

// Get a single user by email
router.get("/users/:email", getUserById);

// Update a user by email
router.put("/users/:email", updateUser);


export default router;
