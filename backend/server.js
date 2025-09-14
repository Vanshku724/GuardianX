// backend/server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import aiRoutes from "./routes/aiRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
import alertRoutes from "./routes/alertRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js";
import drillRoutes from "./routes/drillRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
app.use("/api/community", communityRoutes);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI not found in .env. Please set it before running.");
  process.exit(1); // Stop the server until you fix it
}

app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/ai", aiRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/drills", drillRoutes);

// MongoDB Connection
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });
