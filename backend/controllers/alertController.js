import Alert from "../models/Alert.js";

export const getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ status: "active" })
      .sort({ created_date: -1 })
      .limit(20);
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching alerts", error: error.message });
  }
};
