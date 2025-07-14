import express from "express";
import {
    createCrips,
    getAllCrips,
    getCripsById,
    updateCrips,
    deleteCrips,
} from "../controllers/NilaiCripsController.js";
import {
    authMiddleware
} from "../middleware/UserMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createCrips);
router.get("/", authMiddleware, getAllCrips);
router.get("/:id", authMiddleware, getCripsById);
router.put("/:id", authMiddleware, updateCrips);
router.delete("/:id", authMiddleware, deleteCrips);

export default router;