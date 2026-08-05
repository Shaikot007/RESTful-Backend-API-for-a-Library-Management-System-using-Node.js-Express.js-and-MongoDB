import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import bookController from "../controllers/bookController.js";

const router = express.Router();

// All these routes require a valid JWT
router.post("/books", authMiddleware, bookController.createBook);
router.get("/books", authMiddleware, bookController.getAllBooks);
router.get("/books/:id", authMiddleware, bookController.getBookById);
router.put("/books/:id", authMiddleware, bookController.updateBook);
router.delete("/books/:id", authMiddleware, bookController.deleteBook);
router.post("/books/borrow", authMiddleware, bookController.borrowBook);
router.put("/borrow/:id/return", authMiddleware, bookController.returnBook);
// router.get("/profile", authMiddleware, getProfile);

export default router;