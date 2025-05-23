import express from "express";
import {
  register,
  login,
  getMe,
  updateProfile,
  resetPassword,
  deleteUserAccount,
} from "../controllers/authController.js";
import { uploadUserPhoto } from "../utils/upload.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
// protected route with token
router.get("/me", protect, getMe);
router.patch("/update-profile", protect, uploadUserPhoto, updateProfile);
router.patch("/delete-account", protect, deleteUserAccount);
router.patch("/reset-password", protect, resetPassword);

export default router;
