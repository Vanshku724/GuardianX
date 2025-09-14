// src/components/dashboard/AlertSummary.jsx
import React from "react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";

export function AlertSummary({ alerts }) {
  return (
    <Card>
      <h3 className="text-lg font-semibold mb-3">Recent Alerts</h3>
      {alerts.length === 0 ? (
        <p className="text-gray-500">No alerts right now.</p>
      ) : (
        <ul className="space-y-2">
          {alerts.map((a, i) => (
            <li key={i} className="flex justify-between">
              <span>{a.title}</span>
              <Badge variant={a.severity}>{a.severity}</Badge>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
