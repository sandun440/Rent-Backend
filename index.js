import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bicycleRoutes from "./routes/bicycle.js";
import userRoutes from "./routes/users.js";

dotenv.config();

// console.log("MONGO_URI:", process.env.MONGO_URI);

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

  app.use("/api", bicycleRoutes);
  app.use("/api", userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});