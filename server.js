import "dotenv/config"; // Loads .env variables first
import express from "express";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();
const port = process.env.port || 5000;

// Connect to MongoDB
connectDB();

// Middleware to parse incoming JSON data
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
	res.send("API is running and database is connected!")
});

app.listen(port, () => {
	console.log(`Server listening on port ${port}`)
});