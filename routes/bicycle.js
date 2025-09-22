import express from "express";
import { getAllBicycles, createBicycle, getBicycleById } from "../controllers/bicycleController.js";


const router = express.Router();

// Get all bicycle
router.get("/bicycles", getAllBicycles);

// Add a new bicycle
router.post("/bicycles", createBicycle);

router.get("/bicycles/:bicyclenumber", getBicycleById);

export default router;