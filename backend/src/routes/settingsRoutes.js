import express from "express";
import {
  changePassword,
  getSettings,
  getSystemStatus,
  testLabel,
  testPrinter,
  updateSettings
} from "../controllers/settingsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.get("/", getSettings);
router.put("/", updateSettings);
router.post("/change-password", changePassword);
router.get("/system-status", getSystemStatus);
router.post("/test-printer", testPrinter);
router.post("/test-label", testLabel);

export default router;
