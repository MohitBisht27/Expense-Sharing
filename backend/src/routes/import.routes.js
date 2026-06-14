import express from "express";
import {
  importCSV,
  getImportLogs,
  getImportLog,
} from "../controllers/import.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/group/:groupId", upload.single("file"), importCSV);
router.get("/group/:groupId/logs", getImportLogs);
router.get("/logs/:id", getImportLog);

export default router;
