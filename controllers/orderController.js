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
    const { userEmail, name, bicyclenumber, startTime, endTime, rentalType } = req.body;

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

      const durationHours = (end - start) / (1000 * 60 * 60);
      const durationDays = (end - start) / (1000 * 60 * 60 * 24);
      const durationWeeks = (end - start) / (1000 * 60 * 60 * 24 * 7);

      switch (rentalType) {
        case "hourly":
          totalCost = Math.ceil(durationHours) * bicycle.pricePerHour;
          break;
        case "daily":
          totalCost = Math.ceil(durationDays) * bicycle.pricePerDay;
          break;
        case "weekly":
          totalCost = Math.ceil(durationWeeks) * bicycle.pricePerWeek;
          break;
        default:
          return res.status(400).json({ error: "Invalid rental type" });
      }
    }

    const order = new Order({
      userEmail,
      name,
      bicyclenumber,
      rentalType,
      startTime: start,
      endTime: endTime ? new Date(endTime) : null,
      totalCost,
      status: "active",
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

// Update an order (end time, status, etc.)
export const updateOrder = async (req, res) => {
  try {
    const { endTime, status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    const updateData = {};
    if (endTime) updateData.endTime = new Date(endTime);
    if (status) updateData.status = status;

    // Recalculate totalCost if endTime is provided
    if (endTime) {
      const start = new Date(order.startTime);
      const end = new Date(endTime);
      if (end <= start) return res.status(400).json({ error: "End time must be after start time" });

      const bicycle = await Bicycle.findOne({ bicyclenumber: order.bicyclenumber });
      if (!bicycle) return res.status(400).json({ error: "Bicycle not found" });

      const durationHours = (end - start) / (1000 * 60 * 60);
      const durationDays = (end - start) / (1000 * 60 * 60 * 24);
      const durationWeeks = (end - start) / (1000 * 60 * 60 * 24 * 7);

      switch (order.rentalType) {
        case "hourly":
          updateData.totalCost = Math.ceil(durationHours) * bicycle.pricePerHour;
          break;
        case "daily":
          updateData.totalCost = Math.ceil(durationDays) * bicycle.pricePerDay;
          break;
        case "weekly":
          updateData.totalCost = Math.ceil(durationWeeks) * bicycle.pricePerWeek;
          break;
      }
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    // If order completed, release bicycle
    if (status === "completed" && updatedOrder) {
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
