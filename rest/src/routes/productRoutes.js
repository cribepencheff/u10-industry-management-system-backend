import express from "express";
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getTotalValueOfAllProducts,
  getTotalValueByManufacturer,
  getLowStockProducts,
  getProductsByCriticalStock
} from "../controllers/productController.js";

const router = express.Router();

router.get("/total-stock-value", getTotalValueOfAllProducts);
router.get("/total-stock-value-by-manufacturer", getTotalValueByManufacturer);
router.get("/low-stock", getLowStockProducts);
router.get("/critical-stock", getProductsByCriticalStock);

router.post("/", createProduct);
router.get("/", getProducts);
router.get("/:id", getProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
