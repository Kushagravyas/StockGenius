require("dotenv").config();

import connectDB from "./config/db.js";

import express, { json } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Parse JSON request bodies (e.g., for POST/PUT requests)
app.use(json());

// Log HTTP requests in development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Add security headers in production
if (process.env.NODE_ENV === "production") {
  app.use(helmet());
}

connectDB();

app.get("/", (req, res) => {
  res.send("Stock Analysis Platform Backend is Running!");
});

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`
  );
});