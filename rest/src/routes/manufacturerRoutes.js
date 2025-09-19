import express from "express";
import {
  createManufacturers,
  getManufacturers,
  getManufacturer,
  updateManufacturer,
  deleteManufacturer,
} from "../controllers/manufacturerController.js";

const router = express.Router();

router.post("/", createManufacturers);
router.get("/", getManufacturers);
router.get("/:id", getManufacturer);
router.put("/:id", updateManufacturer);
router.delete("/:id", deleteManufacturer);

export default router;
