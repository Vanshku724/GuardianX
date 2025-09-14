import React from "react";

export function Progress({ value = 0, max = 100, className = "" }) {
  return (
    <div className={`w-full bg-gray-200 rounded-full h-3 ${className}`}>
      <div
        className="bg-amber-500 h-3 rounded-full transition-all duration-300"
        style={{ width: `${(value / max) * 100}%` }}
      ></div>
    </div>
  );
}
