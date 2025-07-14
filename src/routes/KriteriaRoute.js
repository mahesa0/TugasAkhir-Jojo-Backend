import express from "express";
import {
  createKriteria,
  getKriteria,
  getAllKriteria,
  updateKriteria,
  deleteKriteria,
} from "../controllers/KriteriaController.js";
import { authMiddleware } from "../middleware/UserMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createKriteria);
router.get("/:id", authMiddleware, getKriteria);
router.get("/", authMiddleware, getAllKriteria);
router.put("/:id", authMiddleware, updateKriteria);
router.delete("/:id", authMiddleware, deleteKriteria);

export default router;
