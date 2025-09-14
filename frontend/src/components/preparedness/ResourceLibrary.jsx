// File: src/components/preparedness/ResourceLibrary.jsx
import React from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ResourceLibrary({ guides = [], isLoading }) {
  return (
    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
      <CardContent className="p-4 flex flex-col gap-3">
        <CardTitle>
          <BookOpen className="inline w-5 h-5 mr-2 text-blue-500" />
          Resource Library
        </CardTitle>
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-6 bg-slate-200 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <ul className="space-y-2 mt-2">
            {guides.map(guide => (
              <li key={guide.id} className="flex items-center justify-between bg-white rounded px-3 py-2 border border-slate-200">
                <span>{guide.title}</span>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  View
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
