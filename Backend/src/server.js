import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import firebaseAdmin from "firebase-admin"; // Import Firebase Admin SDK

//utilities imports
import connectDB from "./utils/connection.util.js";

//routes imports
import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import courseRoutes from "./routes/course.routes.js";
import progressRoutes from "./routes/progress.routes.js";
import instructorRoutes from "./routes/instructor.routes.js";
import assessmentRoutes from "./routes/assessment.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import achievementRoutes from "./routes/achievement.routes.js";
import gamificationRoutes from "./routes/gamification.routes.js";
import recommendationRoutes from "./routes/recommendation.routes.js";
import customRoutes from "./routes/custom.routes.js";

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let serviceAccount;
try {
  const serviceAccountPath = join(__dirname, "../service-account.json");
  serviceAccount = JSON.parse(readFileSync(serviceAccountPath));

  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
  });
  console.log("Firebase Admin initialized successfully");
} catch (error) {
  console.warn("Firebase service account not found, authentication features will be limited");
}

//constants
const CORS_OPTIONS = {
  origin: [
    "http://192.168.0.104:3030",
    "http://localhost:3030",
    "http://localhost:3031",
    "http://localhost:5173",  // Add your frontend dev server port if using Vite
    "http://localhost:3000"  // Add your frontend URLs
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

//server config/initialization
dotenv.config();
const PORT = process.env.PORT || 3000;
connectDB();
const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(CORS_OPTIONS));

//routes
app.use(healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/instructor", instructorRoutes);
app.use("/api/assessment", assessmentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/gamification", gamificationRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/roadmap", customRoutes);
// app.use("/api/certificates/handle", certificateRoutes);
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
