// File: src/components/dashboard/StatusCard.jsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"; // use relative path

export default function StatusCard({ title, value, icon: Icon, color }) {
  return (
    <Card className="shadow-md rounded-2xl border border-gray-200 dark:border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className={`w-5 h-5 ${color || "text-gray-500"}`} />}
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
