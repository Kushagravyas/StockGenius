import express from "express";
import { getWatchlist, toggleWatchlist } from "../controllers/watchlistController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

//all routes have(or "use") protect middleware
router.use(protect);
router.get("/", getWatchlist);
router.post("/toggle", toggleWatchlist);

export default router;
