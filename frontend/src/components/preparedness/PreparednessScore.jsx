// File: src/components/preparedness/PreparednessScore.jsx
import React from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle } from "lucide-react";

export default function PreparednessScore({ score = 0, isLoading = false }) {
  return (
    <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
      <CardContent className="p-4 flex flex-col gap-3">
        <CardTitle>Your Preparedness Score</CardTitle>
        {isLoading ? (
          <div className="h-8 bg-slate-200 rounded animate-pulse" />
        ) : (
          <div className="flex flex-col gap-2">
            <div className="text-lg font-semibold text-amber-800">{score}%</div>
            <Progress value={score} max={100} className="h-3 rounded-full" />
            <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
              {score >= 80 ? <CheckCircle className="w-4 h-4 text-green-500" /> : <AlertCircle className="w-4 h-4 text-red-500" />}
              {score >= 80 ? "Well Prepared!" : "Needs Improvement"}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
