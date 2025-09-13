
import React, { useState, useEffect } from "react";
import { Alert } from "@/entities/Alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  AlertTriangle, 
  MapPin, 
  Clock, 
  Shield, 
  Eye,
  Filter
} from "lucide-react";
import { format } from "date-fns";

import AlertCard from "../components/alerts/AlertCard";
import AlertMap from "../components/alerts/AlertMap";
import FilterPanel from "../components/alerts/FilterPanel";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("list");
  const [filters, setFilters] = useState({
    severity: "all",
    disaster_type: "all",
    status: "active"
  });

  useEffect(() => {
    loadAlerts();
  }, []);

  useEffect(() => {
    let filtered = [...alerts];
    
    if (filters.severity !== "all") {
      filtered = filtered.filter(alert => alert.severity === filters.severity);
    }
    
    if (filters.disaster_type !== "all") {
      filtered = filtered.filter(alert => alert.disaster_type === filters.disaster_type);
    }
    
    if (filters.status !== "all") {
      filtered = filtered.filter(alert => alert.status === filters.status);
    }

    setFilteredAlerts(filtered);
  }, [alerts, filters]);

  const loadAlerts = async () => {
    try {
      const data = await Alert.list('-created_date', 50);
      setAlerts(data);
    } catch (error) {
      console.error("Error loading alerts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const criticalAlerts = filteredAlerts.filter(alert => alert.severity === 'critical').length;
  const activeAlerts = filteredAlerts.filter(alert => alert.status === 'active').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-orange-500" />
                Early Warning System
              </h1>
              <p className="text-slate-600">
                Real-time disaster alerts and safety notifications for your area
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-red-50 px-4 py-2 rounded-lg border border-red-200">
                <span className="text-red-700 font-semibold text-sm">{criticalAlerts} Critical</span>
              </div>
              <div className="bg-orange-50 px-4 py-2 rounded-lg border border-orange-200">
                <span className="text-orange-700 font-semibold text-sm">{activeAlerts} Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white border border-slate-200 rounded-xl p-1">
            <TabsTrigger value="list" className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700">
              Alert List
            </TabsTrigger>
            <TabsTrigger value="map" className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700">
              Safety Map
            </TabsTrigger>
          </TabsList>

          <div className="grid lg:grid-cols-4 gap-6 mt-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <FilterPanel filters={filters} onFilterChange={setFilters} />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <TabsContent value="list" className="mt-0">
                <div className="space-y-4">
                  {isLoading ? (
                    <div className="grid gap-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse bg-white rounded-xl h-32 border border-slate-200" />
                      ))}
                    </div>
                  ) : filteredAlerts.length > 0 ? (
                    filteredAlerts.map(alert => (
                      <AlertCard key={alert.id} alert={alert} />
                    ))
                  ) : (
                    <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                      <Shield className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">All Clear!</h3>
                      <p className="text-slate-600">No alerts match your current filters. Your area appears to be safe.</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="map" className="mt-0">
                <AlertMap alerts={filteredAlerts} />
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
