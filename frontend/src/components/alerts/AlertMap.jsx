// src/components/alerts/AlertMap.jsx
import React from "react";

export default function AlertMap({ alerts }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl h-[400px] flex items-center justify-center">
      <p className="text-slate-500">🗺️ Map visualization coming soon ({alerts.length} alerts)</p>
    </div>
  );
}
