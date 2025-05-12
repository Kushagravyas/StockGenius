import Stock from "../models/Stock.js";
import { getCache, setCache } from "../utils/cache.js";
import {
  getIntradayData,
  getDailyCandlesticks,
  getSMA,
  getRSI,
  getFundamentals,
  fetchGlobalQuote,
  searchSymbol,
} from "../utils/alphaVantage.js";

// GET /api/stocks
export const getAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.find().sort({ symbol: 1 });
    res.json(stocks);
  } catch (err) {
    res.status(500).json({ error: "Failed to load stocks" });
  }
};

// GET /api/stocks/:symbol/live
export const getLiveStockData = async (req, res) => {
  const { symbol } = req.params;
  const upperSymbol = symbol.toUpperCase();
  const cacheKey = `stock:live:${upperSymbol}`;

  try {
    // Check cache
    const cached = await getCache(cacheKey);
    if (cached) return res.json(cached);

    // Validate symbol using Alpha's SYMBOL_SEARCH
    const searchResult = await searchSymbol(upperSymbol);
    const bestMatch = searchResult.bestMatches?.find(
      (match) => match["1. symbol"].toUpperCase() === upperSymbol
    );

    if (!bestMatch) {
      return res.status(404).json({ error: `Symbol "${upperSymbol}" not found.` });
    }

    // Fetch live data
    const [intraday, sma, rsi, fundamentals] = await Promise.all([
      getIntradayData(upperSymbol),
      getSMA(upperSymbol),
      getRSI(upperSymbol),
      getFundamentals(upperSymbol),
    ]);

    const payload = {
      symbol: upperSymbol,
      intraday,
      sma,
      rsi,
      fundamentals,
    };

    // Cache the response for 5 minutes
    await setCache(cacheKey, payload, 300);

    // Dynamically store to DB if not already present
    const exists = await Stock.findOne({ symbol: upperSymbol });
    if (!exists && fundamentals?.Name) {
      await Stock.create({
        symbol: upperSymbol,
        name: fundamentals.Name,
        sector: fundamentals.Sector,
        industry: fundamentals.Industry,
        logoUrl: null,
        marketCap: parseFloat(fundamentals.MarketCapitalization || 0),
        peRatio: parseFloat(fundamentals.PERatio || 0),
      });
    }

    res.json(payload);
  } catch (err) {
    console.error("Stock fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch stock data." });
  }
};

// GET /api/stocks/:symbol/candles
export const getCandlestickData = async (req, res) => {
  const { symbol } = req.params;
  const cacheKey = `stock:candles:${symbol}`;

  try {
    const cached = await getCache(cacheKey);
    if (cached) return res.json(cached);

    const candles = await getDailyCandlesticks(symbol);
    await setCache(cacheKey, candles, 3600); // cache for 1 hour
    res.json(candles);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch candlestick data." });
  }
};

// Get current price with caching
export const getStockPriceData = async (req, res) => {
  const { symbol } = req.params;
  const cacheKey = `price-${symbol}`;

  try {
    const cached = await getCache(cacheKey);
    if (cached) return res.status(200).json({ fromCache: true, ...cached });

    const data = await fetchGlobalQuote(symbol);
    const result = {
      symbol,
      price: data["Global Quote"]?.["05. price"],
      change: data["Global Quote"]?.["10. change percent"],
    };

    await setCache(cacheKey, result, 300); // cache for 5 mins
    res.status(200).json({ fromCache: false, ...result });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stock price data." });
  }
};
