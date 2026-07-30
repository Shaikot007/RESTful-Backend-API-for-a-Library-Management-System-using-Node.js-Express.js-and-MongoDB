import mongoose from "mongoose";

const connectDB = async () => {
	try {
		const mongoUri = await mongoose.connect(process.env.MONGO_URI);
		console.log(`MongoDB Connected: ${mongoUri.connection.host}`);
	}
	catch (error) {
		console.error(`Database connection error: ${error.message}`);
		process.exit(1); // Stop the application if connection fails
	}
};

export default connectDB;