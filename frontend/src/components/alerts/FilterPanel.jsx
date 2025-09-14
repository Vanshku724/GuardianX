// src/components/alerts/FilterPanel.jsx
import React from "react";

export default function FilterPanel({ filters, onFilterChange }) {
  const handleChange = (key, value) => {
    onFilterChange(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-4">
      <h3 className="font-semibold text-slate-800">Filters</h3>

      <div className="space-y-2">
        <label className="text-sm font-medium">Severity</label>
        <select
          className="w-full border border-slate-300 rounded-lg p-2"
          value={filters.severity}
          onChange={e => handleChange("severity", e.target.value)}
        >
          <option value="all">All</option>
          <option value="critical">Critical</option>
          <option value="moderate">Moderate</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Disaster Type</label>
        <select
          className="w-full border border-slate-300 rounded-lg p-2"
          value={filters.disaster_type}
          onChange={e => handleChange("disaster_type", e.target.value)}
        >
          <option value="all">All</option>
          <option value="flood">Flood</option>
          <option value="earthquake">Earthquake</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Status</label>
        <select
          className="w-full border border-slate-300 rounded-lg p-2"
          value={filters.status}
          onChange={e => handleChange("status", e.target.value)}
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>
    </div>
  );
}
