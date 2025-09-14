import mongoose from "mongoose";

const alertSchema = new mongoose.Schema({
  disaster_type: { type: String, required: true },
  severity: { type: String, enum: ["low", "medium", "high", "critical"], required: true },
  location: { type: String, required: true },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  status: { type: String, default: "active" },
  created_date: { type: Date, default: Date.now }
});

export default mongoose.model("Alert", alertSchema);
