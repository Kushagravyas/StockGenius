import axios from "axios";

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
const BASE_URL = "https://finnhub.io/api/v1";

export const getFinnhubQuote = async (symbol) => {
  const { data } = await axios.get(`${BASE_URL}/quote`, {
    params: {
      symbol,
      token: FINNHUB_API_KEY
    }
  });
  return data;
};

export const searchFinnhubSymbol = async (keyword) => {
  const { data } = await axios.get(`${BASE_URL}/search`, {
    params: {
      q: keyword,
      token: FINNHUB_API_KEY
    }
  });
  return data;
};

export const getCompanyProfile = async (symbol) => {
  const { data } = await axios.get(`${BASE_URL}/stock/profile2`, {
    params: {
      symbol,
      token: FINNHUB_API_KEY
    }
  });
  return data;
};