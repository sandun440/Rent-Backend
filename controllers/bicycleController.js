import Bicycle from "../models/Bicycle.js";

// Get all bicycles
export const getAllBicycles = async (req, res) => {
  try {
    const bicycles = await Bicycle.find();
    res.json(bicycles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a new bicycle
export const createBicycle = async (req, res) => {
  try {
    const bicycle = new Bicycle(req.body);
    await bicycle.save();
    res.status(201).json(bicycle);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get a single bicycle by bicyclenumber
export const getBicycleById = async (req, res) => {
  try {
    const bicycle = await Bicycle.findOne({ bicyclenumber: req.params.bicyclenumber });
    if (!bicycle) return res.status(404).json({ error: "Bicycle not found" });
    res.json(bicycle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a bicycle by bicyclenumber
export const updateBicycle = async (req, res) => {
  try {
    const bicycle = await Bicycle.findOneAndUpdate(
      { bicyclenumber: req.params.bicyclenumber },
      req.body,
      { new: true, runValidators: true }
    );
    if (!bicycle) return res.status(404).json({ error: "Bicycle not found" });
    res.json(bicycle);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a bicycle by bicyclenumber
export const deleteBicycle = async (req, res) => {
  try {
    const bicycle = await Bicycle.findOneAndDelete({ bicyclenumber: req.params.bicyclenumber });
    if (!bicycle) return res.status(404).json({ error: "Bicycle not found" });
    res.json({ message: "Bicycle deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
