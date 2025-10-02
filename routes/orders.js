import express from "express";
import { getAllOrders, createOrder, getOrderById, updateOrder, deleteOrder } from "../controllers/orderController.js";

const router = express.Router();

// Get all orders
router.get("/orders", getAllOrders);

// Create a new order
router.post("/orders", createOrder);

// Get a single order by ID
router.get("/orders/:id", getOrderById);

// Update an order by ID
router.put("/orders/:id", updateOrder);

// Delete an order by ID
router.delete("/orders/:id", deleteOrder);

export default router;