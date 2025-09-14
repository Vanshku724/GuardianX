import React, { useState, useEffect, useRef } from "react";
import { User, Alert, Resource } from "@/entities/all";
import { InvokeLLM } from "@/integrations/Core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Bot, User as UserIcon, Brain } from "lucide-react";
import { motion } from "framer-motion";
import EmergencyContext from "../components/chatbot/EmergencyContext";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [resources, setResources] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  const messagesEndRef = useRef(null);

  /** Auto scroll when new messages arrive */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isLoading]);

  useEffect(() => {
    initializeChatbot();
    getUserLocation();
  }, []);

  /** Fetch user, alerts, and resources from backend */
  const initializeChatbot = async () => {
    try {
      const [currentUser, alertsData, resourcesData] = await Promise.all([
        User.me().catch(() => null),
        Alert.filter({ status: "active" }, "-created_date", 10).catch(() => []),
        Resource.list("-created_date", 20).catch(() => []),
      ]);

      setUser(currentUser);
      setAlerts(alertsData);
      setResources(resourcesData);

      // Personalized AI greeting message
      const alertCount = alertsData.length;
      const criticalAlerts = alertsData.filter((a) => a.severity === "critical").length;

      let greeting = `Hello ${currentUser?.full_name || "there"}! I'm your GuardianX AI Emergency Assistant.`;

      if (criticalAlerts > 0) {
        greeting += ` ⚠️ **IMPORTANT**: There are ${criticalAlerts} critical alerts in your area.`;
      } else if (alertCount > 0) {
        greeting += ` There are ${alertCount} active alerts you should be aware of.`;
      } else {
        greeting += ` Good news — there are no active emergency alerts right now.`;
      }

      greeting += `\n\nI can help you with:
• Emergency alerts and safety info
• Finding shelters, hospitals & resources
• Evacuation routes & safe zones
• Safety tips & preparedness
• Real-time guidance during crises

What would you like to know?`;

      setMessages([{ role: "assistant", content: greeting, timestamp: new Date() }]);
    } catch (error) {
      console.error("Error initializing chatbot:", error);
    } finally {
      setDataLoading(false);
    }
  };

  /** Get user's location (fallback to NYC if blocked) */
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setUserLocation({ lat: 40.7128, lng: -74.006 }) // fallback
      );
    } else {
      setUserLocation({ lat: 40.7128, lng: -74.006 }); // fallback
    }
  };

  /** Send message + get AI response */
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage("");
    setIsLoading(true);

    try {
      const activeAlertDetails =
        alerts.length > 0
          ? alerts
              .map(
                (alert) =>
                  `- ${alert.disaster_type.toUpperCase()}: "${alert.title}" at ${
                    alert.location
                  } (${alert.severity} severity)`
              )
              .join("\n")
          : "No active alerts currently";

      const availableResources =
        resources.length > 0
          ? resources
              .slice(0, 8)
              .map((r) => `- ${r.name}: ${r.type} at ${r.address} (${r.availability_status})`)
              .join("\n")
          : "No resources loaded";

      const recentConversation = messages
        .slice(-6)
        .map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
        .join("\n");

      const contextPrompt = `You are GuardianX AI, an emergency management assistant. 
Use this context to answer naturally and helpfully:

USER:
- Name: ${user?.full_name || "User"}
- Location: ${
        userLocation
          ? `${userLocation.lat.toFixed(3)}, ${userLocation.lng.toFixed(3)}`
          : "Unknown"
      }

ALERTS:
${activeAlertDetails}

RESOURCES:
${availableResources}

RECENT CONVERSATION:
${recentConversation}

QUESTION:
"${currentInput}"`;

      const response = await InvokeLLM({
        prompt: contextPrompt,
        add_context_from_internet:
          /weather|news|current|today/i.test(currentInput), // fetch live data if needed
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            typeof response === "string"
              ? response
              : response?.content || "I'm not sure how to respond. Can you rephrase?",
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "⚠️ I'm having trouble connecting right now. If this is urgent, call 911 immediately.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Brain className="w-5 h-5 text-purple-500" />
                  GuardianX AI
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-700">
                      AI System Online
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Real-time emergency guidance and support. For immediate danger,
                    always call 911 first.
                  </p>
                </div>
              </CardContent>
            </Card>

            <EmergencyContext alerts={alerts} resources={resources} userLocation={userLocation} />
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="bg-white shadow-sm border-slate-200 h-[80vh] flex flex-col">
              <CardHeader className="border-b border-slate-200">
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <MessageCircle className="w-5 h-5 text-indigo-500" />
                  AI Assistant
                  <Badge className="bg-purple-100 text-purple-800 ml-auto">
                    24/7 Available
                  </Badge>
                </CardTitle>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {dataLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                      <p className="text-slate-500">Loading AI Assistant...</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex items-start gap-3 ${
                          msg.role === "user" ? "flex-row-reverse" : ""
                        }`}
                      >
                        <div
                          className={`p-2 rounded-full ${
                            msg.role === "user"
                              ? "bg-blue-600"
                              : "bg-gradient-to-br from-purple-600 to-indigo-600"
                          }`}
                        >
                          {msg.role === "user" ? (
                            <UserIcon className="w-4 h-4 text-white" />
                          ) : (
                            <Bot className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div
                          className={`flex-1 max-w-[80%] ${
                            msg.role === "user" ? "text-right" : ""
                          }`}
                        >
                          <div
                            className={`p-4 rounded-2xl ${
                              msg.role === "user"
                                ? "bg-blue-600 text-white"
                                : "bg-slate-100 text-slate-900"
                            }`}
                          >
                            <div className="prose prose-sm max-w-none whitespace-pre-wrap leading-relaxed">
                              {msg.content}
                            </div>
                          </div>
                          <div className="text-xs text-slate-400 mt-2">
                            {msg.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-3"
                      >
                        <div className="p-2 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-slate-100 p-4 rounded-2xl">
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                            <span className="text-sm text-slate-600">AI is thinking...</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </CardContent>

              {/* Input Area */}
              <div className="border-t border-slate-200 p-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage();
                  }}
                  className="flex gap-3"
                >
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask for safety advice, resource locations, or alert details..."
                    onKeyDown={(e) =>
                      e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())
                    }
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    disabled={isLoading || !inputMessage.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
