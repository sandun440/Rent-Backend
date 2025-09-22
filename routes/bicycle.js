import express from "express";
import { getAllBicycles, createBicycle, getBicycleById, updateBicycle, deleteBicycle } from "../controllers/bicycleController.js";

const router = express.Router();

// Get all bicycles
router.get("/bicycles", getAllBicycles);

// Add a new bicycle
router.post("/bicycles", createBicycle);

// Get a single bicycle by bicyclenumber
router.get("/bicycles/:bicyclenumber", getBicycleById);

// Update a bicycle by bicyclenumber
router.put("/bicycles/:bicyclenumber", updateBicycle);

// Delete a bicycle by bicyclenumber
router.delete("/bicycles/:bicyclenumber", deleteBicycle);

export default router;