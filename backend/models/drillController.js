import DrillHistory from "../models/DrillHistory.js";
import User from "../models/User.js";

/**
 * GET /api/drills/history
 * Returns drill history for current user (protected)
 */
export const getUserDrillHistory = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const history = await DrillHistory.find({ userId }).sort({ completedAt: -1 });
    res.json(history);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/drills/complete
 * Body: { drillId, drillTitle, score, duration }
 * Saves a completed drill entry for current user
 */
export const postCompleteDrill = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { drillId, drillTitle, score = 0, duration = 0 } = req.body;
    const entry = await DrillHistory.create({
      userId,
      drillId,
      drillTitle,
      score,
      duration,
      completedAt: new Date()
    });

    res.status(201).json(entry);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/drills/leaderboard
 * Returns top users by average score & completed count
 */
export const getLeaderboard = async (req, res, next) => {
  try {
    // aggregate by userId
    const agg = await DrillHistory.aggregate([
      { $group: { _id: "$userId", avgScore: { $avg: "$score" }, count: { $sum: 1 } } },
      { $sort: { avgScore: -1, count: -1 } },
      { $limit: 50 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          userId: "$_id",
          avgScore: { $round: ["$avgScore", 1] },
          completed: "$count",
          name: "$user.full_name",
          email: "$user.email"
        }
      }
    ]);
    res.json(agg);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/drills/admin/stats
 * Admin-only stats: completion counts, avg score
 */
export const getDrillStats = async (req, res, next) => {
  try {
    // optional admin check: req.user.role === 'admin'
    const totalCompletions = await DrillHistory.countDocuments();
    const avgScoreObj = await DrillHistory.aggregate([{ $group: { _id: null, avgScore: { $avg: "$score" } } }]);
    const avgScore = (avgScoreObj[0]?.avgScore || 0).toFixed(1);

    // per-drill breakdown
    const perDrill = await DrillHistory.aggregate([
      { $group: { _id: "$drillId", drillTitle: { $first: "$drillTitle" }, count: { $sum: 1 }, avgScore: { $avg: "$score" } } },
      { $sort: { count: -1 } }
    ]);

    res.json({ totalCompletions, avgScore: Number(avgScore), perDrill });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/drills/:drillId
 * Returns drill-specific history entries (admin or for user)
 */
export const getDrillDetailHistory = async (req, res, next) => {
  try {
    const { drillId } = req.params;
    const entries = await DrillHistory.find({ drillId: Number(drillId) }).sort({ completedAt: -1 }).limit(200);
    res.json(entries);
  } catch (err) {
    next(err);
  }
};
