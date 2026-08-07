import User from "../models/User.js";

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

const updateProfile = async (req, res) => {
	try {
		const userId = req.user.id; // From auth middleware
		const { fullName, phoneNumber } = req.body;

		// Find user and update fields
		const updatedUser = await User.findByIdAndUpdate(
			userId,
			{ fullName, phoneNumber },
			{ new: true, runValidators: true }
		).select('-password');

		if (!updatedUser) {
			return res.status(404).json({
				message: "User not found"
			});
		};

		res.status(200).json({
			message: "Profile updated successfully",
			user: updatedUser,
		});
	}
	catch (error) {
		res.status(500).json({
			message: "Server error",
			error: error.message
		});
	}
};

const getBorrowedBooks = async (req, res) => {
	try {
		// Assume user ID comes from auth middleware (req.user.id) or query/params
		const userId = req.user?.id || req.params.userId;

		const user = await User.findById(userId).populate("borrowedBooks");

		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found"
			});
		};

		res.status(200).json({
			success: true,
			count: user.borrowedBooks.length,
			data: user.borrowedBooks
		});
	}
	catch (error) {
		res.status(500).json({
			success: false,
			message: error.message
		});
	}
};

export default {
	getProfile,
	updateProfile,
	getBorrowedBooks
};