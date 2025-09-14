import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, MapPin, Hospital, Shield } from "lucide-react";

export default function EmergencyContext({ alerts, resources, userLocation }) {
  const activeAlerts = alerts.filter((alert) => alert.status === "active");

  return (
    <Card className="bg-white shadow-sm border-slate-200">
      <CardHeader>
        <CardTitle className="text-slate-900 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          Emergency Context
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Location Info */}
        <div className="bg-indigo-50 px-3 py-2 rounded-lg flex items-center gap-2">
          <MapPin className="w-4 h-4 text-indigo-600" />
          <span className="text-xs text-slate-700">
            Location:{" "}
            {userLocation
              ? `${userLocation.lat.toFixed(3)}, ${userLocation.lng.toFixed(3)}`
              : "Unknown"}
          </span>
        </div>

        {/* Active Alerts */}
        <div>
          <h4 className="text-sm font-medium text-slate-800 mb-2">
            Active Alerts
          </h4>
          {activeAlerts.length > 0 ? (
            <div className="space-y-2">
              {activeAlerts.map((alert) => (
                <div
                  key={alert._id}
                  className="bg-red-50 p-3 rounded-lg flex items-start gap-2"
                >
                  <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-red-700">
                      {alert.disaster_type.toUpperCase()}
                    </p>
                    <p className="text-xs text-slate-700">{alert.title}</p>
                    <p className="text-xs text-slate-500">{alert.location}</p>
                    <Badge
                      className={`mt-1 ${
                        alert.severity === "critical"
                          ? "bg-red-700 text-white"
                          : "bg-orange-200 text-orange-800"
                      }`}
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">
              No active alerts in your area.
            </p>
          )}
        </div>

        {/* Nearby Resources */}
        <div>
          <h4 className="text-sm font-medium text-slate-800 mb-2">
            Nearby Resources
          </h4>
          {resources.length > 0 ? (
            <div className="space-y-2">
              {resources.slice(0, 5).map((res) => (
                <div
                  key={res._id}
                  className="bg-green-50 p-3 rounded-lg flex items-start gap-2"
                >
                  <Hospital className="w-4 h-4 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-green-700">
                      {res.name}
                    </p>
                    <p className="text-xs text-slate-700">{res.type}</p>
                    <p className="text-xs text-slate-500">{res.address}</p>
                    <Badge
                      className={`mt-1 ${
                        res.availability_status === "available"
                          ? "bg-green-600 text-white"
                          : "bg-gray-300 text-gray-700"
                      }`}
                    >
                      {res.availability_status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">
              No emergency resources found nearby.
            </p>
          )}
        </div>

        {/* Safety Reminder */}
        <div className="bg-yellow-50 px-3 py-2 rounded-lg flex items-center gap-2">
          <Shield className="w-4 h-4 text-yellow-600" />
          <span className="text-xs text-slate-700">
            Stay prepared. Follow local authority instructions.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
