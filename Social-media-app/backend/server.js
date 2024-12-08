// Import packages
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

// Import routes
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import postsRoute from "./routes/posts.route.js";
import notificationRoute from "./routes/notification.route.js";

// Import database connection
import connectDB from "./db/connecDB.js";

// Configuration files
dotenv.config(); // dotenv
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

// Initialize variables
const app = express();

// CORS configuration
const corsOptions = {
  origin: "http://localhost:5173", // Replace with the frontend URL
  credentials: true, // Allow cookies to be sent
};
app.use(cors(corsOptions));

// Set up middleware
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Resolve __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postsRoute);
app.use("/api/notification", notificationRoute);

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
  });
}

// Connect to the database and start the server
const PORT = process.env.PORT || 5000; // Fallback to port 5000 if not defined in .env
connectDB();
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
