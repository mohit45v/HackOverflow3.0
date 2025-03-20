import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import firebaseAdmin from "firebase-admin";
import { WebSocketServer } from "ws"; // Import WebSocket Server
import { createServer } from "http"; // Required for WebSockets

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
const server = createServer(app); // Create an HTTP server

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

// WebSocket Server Setup
const wss = new WebSocketServer({ 
  noServer: true,
  path: "/api/chat"
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

wss.on("connection", (ws, req) => {
  console.log("New WebSocket client connected");

  // Send welcome message
  ws.send(JSON.stringify({
    type: "system",
    message: "Welcome to the chat!"
  }));

  // Handle incoming messages
  ws.on("message", (message) => {
    try {
      const messageStr = message.toString();
      console.log(`Received: ${messageStr}`);
      
      // Broadcast to ALL clients
      wss.clients.forEach((client) => {
        client.send(JSON.stringify({
          type: "message",
          message: messageStr,
          timestamp: new Date().toISOString()
        }));
      });
    } catch (error) {
      console.error('Error handling message:', error);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });

  ws.on("error", (err) => {
    console.error(`WebSocket error: ${err.message}`);
  });
});

// Implement ping-pong interval
const interval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) {
      clients.delete(ws);
      return ws.terminate();
    }
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

wss.on('close', () => {
  clearInterval(interval);
});

// Start HTTP Server with WebSockets Support
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
