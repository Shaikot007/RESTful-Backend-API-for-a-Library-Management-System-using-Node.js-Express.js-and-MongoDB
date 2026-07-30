import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register User (POST /api/auth/register)
const registerUser = async (req, res) => {
	try {
		const { fullName, email, password, phoneNumber, role } = req.body;

		// Check if email already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ 
				message: "Email already exists!" 
			});
		};

		// Hash Password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// Create new user
		const newUser = await User.create({
			fullName,
			email,
			password: hashedPassword,
			phoneNumber,
			role: role || "User"
		});

		res.status(201).json({
			message: "User registered successfully",
			user: {
				id: newUser._id,
				fullName: newUser.fullName,
				email: newUser.email,
				phoneNumber: newUser.phoneNumber,
				role: newUser.role,
				createdAt: newUser.createdAt
			}
		});
	} 
	catch (error) {
		res.status(500).json({ 
			error: error.message 
		});
	};
};

// Login User (POST /api/auth/login)
const loginUser = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Check user existence
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ 
				message: "Invalid email or password!" 
			});
		};

		// Verify password
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ 
				message: "Invalid email or password!" 
			});
		};

		// Generate JWT Token
		const token = jwt.sign(
			{ id: user._id, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: "1d" }
		);

		res.status(200).json({
			message: "Login successful",
			token,
			user: {
				id: user._id,
				fullName: user.fullName,
				email: user.email,
				role: user.role
			}
		});
	} 
	catch (error) {
		res.status(500).json({ 
			error: error.message 
		});
	};
};

export default {
	registerUser,
	loginUser
};