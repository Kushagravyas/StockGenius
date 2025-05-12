import axios from "axios";
const alphaVantage = process.env.ALPHAVANTAGE_API_KEY;
const BASE_URL = "https://www.alphavantage.co/query";

export const getIntradayData = async (symbol, interval = "5min") => {
    const {data}= await axios.get(BASE_URL,{
        params: {
            function: "TIME_SERIES_INTRADAY",
            symbol,
            interval,
            apikey: alphaVantage,
            outputsize: "compact",
        },
    })
    return data;
}

export const getDailyCandlesticks = async (symbol) => {
    const {data} = await axios.get(BASE_URL, {
        params: {
            function: "TIME_SERIES_DAILY",
            symbol,
            apikey: alphaVantage,
        },
    }) 
    return data;
}

export const getSMA = async (symbol, time_period = 20) =>{
    const {data} = await axios.get(BASE_URL, {
        params: {
            function: "SMA",
            symbol,
            interval: "daily",
            time_period,
            apikey: alphaVantage,
        },
    })
    return data;
}

export const getRSI = async (symbol, time_period = 14) => {
    const {data} = await axios.get(BASE_URL, {
        params: {
            function: "RSI",
            symbol,
            interval: "daily",
            time_period,
            apikey: alphaVantage,
        },
    })
    return data;
}
export const getFundamentals = async (symbol) => {
    const {data} = await axios.get(BASE_URL, {
        params: {
            function: "OVERVIEW",
            symbol,
            apikey: alphaVantage,
        },
    })
    return data;
}

export const fetchGlobalQuote = async (symbol) => {
    const {data} = await axios.get(BASE_URL, {
        params: {
            function: "GLOBAL_QUOTE",
            symbol,
            apikey: alphaVantage,
        },
    })
    return data;
}

export const searchSymbol = async (query) => {
    const {data} = await axios.get(BASE_URL, {
        params: {
            function: "SYMBOL_SEARCH",
            keywords: query,
            apikey: alphaVantage,
        },
    })
    return data;
}