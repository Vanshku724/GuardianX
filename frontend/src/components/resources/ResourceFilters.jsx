// File: src/components/resources/ResourceFilters.jsx
import React from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";

export default function ResourceFilters({ filters, onFilterChange }) {
  const types = ["all", "hospital", "shelter", "safety"];
  const availability = ["all", "available", "unavailable"];

  return (
    <Card className="bg-white border border-slate-200 rounded-xl shadow-sm">
      <CardContent className="p-4 space-y-4">
        <div>
          <h4 className="font-semibold text-slate-700 mb-2">Type</h4>
          <div className="flex flex-col gap-2">
            {types.map((type) => (
              <Button
                key={type}
                variant={filters.type === type ? "default" : "outline"}
                onClick={() => onFilterChange({ ...filters, type })}
                className="capitalize text-sm"
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-slate-700 mb-2">Availability</h4>
          <div className="flex flex-col gap-2">
            {availability.map((status) => (
              <Button
                key={status}
                variant={filters.availability === status ? "default" : "outline"}
                onClick={() => onFilterChange({ ...filters, availability: status })}
                className="capitalize text-sm"
              >
                {status}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
