import express from "express";
import {
  getDashboardSummary,
  getRecentStock,
  getSystemStatus
} from "../controllers/dashboardController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.get("/summary", getDashboardSummary);
router.get("/recent-stock", getRecentStock);
router.get("/system-status", getSystemStatus);

export default router;

