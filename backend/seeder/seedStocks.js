import mongoose from "mongoose";
import dotenv from "dotenv";
import Stock from "../models/Stock.js";
import stocks from "./stocksData.js";

dotenv.config();

const seedStocks = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Stock.deleteMany(); // Optional: clear old data
    await Stock.insertMany(stocks);
    console.log("✅ Stock metadata seeded!");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
};

seedStocks();
