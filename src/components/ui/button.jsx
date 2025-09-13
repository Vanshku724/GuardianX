// src/components/ui/button.jsx
import React from "react";

export function Button({ children, onClick, className, type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium transition ${className || ""}`}
    >
      {children}
    </button>
  );
}
