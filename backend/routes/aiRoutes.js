import express from "express";
import { getAISuggestion } from "../controllers/aiController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/suggest/:symbol", protect, getAISuggestion);

export default router;
