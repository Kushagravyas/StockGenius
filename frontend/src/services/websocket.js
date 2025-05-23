import io from "socket.io-client";

class WebSocketService {
  constructor() {
    this.socket = null;
    this.subscribers = new Map();
  }

  connect() {
    if (!this.socket) {
      this.socket = io(import.meta.env.VITE_WEBSOCKET_URL || "http://localhost:5000");

      this.socket.on("connect", () => {
        console.log("WebSocket connected");
      });

      this.socket.on("priceUpdate", (data) => {
        const handlers = this.subscribers.get("priceUpdate") || [];
        handlers.forEach((handler) => handler(data));
      });

      this.socket.on("watchlistUpdated", (data) => {
        const handlers = this.subscribers.get("watchlistUpdated") || [];
        handlers.forEach((handler) => handler(data));
      });
    }
    return this.socket;
  }

  subscribe(symbol) {
    if (this.socket) {
      this.socket.emit("subscribe", symbol);
    }
  }

  unsubscribe(symbol) {
    if (this.socket) {
      this.socket.emit("unsubscribe", symbol);
    }
  }

  subscribeToUser(userId) {
    if (this.socket) {
      this.socket.emit("subscribeUser", userId);
    }
  }

  on(event, handler) {
    const handlers = this.subscribers.get(event) || [];
    handlers.push(handler);
    this.subscribers.set(event, handlers);
  }

  off(event, handler) {
    const handlers = this.subscribers.get(event) || [];
    const index = handlers.indexOf(handler);
    if (index !== -1) {
      handlers.splice(index, 1);
      this.subscribers.set(event, handlers);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default new WebSocketService();
