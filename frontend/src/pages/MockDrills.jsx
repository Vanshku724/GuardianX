import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, Play, CheckCircle, Clock, Award, Shield } from "lucide-react";
import { motion } from "framer-motion";
import ActiveDrill from "../components/drills/ActiveDrill";
import DrillHistory from "../components/drills/DrillHistory";

export default function MockDrills() {
  const [activeDrill, setActiveDrill] = useState(null);
  const [drillHistory, setDrillHistory] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const drillScenarios = [
    // ... keep the same scenarios you already have
  ];

  useEffect(() => {
    loadDrillData();
  }, []);

  const loadDrillData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      // Replace with real API call
      const res = await fetch("/api/drills/history");
      if (!res.ok) throw new Error("Failed to fetch drill history");
      const history = await res.json();

      setDrillHistory(history);
    } catch (err) {
      console.error("Error loading drill data:", err);
      setError("Unable to load drill history. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const startDrill = (scenario) => {
    setActiveDrill({
      ...scenario,
      startTime: new Date(),
      currentStep: 0,
      completed: false,
    });
  };

  const completeDrill = async (drillData, score) => {
    try {
      const completedDrill = {
        id: drillData.id,
        title: drillData.title,
        icon: drillData.icon,
        endTime: new Date().toISOString(),
        completed: true,
        score,
        duration: Math.floor((new Date() - drillData.startTime) / 1000),
      };

      // Optimistically update UI
      const updatedHistory = [...drillHistory, completedDrill];
      setDrillHistory(updatedHistory);

      // Save to backend
      await fetch("/api/drills/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(completedDrill),
      });

      setActiveDrill(null);
    } catch (err) {
      console.error("Error completing drill:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center space-y-4">
        <p className="text-red-600 font-semibold">{error}</p>
        <Button onClick={loadDrillData}>Retry</Button>
      </div>
    );
  }

  if (activeDrill) {
    return (
      <ActiveDrill drill={activeDrill} onComplete={completeDrill} onCancel={() => setActiveDrill(null)} />
    );
  }

  const completedDrillsCount = drillHistory.length;
  const averageScore =
    completedDrillsCount > 0
      ? drillHistory.reduce((sum, drill) => sum + (drill.score || 0), 0) / completedDrillsCount
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6 border border-slate-200">
          <div className="flex flex-col gap-3">
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Target className="text-emerald-500 w-6 h-6" />
              GuardianX Mock Drills
            </h1>
            <p className="text-slate-600 text-sm">
              Practice emergency procedures with realistic scenarios to improve preparedness.
            </p>
            <Badge className="bg-emerald-100 text-emerald-800">{completedDrillsCount} Drills Completed</Badge>
          </div>
        </div>

        {/* Progress Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Progress Score" icon={<Award />} value={`${Math.round(averageScore)}%`} />
          <StatCard
            title="Scenarios Completed"
            icon={<CheckCircle />}
            value={new Set(drillHistory.map((d) => d.id)).size}
            subtitle={`Out of ${drillScenarios.length}`}
          />
          <StatCard
            title="Practice Time"
            icon={<Clock />}
            value={`${Math.floor(drillHistory.reduce((s, d) => s + (d.duration || 0), 0) / 60)}m`}
            subtitle="Total training time"
          />
        </div>

        {/* Drill Scenarios */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <Shield className="text-emerald-500" />
              Available Training Scenarios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {drillScenarios.map((scenario) => {
                const isCompleted = drillHistory.some((drill) => drill.id === scenario.id);
                return (
                  <motion.div
                    key={scenario.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition"
                  >
                    <div className="text-4xl mb-3">{scenario.icon}</div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900">{scenario.title}</h3>
                      {isCompleted && <CheckCircle className="w-4 h-4 text-green-500" />}
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-3">{scenario.description}</p>
                    <Button
                      onClick={() => startDrill(scenario)}
                      className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-sm gap-2"
                    >
                      <Play className="w-4 h-4" />
                      {isCompleted ? "Practice Again" : "Start Drill"}
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {drillHistory.length > 0 && <DrillHistory history={drillHistory} />}
      </div>
    </div>
  );
}

function StatCard({ title, icon, value, subtitle }) {
  return (
    <Card className="bg-gradient-to-br from-gray-50 to-gray-100">
      <CardHeader className="pb-2 flex items-center gap-2 text-slate-700">
        {icon}
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}
