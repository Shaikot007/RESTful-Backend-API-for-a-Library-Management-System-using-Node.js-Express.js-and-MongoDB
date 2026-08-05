import mongoose from "mongoose";

const borrowSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		bookId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Book",
			required: true,
		},
		borrowDate: {
			type: Date,
			required: true,
			default: Date.now,
		},
		returnDate: {
			type: Date,
			required: true,
		},
		status: {
			type: String,
			enum: ["Borrowed", "Returned", "Overdue"],
			default: "Borrowed",
		},
	},
	{
		timestamps: true,
	}
);

const Borrow = mongoose.model("Borrow", borrowSchema);

export default Borrow;