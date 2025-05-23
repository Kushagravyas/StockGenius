import axios from "axios";

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const BASE_URL = "https://www.alphavantage.co/query";

// Get intraday data (5min default interval, safe in free tier)
export const getIntradayData = async (symbol, interval = "5min") => {
  const { data } = await axios.get(BASE_URL, {
    params: {
      function: "TIME_SERIES_INTRADAY",
      symbol,
      interval,
      apikey: ALPHA_VANTAGE_API_KEY,
      outputsize: "compact", // 'compact' = last 100 points
    },
  });
  return data;
};

// Get daily OHLC data (non-adjusted, safe in free tier)
export const getDailyCandlesticks = async (symbol) => {
  const { data } = await axios.get(BASE_URL, {
    params: {
      function: "TIME_SERIES_DAILY",
      symbol,
      apikey: ALPHA_VANTAGE_API_KEY,
    },
  });
  return data;
};

export const getIntradayCandlesticks = async (symbol, interval = "5min") => {
  try {
    const { data } = await axios.get(BASE_URL, {
      params: {
        function: "TIME_SERIES_INTRADAY",
        symbol,
        interval,
        apikey: ALPHA_VANTAGE_API_KEY,
        outputsize: "compact",
      },
    });

    // Add error checking
    if (data["Error Message"]) {
      throw new Error(data["Error Message"]);
    }

    return data;
  } catch (error) {
    console.error("AlphaVantage API Error:", error.message);
    throw error;
  }
};

// Get simple moving average (SMA)
export const getSMA = async (symbol, timePeriod = 20) => {
  const { data } = await axios.get(BASE_URL, {
    params: {
      function: "SMA",
      symbol,
      interval: "daily",
      time_period: timePeriod,
      series_type: "close",
      apikey: ALPHA_VANTAGE_API_KEY,
    },
  });
  return data;
};

// Get relative strength index (RSI)
export const getRSI = async (symbol, timePeriod = 14) => {
  const { data } = await axios.get(BASE_URL, {
    params: {
      function: "RSI",
      symbol,
      interval: "daily",
      time_period: timePeriod,
      series_type: "close",
      apikey: ALPHA_VANTAGE_API_KEY,
    },
  });
  return data;
};

// Company fundamentals (market cap, P/E, etc.)
export const getFundamentals = async (symbol) => {
  const { data } = await axios.get(BASE_URL, {
    params: {
      function: "OVERVIEW",
      symbol,
      apikey: ALPHA_VANTAGE_API_KEY,
    },
  });
  return data;
};

// Get latest price and change percent (Global Quote)
export const fetchGlobalQuote = async (symbol) => {
  const { data } = await axios.get(BASE_URL, {
    params: {
      function: "GLOBAL_QUOTE",
      symbol,
      apikey: ALPHA_VANTAGE_API_KEY,
    },
  });
  return data;
};

// Search for valid stock symbol
export const searchSymbol = async (keyword) => {
  const { data } = await axios.get(BASE_URL, {
    params: {
      function: "SYMBOL_SEARCH",
      keywords: keyword,
      apikey: ALPHA_VANTAGE_API_KEY,
    },
  });

  return data;
};
