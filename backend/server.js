import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import express, { json } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import authRouter from "./routes/authRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import stockRouter from "./routes/stockRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import watchlistRoutes from "./routes/watchlistRoutes.js";
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

app.get("/", (req, res) => {
  res.send("Stock Analysis Platform Backend is Running!");
});

app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/stocks", stockRouter);
app.use("/api/ai", aiRoutes);
app.use("/api/watchlist", watchlistRoutes);

// Connect to the database
connectDB();

app.listen(PORT, () => {
  console.log(
    `Server running in ${
      process.env.NODE_ENV || "development"
    } mode on port http://localhost:${PORT}`
  );
});
