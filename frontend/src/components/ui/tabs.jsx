// src/components/ui/tabs.jsx
import React, { useState } from "react";

export function Tabs({ value, onValueChange, children, className }) {
  return <div className={className}>{children}</div>;
}

export function TabsList({ children, className }) {
  return <div className={className}>{children}</div>;
}

export function TabsTrigger({ value, children, className }) {
  return (
    <button
      className={className}
      type="button"
      onClick={() => value && window.dispatchEvent(new CustomEvent("tab-change", { detail: value }))}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className }) {
  // For simplicity, we always show all contents. You can improve with state mgmt.
  return <div className={className}>{children}</div>;
}
