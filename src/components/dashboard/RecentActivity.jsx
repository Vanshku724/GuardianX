import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Activity } from "lucide-react";

export default function RecentActivity({ reports }) {
  return (
    <Card className="shadow-md rounded-2xl border border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-500" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 max-h-64 overflow-y-auto">
        {reports.length === 0 ? (
          <p className="text-gray-500">No recent reports.</p>
        ) : (
          <ul className="space-y-2">
            {reports.map((r, i) => (
              <li key={i} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-sm text-gray-700">{r.title}</span>
                <span className="text-xs text-gray-500">{format(new Date(r.created_date), "MMM d, h:mm a")}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
