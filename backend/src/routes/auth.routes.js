import express from "express";
import {
  register,
  login,
  getMe,
  searchUsers,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.get("/search", protect, searchUsers);

export default router;
