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

export default {
	getProfile
};