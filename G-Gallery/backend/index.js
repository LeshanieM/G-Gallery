// Load environment variables at the top
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import GalleryuserAuthRoutes from "./routes/GalleryuserAuthRoutes.js";

const app = express();
const port = process.env.PORT || 5000;
const DB = process.env.DATABASE;

// Check if DB URI is provided
if (!DB) {
  throw new Error("❌ DATABASE environment variable not set in .env file");
}

// Function to connect to DB and start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    // Middlewares
    app.use(cors());
    app.use(express.json());

    // Serve static images
    app.use("/useruploads", express.static("./useruploads"));

    // User routes
    app.use("/user/api", GalleryuserAuthRoutes);

    // Health check route
    app.get("/", (req, res) => {
      res.status(200).json("Server started successfully");
    });

    // Start server
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });

  } catch (err) {
    console.error("❌ Server startup error:", err);
    process.exit(1);
  }
};

// Run the server
startServer();
