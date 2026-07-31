import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		author: {
			type: String,
			required: true,
			trim: true,
		},
		category: {
			type: String,
			required: true,
			trim: true,
		},
		isbn: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		publishedYear: {
			type: Number,
			required: true,
		},
		description: {
			type: String,
			trim: true,
		},
		availableCopies: {
			type: Number,
			required: true,
			min: 0,
			default: 1,
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{
		timestamps: true, // Automatically handles createdAt and updatedAt
	}
);

const Book = mongoose.model("Book", bookSchema);

export default Book;