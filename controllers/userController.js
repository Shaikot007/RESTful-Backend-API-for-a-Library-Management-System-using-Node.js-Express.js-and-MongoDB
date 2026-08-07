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

export default {
	getProfile,
	updateProfile
};