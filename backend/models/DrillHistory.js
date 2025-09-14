import mongoose from "mongoose";

const drillHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  drillId: { type: Number, required: true },
  drillTitle: { type: String },
  score: { type: Number, default: 0 },
  duration: { type: Number, default: 0 }, // seconds
  completedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("DrillHistory", drillHistorySchema);
