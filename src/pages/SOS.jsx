import React, { useState, useEffect } from "react";
import { User, EmergencyContact } from "../entities/all"; // fixed relative import
import { InvokeLLM } from "../integrations/Core";          // fixed relative import
import { Phone, Shield, Brain } from "lucide-react";

import EmergencyButton from "../components/sos/EmergencyButton";
import AITriageModal from "../components/sos/AITriageModal";
import ActiveSOSPanel from "../components/sos/ActiveSOSPanel";
import EmergencyContacts from "../components/sos/EmergencyContacts";

export default function SOS() {
  const [sosStatus, setSosStatus] = useState("idle");
  const [userLocation, setUserLocation] = useState(null);
  const [aiReport, setAiReport] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUserLocation();
    loadUser();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) =>
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }),
        () => setUserLocation({ lat: 40.7128, lng: -74.006 }) // fallback
      );
    } else {
      setUserLocation({ lat: 40.7128, lng: -74.006 });
    }
  };

  const loadUser = async () => {
    const me = await User.me().catch(() => null);
    setUser(me);
  };

  const handleSosInitiate = () => setSosStatus("confirming");

  const handleTriageSubmit = async (details = { type: "General", notes: "" }) => {
    setIsProcessing(true);
    try {
      const triagePrompt = `
        AI emergency triage for user at ${userLocation?.lat}, ${userLocation?.lng}.
        Emergency type: ${details.type}, Notes: ${details.notes}.
        Respond with structured JSON: incident_summary, priority_level, recommended_agencies, message_to_services, message_to_contacts, user_guidance.
      `;
      const result = await InvokeLLM({
        prompt: triagePrompt,
        response_json_schema: {
          type: "object",
          properties: {
            incident_summary: { type: "string" },
            priority_level: { type: "string" },
            recommended_agencies: { type: "array", items: { type: "string" } },
            message_to_services: { type: "string" },
            message_to_contacts: { type: "string" },
            user_guidance: { type: "array", items: { type: "string" } },
          },
        },
      });
      setAiReport(result);
      setSosStatus("active");
    } catch (error) {
      console.error("AI Triage Error:", error);
      setAiReport({
        incident_summary: `Emergency of type ${details.type} reported.`,
        priority_level: "High",
        recommended_agencies: ["Emergency Services"],
        message_to_services: `SOS triggered at location ${userLocation?.lat}, ${userLocation?.lng}. Type: ${details.type}. Notes: ${details.notes}`,
        message_to_contacts: `This is an automated message. An SOS has been triggered from my current location.`,
        user_guidance: [
          "Stay calm and in a safe place if possible.",
          "Keep your phone line open.",
          "Wait for instructions from emergency responders.",
        ],
      });
      setSosStatus("active");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelSos = () => {
    setSosStatus("idle");
    setAiReport(null);
  };

  const renderContent = () => {
    switch (sosStatus) {
      case "confirming":
        return (
          <AITriageModal
            isOpen={true}
            onClose={handleCancelSos}
            onSubmit={handleTriageSubmit}
            isProcessing={isProcessing}
          />
        );
      case "active":
        return (
          <ActiveSOSPanel
            aiReport={aiReport}
            userLocation={userLocation}
            onCancel={handleCancelSos}
          />
        );
      case "idle":
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full gap-8">
            <EmergencyButton onInitiate={handleSosInitiate} />
            <EmergencyContacts contacts={user?.contacts || []} />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                <Phone className="w-8 h-8 text-red-500" />
                SOS Emergency Hub
              </h1>
              <p className="text-slate-600">
                AI-assisted emergency reporting for faster, more effective response.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-lg border border-purple-200">
              <Brain className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">AI Triage Enabled</span>
            </div>
          </div>
        </div>
        <div className="relative min-h-[60vh]">{renderContent()}</div>
      </div>
    </div>
  );
}
