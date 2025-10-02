import Order from "../models/Order.js";
import Bicycle from "../models/Bicycle.js";
import User from "../models/User.js";

// Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const { userEmail, name, bicyclenumber, startTime, endTime } = req.body;

    // Validate user exists
    const user = await User.findOne({ email: userEmail, isActive: true });
    if (!user) return res.status(400).json({ error: "User not found or inactive" });
    if (user.name !== name) return res.status(400).json({ error: "Name does not match user" });

    // Check if bicycle exists and is available
    const bicycle = await Bicycle.findOne({ bicyclenumber });
    if (!bicycle || !bicycle.isAvailable) {
      return res.status(400).json({ error: "Bicycle is not available" });
    }

    // Calculate totalCost
    const start = new Date(startTime);
    let totalCost = 0;
    if (endTime) {
      const end = new Date(endTime);
      if (end <= start) return res.status(400).json({ error: "End time must be after start time" });
      const durationHours = (end - start) / (1000 * 60 * 60); // Convert milliseconds to hours
      totalCost = Math.ceil(durationHours) * bicycle.pricePerHour; // Round up to nearest hour
    } else {
      // If no endTime, set totalCost to 0 (to be updated later)
      totalCost = 0;
    }

    const order = new Order({
      userEmail,
      name,
      bicyclenumber,
      startTime: start,
      endTime: endTime ? new Date(endTime) : null,
      totalCost,
      status: "active", // Set to active upon creation
    });

    bicycle.isAvailable = false;
    await bicycle.save();
    await order.save();

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get a single order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update an order (e.g., end time or status)
export const updateOrder = async (req, res) => {
  try {
    const { endTime, status } = req.body;
    const updateData = {};
    if (endTime) updateData.endTime = new Date(endTime);
    if (status) updateData.status = status;

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    // Recalculate totalCost if endTime is provided or changed
    let newTotalCost = order.totalCost;
    if (endTime) {
      const start = new Date(order.startTime);
      const end = new Date(endTime);
      if (end <= start) return res.status(400).json({ error: "End time must be after start time" });
      const durationHours = (end - start) / (1000 * 60 * 60); // Convert milliseconds to hours
      const bicycle = await Bicycle.findOne({ bicyclenumber: order.bicyclenumber });
      if (!bicycle) return res.status(400).json({ error: "Bicycle not found" });
      newTotalCost = Math.ceil(durationHours) * bicycle.pricePerHour; // Round up to nearest hour
      updateData.totalCost = newTotalCost;
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    if (!updatedOrder) return res.status(404).json({ error: "Order not found" });

    // If order is completed, make bicycle available again
    if (status === "completed") {
      const bicycle = await Bicycle.findOne({ bicyclenumber: updatedOrder.bicyclenumber });
      if (bicycle) {
        bicycle.isAvailable = true;
        await bicycle.save();
      }
    }

    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete an order (cancel)
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    if (order.status === "active") {
      const bicycle = await Bicycle.findOne({ bicyclenumber: order.bicyclenumber });
      if (bicycle) {
        bicycle.isAvailable = true;
        await bicycle.save();
      }
    }

    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order cancelled successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};