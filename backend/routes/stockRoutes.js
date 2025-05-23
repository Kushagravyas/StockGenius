import express from "express";
import {
  getAllStocks,
  getLiveStockData,
  getCandlestickData,
  getStockPriceData,
} from "../controllers/stockController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

//all routes have(or "use") protect middleware
// router.use(protect);
router.get("/", getAllStocks);
router.get("/:symbol/live", getLiveStockData);
router.get("/:symbol/candles", getCandlestickData);
router.get("/:symbol/price", getStockPriceData);

export default router;
