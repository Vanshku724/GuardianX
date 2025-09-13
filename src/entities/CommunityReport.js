export const CommunityReport = {
  async list(sortBy = "-created_date", limit = 5) {
    // Mock community reports
    const data = [
      {
        id: 1,
        title: "Flood in Riverside",
        location: "Riverside District",
        status: "pending",
        created_date: new Date("2025-09-10T10:30:00")
      },
      {
        id: 2,
        title: "Fire near Industrial Zone",
        location: "Industrial Zone",
        status: "pending",
        created_date: new Date("2025-09-11T14:45:00")
      },
      {
        id: 3,
        title: "Earthquake tremors felt",
        location: "Downtown",
        status: "pending",
        created_date: new Date("2025-09-12T08:20:00")
      },
      {
        id: 4,
        title: "Power outage reported",
        location: "Uptown",
        status: "resolved",
        created_date: new Date("2025-09-12T09:50:00")
      },
      {
        id: 5,
        title: "Road blockage due to landslide",
        location: "Hill Road",
        status: "pending",
        created_date: new Date("2025-09-12T07:10:00")
      }
    ];

    // Sort descending by created_date if requested
    const sorted = sortBy === "-created_date"
      ? data.sort((a, b) => b.created_date - a.created_date)
      : data.sort((a, b) => a.created_date - b.created_date);

    return sorted.slice(0, limit);
  }
};
