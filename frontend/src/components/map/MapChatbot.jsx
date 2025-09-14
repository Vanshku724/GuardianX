// src/components/map/MapChatbot.jsx
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function MapChatbot({ alerts = [], resources = [], userLocation = null, aiAnalysis = null }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { text: input, type: "user" }]);
    setInput("");
  };

  return (
    <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl flex flex-col gap-2 h-[400px] overflow-y-auto">
      <div className="flex-1 flex flex-col gap-1">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded max-w-[75%] ${
              msg.type === "user"
                ? "bg-indigo-200 text-indigo-900 self-end"
                : "bg-indigo-100 text-indigo-700 self-start"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </div>
  );
}
