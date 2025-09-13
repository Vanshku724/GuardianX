export const Alert = {
  async list(sortBy = "-created_date", limit = 10) {
    return this.filter({}, sortBy, limit);
  },

  async filter(filter = {}, sortBy = "-created_date", limit = 10) {
    // Mock active alerts
    const data = [
      { disaster_type: "Flood", severity: "high", location: "Downtown", status: "active" },
      { disaster_type: "Earthquake", severity: "critical", location: "Uptown", status: "active" },
      { disaster_type: "Fire", severity: "medium", location: "Midtown", status: "active" }
    ];

    // Basic filtering by status
    let filtered = data.filter(alert => !filter.status || alert.status === filter.status);

    return filtered.slice(0, limit);
  }
};
