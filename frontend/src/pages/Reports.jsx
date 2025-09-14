import React, { useState, useEffect, useCallback } from "react";
import { CommunityReport } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Users, Plus, MapPin } from "lucide-react";

import ReportCard from "../components/reports/ReportCard";
import ReportForm from "../components/reports/ReportForm";
import ReportFilters from "../components/reports/ReportFilters";
import ReportMap from "../components/reports/ReportMap";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState("list");
  const [filters, setFilters] = useState({
    status: "all",
    incident_type: "all",
    severity: "all"
  });
  const [error, setError] = useState(null);

  const loadReports = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await CommunityReport.list("-created_date", 50);
      setReports(data);
      setError(null);
    } catch (err) {
      console.error("Error loading reports:", err);
      setError("Failed to load community reports. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  useEffect(() => {
    const filtered = reports.filter((report) => {
      const statusMatch = filters.status === "all" || report.status === filters.status;
      const incidentMatch = filters.incident_type === "all" || report.incident_type === filters.incident_type;
      const severityMatch = filters.severity === "all" || report.severity === filters.severity;
      return statusMatch && incidentMatch && severityMatch;
    });
    setFilteredReports(filtered);
  }, [reports, filters]);

  const handleSubmitReport = async (reportData) => {
    try {
      // Optimistic UI update
      const tempReport = {
        ...reportData,
        id: Date.now(),
        status: "pending",
        created_date: new Date()
      };
      setReports((prev) => [tempReport, ...prev]);
      setShowForm(false);

      await CommunityReport.create(reportData);
      await loadReports();
    } catch (err) {
      console.error("Error submitting report:", err);
      alert("Failed to submit report. Please try again.");
    }
  };

  const pendingReports = filteredReports.filter((r) => r.status === "pending").length;
  const verifiedReports = filteredReports.filter((r) => r.status === "verified").length;
  const totalReports = filteredReports.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6 border border-slate-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                <Users className="w-6 md:w-8 h-6 md:h-8 text-teal-500" />
                GuardianX Community Reports
              </h1>
              <p className="text-sm md:text-base text-slate-600">
                Report incidents and stay informed about community safety
              </p>
            </div>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-teal-600 hover:bg-teal-700 gap-2"
            >
              <Plus className="w-4 h-4" />
              Submit Report
            </Button>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 mt-4 flex-wrap">
            <div className="bg-orange-50 px-3 py-2 rounded-lg border border-orange-200">
              <span className="text-orange-700 font-medium text-sm">{pendingReports} Pending</span>
            </div>
            <div className="bg-green-50 px-3 py-2 rounded-lg border border-green-200">
              <span className="text-green-700 font-medium text-sm">{verifiedReports} Verified</span>
            </div>
            <div className="bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
              <span className="text-blue-700 font-medium text-sm">{totalReports} Total</span>
            </div>
          </div>
        </div>

        {/* Report Form Modal */}
        {showForm && (
          <ReportForm
            onSubmit={handleSubmitReport}
            onClose={() => setShowForm(false)}
          />
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white border border-slate-200 rounded-xl p-1">
            <TabsTrigger value="list" className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700">
              <Users className="w-4 h-4 mr-2" />
              Reports List
            </TabsTrigger>
            <TabsTrigger value="map" className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700">
              <MapPin className="w-4 h-4 mr-2" />
              Map View
            </TabsTrigger>
          </TabsList>

          <div className="grid lg:grid-cols-4 gap-6 mt-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <ReportFilters filters={filters} onFilterChange={setFilters} />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <TabsContent value="list" className="mt-0">
                <div className="space-y-4">
                  {isLoading ? (
                    <div className="grid gap-4">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="animate-pulse bg-white rounded-xl h-32 border border-slate-200"
                        />
                      ))}
                    </div>
                  ) : error ? (
                    <div className="bg-white rounded-xl p-6 border border-red-300 text-center text-red-600">
                      {error}
                    </div>
                  ) : filteredReports.length > 0 ? (
                    filteredReports.map((report) => (
                      <ReportCard key={report.id || report._id} report={report} />
                    ))
                  ) : (
                    <div className="bg-white rounded-2xl p-8 md:p-12 text-center border border-slate-200">
                      <Users className="w-12 md:w-16 h-12 md:h-16 text-teal-300 mx-auto mb-4" />
                      <h3 className="text-lg md:text-xl font-semibold text-slate-700 mb-2">
                        No Reports Found
                      </h3>
                      <p className="text-slate-500 mb-4">
                        No community reports match your current filters.
                      </p>
                      <Button
                        onClick={() => setFilters({ status: "all", incident_type: "all", severity: "all" })}
                        className="bg-teal-600 hover:bg-teal-700"
                      >
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="map" className="mt-0">
                <ReportMap reports={filteredReports} />
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
