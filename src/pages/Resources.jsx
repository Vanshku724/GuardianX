// File: src/pages/Resources.jsx
import React, { useState, useEffect } from "react";
import { Resource } from "../entities/all"; // updated to relative import
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { MapPin, Navigation, Shield, Hospital, Home, Search } from "lucide-react";

import ResourceCard from "../components/resources/ResourceCard";
import ResourceMap from "../components/resources/ResourceMap";
import ResourceFilters from "../components/resources/ResourceFilters";

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("list");
  const [filters, setFilters] = useState({ type: "all", availability: "all", distance: "all" });

  useEffect(() => {
    loadResources();
  }, []);

  useEffect(() => {
    let filtered = [...resources];

    if (searchTerm) {
      filtered = filtered.filter(
        r =>
          r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.type !== "all") filtered = filtered.filter(r => r.type === filters.type);
    if (filters.availability !== "all") filtered = filtered.filter(r => r.availability_status === filters.availability);

    setFilteredResources(filtered);
  }, [resources, searchTerm, filters]);

  const loadResources = async () => {
    try {
      const data = await Resource.list("-created_date", 100);
      setResources(data);
    } catch (err) {
      console.error("Failed to load resources:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = {
    total: filteredResources.length,
    available: filteredResources.filter(r => r.availability_status === "available").length,
    hospitals: filteredResources.filter(r => r.type === "hospital").length,
    shelters: filteredResources.filter(r => r.type === "shelter").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-3">
                <MapPin className="w-6 md:w-8 h-6 md:h-8 text-purple-500" />
                Emergency Resource Finder
              </h1>
              <p className="text-sm md:text-base text-slate-600">
                Find hospitals, shelters, and emergency services in your area
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs md:text-sm">
              <div className="bg-green-50 px-2 md:px-3 py-1 md:py-2 rounded-lg border border-green-200">
                <span className="text-green-700 font-medium">{stats.available} Available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 md:w-5 h-4 md:h-5 text-slate-400" />
          <Input
            placeholder="Search resources by name, type, or location..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10 md:pl-12 h-10 md:h-12 text-sm md:text-base"
          />
        </div>

        {/* Stats Cards */}
        <div className="grid lg:grid-cols-4 gap-4 md:gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-blue-600 font-medium">Total Resources</p>
                <p className="text-xl font-bold text-blue-800">{stats.total}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-green-600 font-medium">Available Now</p>
                <p className="text-xl font-bold text-green-800">{stats.available}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-red-600 font-medium">Medical Centers</p>
                <p className="text-xl font-bold text-red-800">{stats.hospitals}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-purple-600 font-medium">Emergency Shelters</p>
                <p className="text-xl font-bold text-purple-800">{stats.shelters}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white border border-slate-200 rounded-xl p-1 mt-6">
            <TabsTrigger value="list" className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700">
              <MapPin className="w-4 h-4 mr-2" /> Resource List
            </TabsTrigger>
            <TabsTrigger value="map" className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700">
              <Navigation className="w-4 h-4 mr-2" /> Map View
            </TabsTrigger>
          </TabsList>

          <div className="grid lg:grid-cols-4 gap-6 mt-6">
            <div className="lg:col-span-1">
              <ResourceFilters filters={filters} onFilterChange={setFilters} />
            </div>
            <div className="lg:col-span-3">
              <TabsContent value="list">
                <div className="space-y-4">
                  {isLoading
                    ? [...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse bg-white rounded-xl h-32 border border-slate-200" />
                      ))
                    : filteredResources.length > 0
                    ? filteredResources.map(r => <ResourceCard key={r.id} resource={r} />)
                    : (
                      <div className="bg-white rounded-2xl p-8 md:p-12 text-center border border-slate-200">
                        <MapPin className="w-12 md:w-16 h-12 md:h-16 text-purple-300 mx-auto mb-4" />
                        <h3 className="text-lg md:text-xl font-semibold text-slate-700 mb-2">No Resources Found</h3>
                        <p className="text-slate-500 mb-4">No emergency resources match your current search and filters.</p>
                        <Button
                          onClick={() => {
                            setSearchTerm("");
                            setFilters({ type: "all", availability: "all", distance: "all" });
                          }}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          Clear Filters
                        </Button>
                      </div>
                    )}
                </div>
              </TabsContent>

              <TabsContent value="map">
                <ResourceMap resources={filteredResources} />
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
