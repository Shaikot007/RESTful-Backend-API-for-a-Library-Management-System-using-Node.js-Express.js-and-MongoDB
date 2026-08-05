import User from "../models/User.js";
import Book from "../models/Book.js";
import Borrow from "../models/Borrow.js";

// Create a new book
const createBook = async (req, res) => {
	try {
		const { title, author } = req.body;
		const book = await Book.create({
			title,
			author,
			user: req.user // Attached from auth middleware
		});
		res.status(201).json({
			message: "Book created successfully", book
		});
	}
	catch (error) {
		res.status(500).json({
			message: "Server error", error: error.message
		});
	};
};

// Get All Books
const getAllBooks = async (req, res) => {
	try {
		const { search, category, page = 1, limit = 10, sort = 'desc' } = req.query;

		// 1. Build Query Object
		const query = {};

		// Search by title (case-insensitive)
		if (search) {
			query.title = { $regex: search, $options: 'i' };
		};

		// Filter by category
		if (category) {
			query.category = category;
		};

		// 2. Pagination calculation
		const pageNumber = parseInt(page, 10);
		const limitNumber = parseInt(limit, 10);
		const skip = (pageNumber - 1) * limitNumber;

		// 3. Sorting by createdAt ('asc' or 'desc')
		const sortOrder = sort === 'asc' ? 1 : -1;

		// 4. Fetch data and count total documents
		const books = await Book.find(query)
			.sort({ createdAt: sortOrder })
			.skip(skip)
			.limit(limitNumber);

		const totalBooks = await Book.countDocuments(query);

		// 5. Send Response
		res.status(200).json({
			success: true,
			currentPage: pageNumber,
			totalPages: Math.ceil(totalBooks / limitNumber),
			totalResults: totalBooks,
			data: books,
		});
	}
	catch (error) {
		res.status(500).json({
			success: false, message: error.message
		});
	};
};

// Get Single Book
const getBookById = (req, res) => {
	const bookId = parseInt(req.params.id);
	const book = books.find(book => book.id === bookId);

	if (!book) {
		return res.status(404).json({
			message: `Book ID ${bookId} not found.`
		});
	};

	res.status(200).json(book);
};

// Update Book
const updateBook = async (req, res) => {
	try {
		const book = await Book.findById(req.params.id);

		if (!book) {
			return res.status(404).json({ error: "Book not found" });
		}

		// Check if user is Admin or the Owner of the book
		const isAdmin = req.user.role === "admin";
		const isOwner = book.owner.toString() === req.user.id;

		if (!isAdmin && !isOwner) {
			return res.status(403).json({ error: "Access denied. Only owner or admin can update." });
		}

		const updatedBook = await Book.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true, runValidators: true }
		);

		res.status(200).json(updatedBook);
	}
	catch (err) {
		res.status(500).json({
			error: err.message
		});
	};
};

// Delete Book
const deleteBook = async (req, res) => {
	try {
		const bookId = req.params.id;
		const book = await Book.findById(bookId);

		if (!book) {
			return res.status(404).json({ message: "Book not found" });
		};

		// Check if user is Admin or Book Owner
		const isOwner = book.owner.toString() === req.user.id;
		const isAdmin = req.user.role === "admin";

		if (!isOwner && !isAdmin) {
			return res.status(403).json({ message: "Access denied. You cannot delete this book." });
		};

		await Book.findByIdAndDelete(bookId);
		return res.status(200).json({ message: "Book deleted successfully" });
	}
	catch (error) {
		return res.status(500).json({
			message: "Server error",
			error: error.message
		});
	}
};

// Borrow Book
const borrowBook = async (req, res) => {
	try {
		const { userId, bookId } = req.body;

		// Find the book
		const book = await Book.findById(bookId);
		if (!book) {
			return res.status(404).json({
				error: "Book not found"
			});
		};

		// Check if available copies are 0
		if (book.availableCopies <= 0) {
			return res.status(400).json({
				error: "Book not available for borrowing"
			});
		};

		// Decrease available copies by 1
		book.availableCopies -= 1;
		await book.save();

		// Create borrow record
		const newBorrow = new Borrow({
			userId,
			bookId,
			borrowDate: new Date(),
			status: "Borrowed"
		});

		await newBorrow.save();

		res.status(201).json({
			message: "Borrow successful",
			data: newBorrow
		});
	}
	catch (err) {
		res.status(500).json({
			error: "Server error",
			details: err.message
		});
	}
};

// Return a book
const returnBook = async (req, res) => {
	try {
		const borrowId = req.params.id;

		const borrowRecord = await Borrow.findById(borrowId);
		if (!borrowRecord) return res.status(404).json({
			error: "Borrow record not found"
		});

		if (borrowRecord.status === "returned") {
			return res.status(400).json({
				error: "Book is already returned"
			});
		};

		// Update status
		borrowRecord.status = "returned";
		await borrowRecord.save();

		// Increase available copies by 1
		const book = await Book.findById(borrowRecord.bookId);
		if (book) {
			book.availableCopies += 1;
			await book.save();
		};

		res.status(200).json({
			message: "Book returned successfully",
			borrowRecord
		});
	}
	catch (err) {
		res.status(500).json({
			error: err.message
		});
	}
};

const getProfile = async (req, res) => {
	try {
		// req.user.id comes from the decoded token in authMiddleware
		const user = await User.findById(req.user.id).select('-password');

		if (!user) {
			return res.status(404).json({
				message: "User not found"
			});
		};

		res.status(200).json({
			success: true,
			data: user,
		});
	}
	catch (error) {
		console.error(error.message);
		res.status(500).json({
			message: "Server Error"
		});
	}
};

export default {
	createBook,
	getAllBooks,
	getBookById,
	updateBook,
	deleteBook,
	borrowBook,
	returnBook,
	getProfile
};