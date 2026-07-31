import express from "express";
import {
	createBook,
	updateBook,
	deleteBook,
	borrowBook,
	getProfile
} from "../controllers/bookController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// All these routes require a valid JWT
router.post("/books", authMiddleware, createBook);
router.put("/books/:id", authMiddleware, updateBook);
router.delete("/books/:id", authMiddleware, deleteBook);
router.post("/books/borrow/:id", authMiddleware, borrowBook);
router.get("/profile", authMiddleware, getProfile);

export default router;
