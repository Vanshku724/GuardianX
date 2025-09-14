import React, { useState, useEffect, useCallback } from "react";
import { User, EmergencyKitItem, PreparednessGuide, EmergencyContact } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "../components/ui/progress"; // Keep only one
import { BookOpen, ShieldCheck, CheckCircle, AlertCircle } from "lucide-react";

import PreparednessScore from "../components/preparedness/PreparednessScore";
import EmergencyKit from "../components/preparedness/EmergencyKit";
import FamilyPlan from "../components/preparedness/FamilyPlan";
import ResourceLibrary from "../components/preparedness/ResourceLibrary";

export default function Preparedness() {
  const [user, setUser] = useState(null);
  const [kitItems, setKitItems] = useState([]);
  const [guides, setGuides] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [preparednessScore, setPreparednessScore] = useState(0);

  const calculateScore = useCallback((userData, userKitItems, userContacts) => {
    let score = 0;
    const checkedItems = userKitItems.filter(item => item.is_checked).length;
    const totalItems = userKitItems.length > 0 ? userKitItems.length : 1;
    score += (checkedItems / totalItems) * 40;

    if (userContacts && userContacts.length > 0) score += 30;
    if (userData?.family_plan?.meeting_point_1 && userData?.family_plan?.out_of_state_contact_name) score += 30;

    setPreparednessScore(Math.round(score));
  }, []);

  useEffect(() => {
    const loadPreparednessData = async () => {
      setIsLoading(true);
      try {
        const currentUser = await User.me();
        setUser(currentUser);

        const [kitData, guidesData, contactsData] = await Promise.all([
          EmergencyKitItem.filter({ user_id: currentUser.id }),
          PreparednessGuide.list(),
          EmergencyContact.filter({ user_id: currentUser.id })
        ]);

        let finalKitItems = kitData;
        if (kitData.length === 0) {
          const defaultItems = await EmergencyKitItem.filter({ is_default: true });
          const userKitItems = defaultItems.map(item => ({ ...item, user_id: currentUser.id, is_checked: false, id: undefined, is_default: false }));
          if (userKitItems.length > 0) {
            await EmergencyKitItem.bulkCreate(userKitItems);
            finalKitItems = await EmergencyKitItem.filter({ user_id: currentUser.id });
          }
        }

        setKitItems(finalKitItems);
        setGuides(guidesData);
        setContacts(contactsData);
        calculateScore(currentUser, finalKitItems, contactsData);

      } catch (error) {
        console.error("Error loading preparedness data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreparednessData();
  }, [calculateScore]);

  const handleUserUpdate = async (updatedData) => {
    try {
      await User.updateMyUserData(updatedData);
      const updatedUser = await User.me();
      setUser(updatedUser);
      calculateScore(updatedUser, kitItems, contacts);
    } catch (error) {
      console.error("Failed to update user data", error);
    }
  };

  const handleKitUpdate = async (updatedItems) => {
    setKitItems(updatedItems);
    calculateScore(user, updatedItems, contacts);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-amber-50 p-3 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-sm p-4 md:p-6 border border-slate-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 mb-1 md:mb-2 flex items-center gap-2 md:gap-3">
                <BookOpen className="w-6 md:w-8 h-6 md:h-8 text-amber-500" />
                GuardianX Preparedness Center
              </h1>
              <p className="text-sm md:text-base text-slate-600">
                Your hub for building resilience and preparing for the unexpected.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-4 md:space-y-6">
            <PreparednessScore score={preparednessScore} isLoading={isLoading} />
            <FamilyPlan 
              user={user} 
              onUpdate={handleUserUpdate} 
              isLoading={isLoading} 
              contacts={contacts}
            />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <EmergencyKit 
              items={kitItems} 
              onUpdate={handleKitUpdate} 
              userId={user?.id}
              isLoading={isLoading} 
            />
            <ResourceLibrary guides={guides} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}
