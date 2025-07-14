import express from "express";
import {
  register,
  login,
  getUsers,
  getAllUsers,
  updateProfile,
  updateById,
  deleteProfile,
  deleteById,
  logout,
} from "../controllers/UserController.js";
import {
  authMiddleware,
} from "../middleware/UserMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", authMiddleware, logout);
router.get("/:username", authMiddleware, getUsers);
router.get("/get/all", authMiddleware, getAllUsers);
router.put("/updateProfile", authMiddleware, updateProfile);
router.put("/:id", authMiddleware, updateById);
router.delete("/deleteProfile", authMiddleware, deleteProfile);
router.delete("/:id", authMiddleware, deleteById);

export default router;