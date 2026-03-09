import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const cleanup = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected successfully.");

    const collections = ['bicycles', 'orders', 'users'];
    
    for (const colName of collections) {
      console.log(`Cleaning collection: ${colName}...`);
      try {
        await mongoose.connection.db.collection(colName).deleteMany({});
        console.log(`Successfully cleaned ${colName}.`);
      } catch (e) {
        console.log(`Collection ${colName} might not exist yet or error: ${e.message}`);
      }
    }

    console.log("\nDatabase cleanup complete.");
    process.exit(0);
  } catch (err) {
    console.error("Cleanup error:", err);
    process.exit(1);
  }
};

cleanup();
