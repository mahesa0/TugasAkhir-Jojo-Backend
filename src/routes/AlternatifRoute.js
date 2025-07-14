import express from "express";
import {
  createAlternatif,
  getAlternatif,
  getAllAlternatif,
  updateAlternatif,
  deleteAlternatif,
} from "../controllers/AlternatifController.js";
import {
  authMiddleware
} from "../middleware/UserMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createAlternatif);
router.get("/:Kode", authMiddleware, getAlternatif);
router.get("/", authMiddleware, getAllAlternatif);
router.put("/:Kode", authMiddleware, updateAlternatif);
router.delete("/:Kode", authMiddleware, deleteAlternatif);

export default router;