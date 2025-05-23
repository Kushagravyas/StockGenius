import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import watchlistReducer from "./slices/watchlistSlice";
import aiReducer from "./slices/aiSlice";
import stockReducer from "./slices/stockSlice";
import adminReducer from "./slices/adminSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    watchlist: watchlistReducer,
    ai: aiReducer,
    stocks: stockReducer,
    admin: adminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Export the store as default
export default store;
