import {
  getIntradayData,
  getDailyCandlesticks,
  getSMA,
  getRSI,
  getFundamentals,
  fetchGlobalQuote,
} from "../utils/alphaVantage.js";
import { getCache, setCache } from "../utils/cache.js";
import Stock from "../models/Stock.js";
import { geminiClient } from "../utils/gemini.js";
import {
  generateFullAnalysisPrompt,
  generateBasicAnalysisPrompt,
  generateFallbackPrompt,
} from "../utils/aiPrompts.js";

// GET /api/ai/suggest/:symbol
export const getAISuggestion = async (req, res) => {
  const { symbol } = req.params;
  const upperSymbol = symbol.toUpperCase();
  const cacheKey = `ai:suggestion:${upperSymbol}`;
  const maxRetries = 3;
  let retryCount = 0;

  try {
    // Check cache first
    const cached = await getCache(cacheKey);
    if (cached)
      return res.json({
        fromCache: true,
        suggestion: cached,
        promptType: cached.promptType || "unknown",
        dataSource: cached.dataSource || "cache",
      });

    // Try to get real-time market data
    try {
      // Fetch all market data
      const [intraday, daily, sma, rsi, fundamentals, quote] = await Promise.all([
        getIntradayData(upperSymbol),
        getDailyCandlesticks(upperSymbol),
        getSMA(upperSymbol),
        getRSI(upperSymbol),
        getFundamentals(upperSymbol),
        fetchGlobalQuote(upperSymbol),
      ]);

      // If we have all data, use the full analysis prompt
      if (intraday && daily && quote) {
        const stockInfo = {
          symbol: upperSymbol,
          name: fundamentals?.Name || upperSymbol,
          sector: fundamentals?.Sector || "N/A",
          industry: fundamentals?.Industry || "N/A",
          price: quote?.["Global Quote"]?.["05. price"] || "N/A",
          changePercent: quote?.["Global Quote"]?.["10. change percent"] || "N/A",
          marketCap: fundamentals?.MarketCapitalization || "N/A",
          peRatio: fundamentals?.PERatio || "N/A",
          sma: sma?.["Technical Analysis: SMA"] || {},
          rsi: rsi?.["Technical Analysis: RSI"] || {},
        };

        // Try full analysis with retries
        while (retryCount < maxRetries) {
          try {
            const prompt = generateFullAnalysisPrompt(stockInfo);
            const result = await geminiClient.generateContent(prompt);
            const suggestion = await result.response.text();

            await setCache(
              cacheKey,
              {
                suggestion,
                promptType: "full",
                dataSource: "real-time",
              },
              300
            );

            return res.json({
              fromCache: false,
              suggestion,
              promptType: "full",
              dataSource: "real-time",
              timestamp: new Date().toISOString(),
            });
          } catch (modelError) {
            if (
              modelError.message.includes("503") ||
              modelError.message.includes("overloaded")
            ) {
              retryCount++;
              if (retryCount === maxRetries) {
                console.log("Model overloaded, falling back to simplified analysis");
                break;
              }
              // Wait before retrying (exponential backoff)
              await new Promise((resolve) =>
                setTimeout(resolve, Math.pow(2, retryCount) * 1000)
              );
            } else {
              throw modelError; // Rethrow non-overload errors
            }
          }
        }
      }
    } catch (marketDataError) {
      console.log(
        "Market data fetch failed, falling back to database:",
        marketDataError.message
      );
    }

    // Fallback to database with simplified prompt
    const stockFromDB = await Stock.findOne({ symbol: upperSymbol });
    if (!stockFromDB) {
      throw new Error(`No data available for symbol: ${upperSymbol}`);
    }

    try {
      // Try basic analysis first
      const prompt = generateBasicAnalysisPrompt(stockFromDB);
      const result = await geminiClient.generateContent(prompt);
      const suggestion = await result.response.text();

      await setCache(
        cacheKey,
        {
          suggestion,
          promptType: "basic",
          dataSource: "database",
        },
        600
      );

      return res.json({
        fromCache: false,
        suggestion,
        promptType: "basic",
        dataSource: "database",
        timestamp: new Date().toISOString(),
        note: "Analysis based on fundamental data due to market data unavailability",
      });
    } catch (modelError) {
      // If model is still overloaded, use minimal fallback prompt
      if (
        modelError.message.includes("503") ||
        modelError.message.includes("overloaded")
      ) {
        const fallbackPrompt = generateFallbackPrompt(stockFromDB);
        const result = await geminiClient.generateContent(fallbackPrompt);
        const suggestion = await result.response.text();

        await setCache(
          cacheKey,
          {
            suggestion,
            promptType: "fallback",
            dataSource: "database",
          },
          600
        );

        return res.json({
          fromCache: false,
          suggestion,
          promptType: "fallback",
          dataSource: "database",
          timestamp: new Date().toISOString(),
          note: "Simplified analysis provided due to high system load",
        });
      }
      throw modelError;
    }
  } catch (err) {
    console.error("AI Suggestion Error:", err);
    res.status(503).json({
      error: "Failed to generate AI suggestion",
      details: err.message,
      tip: "Service is experiencing high load. Please try again in a few minutes.",
    });
  }
};
