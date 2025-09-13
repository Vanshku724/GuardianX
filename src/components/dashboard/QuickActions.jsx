// src/components/dashboard/QuickActions.jsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Zap, Phone, Shield, MapPin } from "lucide-react"; // corrected icons

export default function QuickActions() {
  return (
    <Card className="bg-white shadow-sm border border-slate-200">
      <CardHeader>
        <CardTitle className="text-slate-900">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button className="w-full justify-start bg-yellow-50 text-yellow-700 hover:bg-yellow-100">
          <Zap className="w-5 h-5 mr-2" />
          Request Assistance
        </Button>
        <Button className="w-full justify-start bg-red-50 text-red-700 hover:bg-red-100">
          <Phone className="w-5 h-5 mr-2" />
          Emergency Call
        </Button>
        <Button className="w-full justify-start bg-blue-50 text-blue-700 hover:bg-blue-100">
          <Shield className="w-5 h-5 mr-2" />
          Safety Check
        </Button>
        <Button className="w-full justify-start bg-green-50 text-green-700 hover:bg-green-100">
          <MapPin className="w-5 h-5 mr-2" />
          Update Location
        </Button>
      </CardContent>
    </Card>
  );
}
