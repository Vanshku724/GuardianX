// src/components/sos/EmergencyButton.jsx
import React from "react";
// Use relative import for Button
import { Button } from "../ui/button";
import { Phone } from "lucide-react";

export default function EmergencyButton({ onInitiate }) {
  return (
    <Button
      onClick={onInitiate}
      className="bg-red-600 hover:bg-red-700 text-white w-48 h-12 flex items-center justify-center gap-2"
    >
      <Phone className="w-5 h-5" />
      Trigger SOS
    </Button>
  );
}
