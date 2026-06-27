import express from "express";
import {
  createStock,
  deleteStock,
  generateBarcode,
  generateItemNumber,
  getStockById,
  getStocks,
  printLabel,
  updateStock
} from "../controllers/stockController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.get("/generate-item-number", generateItemNumber);
router.post("/generate-barcode", generateBarcode);
router.post("/print-label", printLabel);
router.post("/", createStock);
router.get("/", getStocks);
router.get("/:id", getStockById);
router.put("/:id", updateStock);
router.delete("/:id", deleteStock);

export default router;
