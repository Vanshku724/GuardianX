// src/pages/Map.jsx
import React, { useState, useEffect } from "react";
import { Alert, Resource, User } from "../entities/all";
import { InvokeLLM } from "@/integrations/Core";
import { Tabs, TabsList, TabsTrigger, TabsContent, Badge, Button } from "../components/ui";
import { MapPin, Route, AlertTriangle, Target, MessageSquare, Brain, Navigation } from "lucide-react";

import InteractiveMap from "../components/map/InteractiveMap";
import AIRouteOptimizer from "../components/map/AIRouteOptimizer";
import RiskAssessment from "../components/map/RiskAssessment";
import SmartRecommendations from "../components/map/SmartRecommendations";
import MapChatbot from "../components/map/MapChatbot";

export default function Map() {
  const [alerts, setAlerts] = useState([]);
  const [resources, setResources] = useState([]);
  const [user, setUser] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [activeTab, setActiveTab] = useState("map");
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    loadMapData();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setUserLocation({ lat: 40.7128, lng: -74.006 })
      );
    } else {
      setUserLocation({ lat: 40.7128, lng: -74.006 });
    }
  }, []);

  const loadMapData = async () => {
    try {
      const [alertsData, resourcesData, userData] = await Promise.all([
        Alert.filter?.({ status: "active" }, "-created_date", 20).catch(() => []),
        Resource.list?.("-created_date", 50).catch(() => []),
        User.me?.().catch(() => null),
      ]);
      setAlerts(alertsData);
      setResources(resourcesData);
      setUser(userData);
    } catch (error) {
      console.error("Error loading map data:", error);
    }
  };

  const performAIAnalysis = async () => {
    if (!userLocation) return;
    setIsAnalyzing(true);
    try {
      const result = await InvokeLLM({
        prompt: "Analyze map situation",
        response_json_schema: {},
      });
      setAiAnalysis(result);
    } catch (error) {
      console.error("AI Analysis Error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200 flex justify-between items-center">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Navigation className="w-8 h-8 text-green-500" />
            AI-Powered Safety Map
          </h1>
          <Button
            onClick={performAIAnalysis}
            disabled={isAnalyzing}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Brain className="w-4 h-4 mr-2" />
            {isAnalyzing ? "Analyzing..." : "AI Analysis"}
          </Button>
        </div>

        {aiAnalysis && (
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
            <Badge>Threat Level: {aiAnalysis?.threat_level || "N/A"}</Badge>
            <p className="text-purple-800 mt-2">
              {aiAnalysis?.overall_assessment || "No assessment yet"}
            </p>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 bg-white border rounded-xl p-1">
            <TabsTrigger value="map"><MapPin className="w-4 h-4 mr-2" /> Map</TabsTrigger>
            <TabsTrigger value="routes"><Route className="w-4 h-4 mr-2" /> Routes</TabsTrigger>
            <TabsTrigger value="risk"><AlertTriangle className="w-4 h-4 mr-2" /> Risk</TabsTrigger>
            <TabsTrigger value="recommendations"><Target className="w-4 h-4 mr-2" /> Insights</TabsTrigger>
            <TabsTrigger value="chat"><MessageSquare className="w-4 h-4 mr-2" /> Assistant</TabsTrigger>
          </TabsList>

          <TabsContent value="map">
            <InteractiveMap alerts={alerts} resources={resources} userLocation={userLocation} aiAnalysis={aiAnalysis} />
          </TabsContent>
          <TabsContent value="routes">
            <AIRouteOptimizer alerts={alerts} resources={resources} userLocation={userLocation} aiAnalysis={aiAnalysis} />
          </TabsContent>
          <TabsContent value="risk">
            <RiskAssessment alerts={alerts} resources={resources} userLocation={userLocation} aiAnalysis={aiAnalysis} />
          </TabsContent>
          <TabsContent value="recommendations">
            <SmartRecommendations aiAnalysis={aiAnalysis} userLocation={userLocation} performAnalysis={performAIAnalysis} isAnalyzing={isAnalyzing} />
          </TabsContent>
          <TabsContent value="chat">
            <MapChatbot alerts={alerts} resources={resources} userLocation={userLocation} aiAnalysis={aiAnalysis} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
