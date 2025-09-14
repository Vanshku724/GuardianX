import Resource from "../models/Resource.js";

export const getResources = async (req, res) => {
  try {
    const resources = await Resource.find().sort({ created_date: -1 }).limit(50);
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: "Error fetching resources", error: error.message });
  }
};
