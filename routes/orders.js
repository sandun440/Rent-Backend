import express from "express";
import { getAllOrders, createOrder, getOrderById, updateOrder, deleteOrder, getOrdersByEmail } from "../controllers/orderController.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";


const router = express.Router();

// Get all orders
router.get("/orders", verifyToken, isAdmin, getAllOrders);

// Get orders by user email
router.get("/orders/user/:email", verifyToken, getOrdersByEmail);

// Create a new order
router.post("/orders", verifyToken, createOrder);

// Get a single order by ID
router.get("/orders/:id", verifyToken, getOrderById);

// Update an order by ID
router.put("/orders/:id", verifyToken, isAdmin, updateOrder);

// Delete an order by ID
router.delete("/orders/:id", verifyToken, isAdmin, deleteOrder);


export default router;