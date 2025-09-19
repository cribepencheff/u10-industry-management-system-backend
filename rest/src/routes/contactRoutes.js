import express from "express";
import {
  createContacts,
  getContacts,
  getContact,
  updateContact,
  deleteContact,
} from "../controllers/contactController.js";

const router = express.Router();

router.post("/", createContacts);
router.get("/", getContacts);
router.get("/:id", getContact);
router.put("/:id", updateContact);
router.delete("/:id", deleteContact);

export default router;
