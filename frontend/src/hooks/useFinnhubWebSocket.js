import { useState } from "react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

const useFinnhubWebSocket = (symbol, onDataUpdate, interval = "1min") => {
  const candleMapRef = useRef({});
  const [marketStatus, setMarketStatus] = useState(false);

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
        return 60;
    }
  };

  useEffect(() => {
    // Clear candle map when interval changes
    candleMapRef.current = {};
  }, [interval]);

  useEffect(() => {
    const isMarketOpen = () => {
      const now = new Date();
      const day = now.getUTCDay();
      if (day === 0 || day === 6) return false;

      const options = {
        timeZone: "America/New_York",
        hour: "numeric",
        minute: "numeric",
      };
      const etTime = new Date().toLocaleTimeString("en-US", options);
      const [hours, minutes] = etTime.split(":").map(Number);

      const isOpen = hours >= 9 && hours < 16 && (hours !== 9 || minutes >= 30);
      return isOpen;
    };

    let socket;
    let marketCheckInterval;
    const messageQueue = [];

    const connectWebSocket = () => {
      if (!isMarketOpen()) return;

      socket = new WebSocket(
        `wss://ws.finnhub.io?token=${import.meta.env.VITE_FINNHUB_API_KEY}`
      );

      socket.addEventListener("open", () => {
        console.log("WebSocket connected");
        while (messageQueue.length > 0) {
          const msg = messageQueue.shift();
          socket.send(msg);
        }
        socket.send(JSON.stringify({ type: "subscribe", symbol }));
      });

      socket.addEventListener("message", (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "trade") {
          data.data.forEach((trade) => {
            processTradeData(trade);
          });
        }
      });

      socket.addEventListener("error", (error) => {
        console.error("WebSocket error:", error);
      });

      socket.addEventListener("close", () => {
        console.log("WebSocket disconnected");
      });

      marketCheckInterval = setInterval(() => {
        if (!isMarketOpen() && socket) {
          socket.close();
        }
      }, 60000);
      const currentStatus = isMarketOpen();
      if (marketStatus !== currentStatus) {
        setMarketStatus(currentStatus);
        currentStatus
          ? toast.success("Market is Open!")
          : toast.error("Market is Closed!");
      }
    };

    const intervalSeconds = getIntervalSeconds(interval);

    const processTradeData = (trade) => {
      const timestamp = Math.floor(trade.t / 1000);
      const intervalStart = Math.floor(timestamp / intervalSeconds) * intervalSeconds;

      if (!candleMapRef.current[intervalStart]) {
        candleMapRef.current[intervalStart] = {
          time: intervalStart,
          open: trade.p,
          high: trade.p,
          low: trade.p,
          close: trade.p,
        };
        onDataUpdate(candleMapRef.current[intervalStart]);
      } else {
        const candle = candleMapRef.current[intervalStart];
        candle.high = Math.max(candle.high, trade.p);
        candle.low = Math.min(candle.low, trade.p);
        candle.close = trade.p;
        onDataUpdate(candle);
      }
    };

    if (isMarketOpen()) {
      console.log("connectWebSocket()");
      connectWebSocket();
    }

    return () => {
      if (socket?.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: "unsubscribe", symbol }));
        socket.close();
      }
      clearInterval(marketCheckInterval);
    };
  }, [symbol, interval, onDataUpdate, marketStatus]);
};

export default useFinnhubWebSocket;
