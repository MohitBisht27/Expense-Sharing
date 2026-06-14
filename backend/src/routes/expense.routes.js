import express from "express";
import {
  createExpense,
  getGroupExpenses,
  getExpense,
  updateExpense,
  deleteExpense,
  getCategories,
} from "../controllers/expense.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/", createExpense);

router.route("/:id").get(getExpense).put(updateExpense).delete(deleteExpense);

router.get("/group/:groupId", getGroupExpenses);
router.get("/group/:groupId/categories", getCategories);

export default router;
