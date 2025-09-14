// File: src/components/preparedness/EmergencyKit.jsx
import React from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

export default function EmergencyKit({ items = [], onUpdate, isLoading }) {
  const handleCheck = (itemId) => {
    const updatedItems = items.map(item =>
      item.id === itemId ? { ...item, is_checked: !item.is_checked } : item
    );
    onUpdate(updatedItems);
  };

  return (
    <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
      <CardContent className="p-4">
        <CardTitle>Emergency Kit</CardTitle>
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-6 bg-slate-200 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <ul className="space-y-2 mt-2">
            {items.map(item => (
              <li key={item.id} className="flex items-center gap-2">
                <Checkbox checked={item.is_checked} onChange={() => handleCheck(item.id)} />
                <span>{item.name}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
