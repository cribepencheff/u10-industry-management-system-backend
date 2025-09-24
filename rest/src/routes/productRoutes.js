import express from "express";
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  totalStockValue,
  totalStockValueByManufacturer,
  lowStockProducts,
  criticalStockProducts
} from "../controllers/productController.js";

const router = express.Router();

router.get("/total-stock-value", totalStockValue);
router.get("/total-stock-value-by-manufacturer", totalStockValueByManufacturer);
router.get("/low-stock", lowStockProducts);
router.get("/critical-stock", criticalStockProducts);

router.post("/", createProduct);
router.get("/", getProducts);
router.get("/:id", getProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
