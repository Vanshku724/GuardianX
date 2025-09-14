// File: src/components/preparedness/FamilyPlan.jsx
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function FamilyPlan({ user, onUpdate, isLoading, contacts = [] }) {
  const [plan, setPlan] = useState({
    meeting_point_1: "",
    out_of_state_contact_name: ""
  });

  useEffect(() => {
    if (user?.family_plan) setPlan(user.family_plan);
  }, [user]);

  const handleChange = (e) => setPlan({ ...plan, [e.target.name]: e.target.value });

  const handleSubmit = () => onUpdate({ family_plan: plan });

  return (
    <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
      <CardContent className="p-4 flex flex-col gap-3">
        <CardTitle>Family Emergency Plan</CardTitle>
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-6 bg-slate-200 rounded animate-pulse" />
            <div className="h-6 bg-slate-200 rounded animate-pulse" />
          </div>
        ) : (
          <>
            <Input
              name="meeting_point_1"
              placeholder="Primary Meeting Point"
              value={plan.meeting_point_1}
              onChange={handleChange}
            />
            <Input
              name="out_of_state_contact_name"
              placeholder="Out-of-State Contact Name"
              value={plan.out_of_state_contact_name}
              onChange={handleChange}
            />
            <Button onClick={handleSubmit} className="mt-2 bg-green-600 hover:bg-green-700">
              Save Plan
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
