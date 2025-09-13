import React from "react";
import { Button } from "@/components/ui/button";

export default function SmartRecommendations({ aiAnalysis, userLocation, performAnalysis, isAnalyzing }) {
  return (
    <div className="bg-purple-50 border border-purple-200 p-4 rounded-xl">
      <h2 className="text-lg font-bold text-purple-700 mb-2">AI Recommendations</h2>
      <p className="text-purple-800 mb-2">
        {aiAnalysis?.overall_assessment || "No analysis yet."}
      </p>
      <Button onClick={performAnalysis} disabled={isAnalyzing}>
        {isAnalyzing ? "Analyzing..." : "Run AI Analysis"}
      </Button>
    </div>
  );
}
