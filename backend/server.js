import express from "express";
import path from "path";
import dotenv from "dotenv";
import connectDB from "./database/connectDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { app, server } from "./socket/socket.js";  // Import app and server from socket.js
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";  // Optional, if you're working with frontend-backend separation

dotenv.config();
connectDB();

const _dirname = path.resolve();

const PORT = process.env.PORT || 5000;

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware
app.use(express.json({ limit: "50mb" }));  // You can adjust the size limit based on your needs
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(cors());  // Optional: Enable CORS for cross-origin requests

// Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/messages", messageRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(_dirname, "frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(_dirname, 'frontend', 'dist', 'index.html'));
  });
}

// Start the server
server.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
