// src/components/sos/EmergencyContacts.jsx
import React from "react";
// Updated relative imports for Card components
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Users } from "lucide-react";

export default function EmergencyContacts({ contacts = [] }) {
  // Use passed contacts or fallback to default
  const defaultContacts = [
    { name: "John Doe", phone: "+1234567890" },
    { name: "Jane Smith", phone: "+0987654321" },
  ];

  const contactList = contacts.length > 0 ? contacts : defaultContacts;

  return (
    <Card className="bg-white shadow-sm border border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-900">
          <Users className="w-5 h-5 text-blue-500" />
          Emergency Contacts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {contactList.map((c, idx) => (
          <div key={idx} className="flex justify-between items-center border-b border-slate-200 py-1">
            <span>{c.name}</span>
            <span className="text-slate-600">{c.phone}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
