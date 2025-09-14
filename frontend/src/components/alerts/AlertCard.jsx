// src/components/alerts/AlertCard.jsx
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MapPin, Clock } from "lucide-react";
import { format } from "date-fns";

export default function AlertCard({ alert }) {
  return (
    <Card className="border border-slate-200 rounded-xl">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{alert.title}</span>
          <span
            className={`px-2 py-1 rounded text-xs ${
              alert.severity === "critical"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {alert.severity}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-slate-600">
        <p>{alert.description}</p>
        <div className="flex items-center gap-3 text-slate-500 text-xs">
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4" /> {alert.location}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" /> {format(new Date(alert.created_date), "PPpp")}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
