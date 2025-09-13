// src/components/sos/ActiveSOSPanel.jsx
import React from "react";
// Use relative import for Button
import { Button } from "../ui/button";
import { MapPin } from "lucide-react";

export default function ActiveSOSPanel({ aiReport, userLocation, onCancel }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 space-y-4">
      <h2 className="text-xl font-bold text-red-700">SOS Active</h2>
      {aiReport && (
        <>
          <p><strong>Summary:</strong> {aiReport.incident_summary}</p>
          <p><strong>Priority Level:</strong> {aiReport.priority_level}</p>
          <p>
            <strong>Recommended Agencies:</strong>{" "}
            {aiReport.recommended_agencies?.join(", ") || "N/A"}
          </p>
          <p><strong>User Guidance:</strong></p>
          <ul className="list-disc ml-6">
            {aiReport.user_guidance?.map((step, idx) => (
              <li key={idx}>{step}</li>
            )) || <li>No guidance available.</li>}
          </ul>
        </>
      )}
      <div className="flex justify-between mt-4">
        <Button variant="outline" onClick={onCancel}>Cancel SOS</Button>
        {userLocation && (
          <Button>
            <MapPin className="w-4 h-4 mr-2" />
            Show Location
          </Button>
        )}
      </div>
    </div>
  );
}
