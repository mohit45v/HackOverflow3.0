import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import firebaseAdmin from "firebase-admin";
import { createServer } from "http";
import { Server as SocketServer } from 'socket.io';

// Utilities & Routes
import connectDB from "./utils/connection.util.js";
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

// Firebase Initialization
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

// Server Configuration
dotenv.config();
const PORT = process.env.PORT || 3000;
connectDB();
const app = express();
const server = createServer(app);

// CORS Configuration
const CORS_OPTIONS = {
  origin: process.env.ALLOWED_ORIGINS.split(','),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  allowEIO3: true,
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
};

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(CORS_OPTIONS));

// Routes
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

// Initialize Socket.IO
const io = new SocketServer(server, CORS_OPTIONS);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Broadcast user count
  io.emit('message', {
    type: 'system',
    text: `${io.engine.clientsCount} users online`,
    timestamp: new Date()
  });

  socket.on('message', (message) => {
    io.emit('message', {
      text: message,
      userId: socket.id,
      timestamp: new Date()
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    io.emit('message', {
      type: 'system',
      text: `${io.engine.clientsCount} users online`,
      timestamp: new Date()
    });
  });
});

// Start Server
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
