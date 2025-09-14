export const Resource = {
  async list(sortBy = "-created_date", limit = 10) {
    // Mock resources
    return [
      { type: "Ambulance", address: "123 Main St", availability_status: "available" },
      { type: "Rescue Boat", address: "River Dock", availability_status: "available" },
      { type: "Fire Truck", address: "Station 5", availability_status: "busy" }
    ].slice(0, limit);
  }
};
