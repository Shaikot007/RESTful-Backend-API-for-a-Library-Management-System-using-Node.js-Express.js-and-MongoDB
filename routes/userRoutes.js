import express from "express";
const router = express.Router();
import authMiddleware from "../middleware/authMiddleware.js";
import userController from "../controllers/userController.js";

router.get("/profile", authMiddleware, userController.getProfile);

export default router;