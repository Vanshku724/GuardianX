import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema({
  type: { type: String, required: true }, // e.g., "Ambulance", "Shelter"
  address: { type: String, required: true },
  availability_status: { type: String, enum: ["available", "unavailable"], default: "available" },
  contact: { type: String },
  created_date: { type: Date, default: Date.now }
});

export default mongoose.model("Resource", resourceSchema);
