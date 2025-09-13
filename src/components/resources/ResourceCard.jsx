// File: src/components/resources/ResourceCard.jsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { MapPin, Shield, Hospital, Home } from "lucide-react";

export default function ResourceCard({ resource }) {
  const getTypeIcon = (type) => {
    switch (type) {
      case "hospital":
        return <Hospital className="w-5 h-5 text-red-600" />;
      case "shelter":
        return <Home className="w-5 h-5 text-purple-600" />;
      case "safety":
        return <Shield className="w-5 h-5 text-green-600" />;
      default:
        return <MapPin className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <Card className="bg-white border border-slate-200 rounded-xl shadow-sm">
      <CardContent className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div>{getTypeIcon(resource.type)}</div>
          <div>
            <h3 className="font-semibold text-lg text-slate-900">{resource.name}</h3>
            <p className="text-sm text-slate-500">{resource.address}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={resource.availability_status === "available" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}>
            {resource.availability_status}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
