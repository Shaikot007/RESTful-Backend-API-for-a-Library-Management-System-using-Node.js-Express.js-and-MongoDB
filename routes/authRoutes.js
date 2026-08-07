import express from "express";
const router = express.Router();
import authMiddleware from "../middleware/authMiddleware.js";
import authController from "../controllers/authController.js";

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);

export default router;