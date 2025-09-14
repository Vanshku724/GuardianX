// File: src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { Alert, Resource, CommunityReport, User } from "../entities/all"; // use relative path
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { 
  AlertTriangle, 
  Shield, 
  MapPin, 
  Users, 
  Phone,
  Activity
} from "lucide-react";
import { format } from "date-fns";

import StatusCard from "../components/dashboard/StatusCard";
import { AlertSummary } from "../components/dashboard/AlertSummary";
import QuickActions from "../components/dashboard/QuickActions";
import RecentActivity from "../components/dashboard/RecentActivity";

export default function Dashboard() {
  const [alerts, setAlerts] = useState([]);
  const [resources, setResources] = useState([]);
  const [reports, setReports] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [alertsData, resourcesData, reportsData, userData] = await Promise.all([
        Alert.list('-created_date', 10),
        Resource.list('-created_date', 5),
        CommunityReport.list('-created_date', 5),
        User.me().catch(() => null)
      ]);

      setAlerts(alertsData);
      setResources(resourcesData);
      setReports(reportsData);
      setUser(userData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const activeAlerts = alerts.filter(alert => alert.status === 'active');
  const criticalAlerts = activeAlerts.filter(alert => alert.severity === 'critical');
  const availableResources = resources.filter(resource => resource.availability_status === 'available');
  const pendingReports = reports.filter(report => report.status === 'pending');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Emergency Dashboard</h1>
              <p className="text-slate-600">
                Welcome back{user?.full_name ? `, ${user.full_name}` : ''}. Stay informed and prepared.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">All Systems Operational</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatusCard
            title="Active Alerts"
            value={activeAlerts.length}
            icon={AlertTriangle}
            color="orange"
          />
          <StatusCard
            title="Available Resources"
            value={availableResources.length}
            icon={MapPin}
            color="blue"
          />
          <StatusCard
            title="Community Reports"
            value={pendingReports.length}
            icon={Users}
            color="purple"
          />
          <StatusCard
            title="Emergency Readiness"
            value={user?.emergency_kit_status === 'comprehensive' ? "100%" : user?.emergency_kit_status === 'basic' ? "70%" : "25%"}
            icon={Shield}
            color="green"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Alerts and Quick Actions */}
          <div className="lg:col-span-2 space-y-6">
            <AlertSummary alerts={activeAlerts} />
            <QuickActions />
          </div>

          {/* Right Column - Activity and Status */}
          <div className="space-y-6">
            <RecentActivity reports={reports} />

            {/* Personal Status */}
            <Card className="bg-white shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Activity className="w-5 h-5 text-blue-500" />
                  Personal Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Location Status</span>
                  <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50">
                    Safe Zone
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Emergency Contacts</span>
                  <span className="text-sm font-medium text-slate-900">3 configured</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Last Check-in</span>
                  <span className="text-sm text-slate-500">{format(new Date(), 'MMM d, h:mm a')}</span>
                </div>
                <Link to={createPageUrl("SOS")}>
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                    <Phone className="w-4 h-4 mr-2" />
                    Emergency SOS
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
