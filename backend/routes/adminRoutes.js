import express from "express";
import { isAdmin, protect } from "../middlewares/authMiddleware.js";
import { allUsers, deleteUser, updateRole } from "../controllers/adminController.js";

const router = express.Router();

router.use(protect, isAdmin);

router.get("/users", allUsers);
router.post("/users", updateRole);
router.get("/users/:userId", deleteUser);

export default router;
