import User from "../models/User.js";

export const getMe = async (req, res) => {
  try {
    // Assuming user info is attached by auth middleware
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user data", error: error.message });
  }
};
