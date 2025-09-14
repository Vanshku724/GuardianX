import express from "express";
import {
  getUserDrillHistory,
  postCompleteDrill,
  getLeaderboard,
  getDrillStats,
  getDrillDetailHistory
} from "../controllers/drillController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected routes
router.get("/history", protect, getUserDrillHistory);
router.post("/complete", protect, postCompleteDrill);

// Public/analytics
router.get("/leaderboard", getLeaderboard); // can be public or protected
router.get("/admin/stats", protect, adminOnly, getDrillStats);
router.get("/:drillId", protect, getDrillDetailHistory);

export default router;
