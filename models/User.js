import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	fullName: { type: String, required: true },
	email: { type: String, required: true, unique: true, lowercase: true },
	password: { type: String, required: true },
	phoneNumber: { type: String, required: true },
	role: { type: String, enum: ["Admin", "User"], default: "User" }
}, { timestamps: true }); // Created At এবং Updated At অটোমেটিক তৈরি হবে

export default mongoose.model("User", userSchema);