import express from "express";
import { getAllBicycles, createBicycle, getBicycleById, updateBicycle, deleteBicycle } from "../controllers/bicycleController.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";


const router = express.Router();

// Get all bicycles
router.get("/bicycles", getAllBicycles);

// Add a new bicycle
router.post("/bicycles", verifyToken, isAdmin, createBicycle);

// Get a single bicycle by bicyclenumber
router.get("/bicycles/:bicyclenumber", getBicycleById);

// Update a bicycle by bicyclenumber
router.put("/bicycles/:bicyclenumber", verifyToken, isAdmin, updateBicycle);

// Delete a bicycle by bicyclenumber
router.delete("/bicycles/:bicyclenumber", verifyToken, isAdmin, deleteBicycle);


export default router;