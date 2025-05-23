import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";

export const useStockPrices = (symbols = []) => {
  const [prices, setPrices] = useState({});
  const [wsConnected, setWsConnected] = useState(false);
  const wsRef = useRef(null);
  const currentSymbolsRef = useRef([]);
  const unmountingRef = useRef(false);

  // Helper function to compare symbol arrays
  const areSymbolsEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((symbol, index) => symbol === arr2[index]);
  };

  // Debounced subscription handler
  const handleSubscriptions = useCallback((ws, newSymbols, oldSymbols) => {
    // Skip if new symbols are empty (transition state)
    if (newSymbols.length === 0) return;

    // Unsubscribe from symbols not in new list
    const symbolsToUnsubscribe = oldSymbols.filter(
      (symbol) => !newSymbols.includes(symbol)
    );

    symbolsToUnsubscribe.forEach((symbol) => {
      console.log("Unsubscribing:", symbol);
      ws.send(JSON.stringify({ type: "unsubscribe", symbol }));
    });

    // Subscribe to new symbols not in old list
    const symbolsToSubscribe = newSymbols.filter(
      (symbol) => !oldSymbols.includes(symbol)
    );

    symbolsToSubscribe.forEach((symbol) => {
      console.log("Subscribing:", symbol);
      ws.send(JSON.stringify({ type: "subscribe", symbol }));
    });

    // Update prices object
    setPrices((prev) => {
      const newPrices = { ...prev };
      symbolsToUnsubscribe.forEach((symbol) => {
        delete newPrices[symbol];
      });
      return newPrices;
    });
  }, []);

  useEffect(() => {
    unmountingRef.current = false;

    const connect = () => {
      if (!symbols.length) return;

      console.log("Processing symbols:", symbols);

      if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED) {
        wsRef.current = new WebSocket(
          `wss://ws.finnhub.io?token=${import.meta.env.VITE_FINNHUB_API_KEY}`
        );

        wsRef.current.onopen = () => {
          setWsConnected(true);
          console.log("WebSocket connected");
          handleSubscriptions(wsRef.current, symbols, currentSymbolsRef.current);
          currentSymbolsRef.current = [...symbols];
        };

        wsRef.current.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.type === "trade") {
            const { s: symbol, p: price } = data.data[0];
            if (currentSymbolsRef.current.includes(symbol)) {
              setPrices((prev) => ({
                ...prev,
                [symbol]: price,
              }));
            }
          }
        };

        wsRef.current.onerror = (error) => {
          console.error("WebSocket error:", error);
          setWsConnected(false);
          toast.error("Price updates connection failed");
        };

        wsRef.current.onclose = () => {
          console.log("WebSocket closed");
          setWsConnected(false);
          // Only attempt reconnect if not unmounting
          if (!unmountingRef.current) {
            setTimeout(connect, 5000);
          }
        };
      } else if (wsRef.current.readyState === WebSocket.OPEN) {
        // Only update if symbols actually changed
        if (!areSymbolsEqual(symbols, currentSymbolsRef.current)) {
          console.log("Symbols changed, updating subscriptions");
          handleSubscriptions(wsRef.current, symbols, currentSymbolsRef.current);
          currentSymbolsRef.current = [...symbols];
        }
      }
    };

    connect();

    // Cleanup function
    return () => {
      unmountingRef.current = true;
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        console.log("Cleaning up WebSocket connection on unmount");
        handleSubscriptions(wsRef.current, [], currentSymbolsRef.current);
        wsRef.current.close();
      }
    };
  }, [symbols, handleSubscriptions]);

  return { prices, wsConnected };
};
