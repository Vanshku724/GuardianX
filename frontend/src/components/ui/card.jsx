// src/components/ui/card.jsx
import React from "react";

export function Card({ children, className }) {
  return <div className={`bg-white shadow-sm rounded-xl ${className || ""}`}>{children}</div>;
}

export function CardHeader({ children, className }) {
  return <div className={`p-4 border-b border-slate-200 ${className || ""}`}>{children}</div>;
}

export function CardTitle({ children, className }) {
  return <h2 className={`text-lg font-semibold ${className || ""}`}>{children}</h2>;
}

export function CardContent({ children, className }) {
  return <div className={`p-4 ${className || ""}`}>{children}</div>;
}
