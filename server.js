import "dotenv/config"; // Loads .env variables first
import express from "express";
import connectDB from "./config/db.js";

const app = express();
const port = process.env.port || 5000;

// Connect to MongoDB
connectDB();

// Middleware to parse incoming JSON data
app.use(express.json());

// Root mounting for API paths
// app.use("/api", studentRoutes);

app.get("/", (req, res) => {
	res.send("API is running and database is connected!")
});

app.listen(port, () => {
	console.log(`Server listening on port ${port}`)
});