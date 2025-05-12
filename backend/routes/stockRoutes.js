import express from "express";
import { getAllStocks, getCandlestickData, getLiveStockData, getStockPriceData } from "../controllers/stockController.js";

const router = express.Router();

router.get("/",getAllStocks);
router.get("/:symbol/live",getLiveStockData);
router.get("/:symbol/candles",getCandlestickData);
router.get("/:symbol/price",getStockPriceData);

export default router;