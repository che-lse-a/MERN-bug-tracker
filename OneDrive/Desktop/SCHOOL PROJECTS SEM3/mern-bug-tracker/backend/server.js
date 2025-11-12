// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") }); // Force dotenv to load .env from backend root

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Debug: check if dotenv is loading
console.log("Mongo URI:", process.env.MONGO_URI);

// Root route for testing
app.get("/", (req, res) => {
  res.send("🚀 Bug Tracker API is running!");
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));
  
app.get('/health', (req, res) => {
  res.send('Server OK');
});
// Use Render's dynamic port or fallback to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



