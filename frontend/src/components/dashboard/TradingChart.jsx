import React, { useEffect, useRef, useState, useCallback } from "react";
import { createChart, CrosshairMode, CandlestickSeries } from "lightweight-charts";
import Loader from "../ui/Loader";
import useFinnhubWebSocket from "@/hooks/useFinnhubWebSocket";

const TradingChart = ({ symbol, interval = "1min" }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const candlestickSeriesRef = useRef(null);
  const resizeObserverRef = useRef(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRealtimeUpdate = useCallback((newCandle) => {
    if (!candlestickSeriesRef.current) return;

    setData((prevData) => {
      const lastIndex = prevData.findIndex((candle) => candle.time === newCandle.time);

      if (lastIndex === -1) {
        // New candle
        candlestickSeriesRef.current.update(newCandle);
        return [...prevData, newCandle];
      } else {
        // Update existing candle
        const updatedData = [...prevData];
        updatedData[lastIndex] = newCandle;
        candlestickSeriesRef.current.update(newCandle);
        return updatedData;
      }
    });
  }, []);

  // Add market status indicator
  const marketStatus = useFinnhubWebSocket(symbol, handleRealtimeUpdate, interval);

  const fetchAlphaVantageData = useCallback(async () => {
    try {
      // Add base URL if needed
    const baseUrl = import.meta.env.VITE_API_URL || '';
    const res = await fetch(`${baseUrl}/stocks/${symbol}/candles?interval=${interval}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }

      const raw = await res.json();
      if (!Array.isArray(raw) || raw.length === 0) {
        throw new Error("No data available for this interval");
      }

      return raw
        .map((item) => ({
          time: new Date(item.date).getTime() / 1000,
          open: parseFloat(item.open),
          high: parseFloat(item.high),
          low: parseFloat(item.low),
          close: parseFloat(item.close),
          volume: parseInt(item.volume),
        }))
        .sort((a, b) => a.time - b.time);
    } catch (err) {
      console.error("Failed to fetch Alpha Vantage data:", err);
      throw err;
    }
  }, [symbol, interval]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const candles = await fetchAlphaVantageData();

        candles.sort((a, b) => a.time - b.time);
        setData(candles);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [symbol, interval, fetchAlphaVantageData]);

  useEffect(() => {
    if (!chartContainerRef.current || !data.length) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      layout: {
        background: { type: "solid", color: "#0f172a" },
        textColor: "#cbd5e1",
        fontSize: 12,
        fontFamily: "Inter, sans-serif",
      },
      grid: {
        vertLines: { color: "#1e293b", style: 1 },
        horzLines: { color: "#1e293b", style: 1 },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: "#475569",
          width: 1,
          style: 1,
          labelBackgroundColor: "#475569",
        },
        horzLine: {
          color: "#475569",
          width: 1,
          style: 1,
          labelBackgroundColor: "#475569",
        },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: "#334155",
        textColor: "#cbd5e1",
        fixLeftEdge: true,
        fixRightEdge: true,
        rightOffset: 12, // Add some space on the right
        barSpacing: 12, // Consistent bar spacing
        tickMarkFormatter: (time) => {
          const date = new Date(time * 1000);
          const hours = date.getHours().toString().padStart(2, "0");
          const minutes = date.getMinutes().toString().padStart(2, "0");
          return `${hours}:${minutes}`;
        },
      },
      rightPriceScale: {
        borderColor: "#334155",
        scaleMargins: { top: 0.2, bottom: 0.2 },
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: true,
      },
      handleScale: {
        mouseWheel: true,
        pinch: true,
      },
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#22c55e",
      downColor: "#ef4444",
      borderVisible: false,
      wickUpColor: "#22c55e",
      wickDownColor: "#ef4444",
      priceFormat: {
        type: "price",
        precision: 2,
        minMove: 0.01,
      },
    });

    candlestickSeries.setData(data);
    chartRef.current = chart;
    candlestickSeriesRef.current = candlestickSeries;

    // Set visible range to last 100 candles
    const timeRange = {
      from: data[Math.max(0, data.length - 100)].time,
      to: data[data.length - 1].time + getIntervalSeconds(interval) * 10, // Add some future space
    };
    chart.timeScale().setVisibleRange(timeRange);

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        // Store current visible range
        const currentVisibleRange = chartRef.current.timeScale().getVisibleLogicalRange();

        // Apply new dimensions
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });

        // Restore visible range
        if (currentVisibleRange) {
          chartRef.current.timeScale().setVisibleLogicalRange(currentVisibleRange);
        }
      }
    };

    window.addEventListener("resize", handleResize);

    resizeObserverRef.current = new ResizeObserver(() => {
      handleResize();
    });

    const containerElement = chartContainerRef.current;
    resizeObserverRef.current.observe(containerElement);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeObserverRef.current && containerElement) {
        resizeObserverRef.current.unobserve(containerElement);
      }
      chart.remove();
    };
  }, [data, interval]);

  return (
    <div className="w-full h-full relative">
      <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
        <span
          className={`h-2 w-2 rounded-full ${
            marketStatus ? "bg-green-500" : "bg-red-500"
          }`}
        />
        <span className="text-xs text-muted-fg">
          {marketStatus ? "Market Open" : "Market Closed"}
        </span>
      </div>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
          <Loader />
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 text-red-500">
          Error: {error}
        </div>
      )}
      <div ref={chartContainerRef} className="w-full h-full" />
    </div>
  );
};

// Helper function to get interval seconds
const getIntervalSeconds = (interval) => {
  switch (interval) {
    case "1min":
      return 60;
    case "5min":
      return 300;
    case "15min":
      return 900;
    case "1D":
      return 86400;
    default:
      return 300;
  }
};

export default TradingChart;
