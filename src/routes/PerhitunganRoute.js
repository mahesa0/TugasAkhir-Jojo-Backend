import express from "express";
import {
    bulkUpsertPerhitungan,
    getAllPerhitungan,
    deletePerhitungan,
    updatePerhitungan
} from "../controllers/PerhitunganController.js";
import {
    authMiddleware
} from "../middleware/UserMiddleware.js";

const router = express.Router();

router.post("/bulk", authMiddleware, bulkUpsertPerhitungan);
router.get("/", authMiddleware, getAllPerhitungan);
router.delete("/:id", authMiddleware, deletePerhitungan);
router.put("/:id", authMiddleware, updatePerhitungan);

export default router;