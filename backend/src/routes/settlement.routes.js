import express from "express";
import {
  createSettlement,
  getGroupSettlements,
  getGroupBalance,
  getUserBalanceDetails,
  getSuggestedSettlements,
} from "../controllers/settlement.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/", createSettlement);
router.get("/group/:groupId", getGroupSettlements);
router.get("/group/:groupId/balance", getGroupBalance);
router.get("/group/:groupId/user/:userId/details", getUserBalanceDetails);
router.get("/group/:groupId/suggest", getSuggestedSettlements);

export default router;
