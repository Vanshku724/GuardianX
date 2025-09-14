import { API_BASE_URL } from "./all"; // all.js exports API_BASE_URL

export const Drill = {
  async history() {
    const res = await fetch(`${API_BASE_URL}/drills/history`, { credentials: "include", headers: authHeader() });
    if (!res.ok) throw new Error("Failed to fetch drill history");
    return res.json();
  },

  async complete(payload) {
    const res = await fetch(`${API_BASE_URL}/drills/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeader() },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Failed to save completed drill");
    return res.json();
  },

  async leaderboard() {
    const res = await fetch(`${API_BASE_URL}/drills/leaderboard`);
    if (!res.ok) throw new Error("Failed to fetch leaderboard");
    return res.json();
  },

  async stats() {
    const res = await fetch(`${API_BASE_URL}/drills/admin/stats`, { headers: authHeader() });
    if (!res.ok) throw new Error("Failed to fetch stats");
    return res.json();
  },

  async getDrillHistory(drillId) {
    const res = await fetch(`${API_BASE_URL}/drills/${drillId}`, { headers: authHeader() });
    if (!res.ok) throw new Error("Failed to fetch drill detail history");
    return res.json();
  }
};

function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}
