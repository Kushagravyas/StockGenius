import Stock from "../models/stock.js";
import { getCache, setCache } from "../utils/cache.js";
import {
  getIntradayData,
  getDailyCandlesticks,
  getSMA,
  getRSI,
  getFundamentals,
  fetchGlobalQuote,
  searchSymbol,
  getIntradayCandlesticks,
} from "../utils/alphaVantage.js";

// GET /api/stocks
export const getAllStocks = async (req, res) => {
  try {
    const { search, sector, industry, page = 1, limit = 10 } = req.query;

    // Create filter object
    const filter = {};
    if (search) {
      filter.$or = [
        { symbol: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ];
    }

    // Add sector filter
    if (sector) {
      filter.sector = { $regex: sector, $options: "i" };
    }

    // Add industry filter
    if (industry) {
      filter.industry = { $regex: industry, $options: "i" };
    }

    // Pagination calculations
    const currentPage = Math.max(Number(page) || 1, 1);
    const itemsPerPage = Math.min(Math.max(Number(limit) || 10, 1), 100);
    const skip = (currentPage - 1) * itemsPerPage;

    // Get total count and paginated results
    const totalStocks = await Stock.countDocuments(filter);
    const stocks = await Stock.find(filter)
      .sort({ symbol: 1 })
      .skip(skip)
      .limit(itemsPerPage);

    res.json({
      success: true,
      totalStocks,
      totalPages: Math.ceil(totalStocks / itemsPerPage),
      currentPage,
      itemsPerPage,
      stocks,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Failed to load stocks",
      message: err.message,
    });
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

export const getCandlestickData = async (req, res) => {
  const { symbol } = req.params;
  const { interval = "1D" } = req.query;
  const upperSymbol = symbol.toUpperCase();

  try {
    const cacheKey = `stock:candles:${upperSymbol}:${interval}`;
    const cached = await getCache(cacheKey);
    if (cached) return res.json(cached);

    let raw, timeSeries;

    // Fix: Proper interval handling
    if (interval === "1D") {
      raw = await getDailyCandlesticks(upperSymbol);
      timeSeries = raw["Time Series (Daily)"];
    } else {
      // Fix: Proper interval formatting for intraday
      const intervalMap = {
        "1min": "1min",
        "5min": "5min",
        "15min": "15min",
      };

      const formattedInterval = intervalMap[interval];
      if (!formattedInterval) {
        return res.status(400).json({
          error: "Invalid interval. Supported intervals: 1min, 5min, 15min, 1D",
        });
      }

      raw = await getIntradayCandlesticks(upperSymbol, formattedInterval);
      timeSeries = raw[`Time Series (${formattedInterval})`];
    }

    if (!timeSeries || Object.keys(timeSeries).length === 0) {
      console.error("No data received:", {
        symbol,
        interval,
        response: raw,
      });
      return res.status(404).json({
        error: "No data available for this interval",
        details: raw["Error Message"] || "Try again later",
      });
    }

    const transformed = Object.entries(timeSeries)
      .map(([date, values]) => ({
        date,
        open: parseFloat(values["1. open"]),
        high: parseFloat(values["2. high"]),
        low: parseFloat(values["3. low"]),
        close: parseFloat(values["4. close"]),
        volume: parseInt(values["5. volume"]),
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date)); // Ensure chronological order

    await setCache(cacheKey, transformed, 300);
    res.json(transformed);
  } catch (err) {
    console.error("Candlestick Error:", err);
    res.status(500).json({
      error: "Failed to fetch candlestick data",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

// Get current price with caching
export const getStockPriceData = async (req, res) => {
  const { symbol } = req.params;
  const cacheKey = `price-${symbol}`;
  const upperSymbol = symbol.toUpperCase();

  try {
    // cached data checking
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.status(200).json({
        success: true,
        fromCache: true,
        data: cached,
      });
    }

    // Fetch fresh data if no cache
    const data = await fetchGlobalQuote(upperSymbol);
    const stockData = {
      symbol: upperSymbol,
      price: data["Global Quote"]["05. price"],
      change: data["Global Quote"]["10. change percent"],
      volume: data["Global Quote"]["06. volume"],
    };

    // Update cache
    await setCache(cacheKey, stockData, 300); // Cache for 5 minutes

    // response
    res.status(200).json({
      success: true,
      fromCache: false,
      data: stockData,
    });
  } catch (err) {
    console.error("Error in getStockPriceData:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch stock data",
    });
  }
};
