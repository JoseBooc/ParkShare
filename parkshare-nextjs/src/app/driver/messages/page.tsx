"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export default function DriverMessagesPage() {
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    { sender: "host", text: "Hi! The parking slot is available." },
    { sender: "driver", text: "Great, I’m interested in booking it." },
  ]);

  function sendMessage() {
    const cleanMessage = message.trim();

    if (!cleanMessage) return;

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        sender: "driver",
        text: cleanMessage,
      },
    ]);

    setMessage("");
  }

  return (
    <main className="min-h-screen bg-[#F4F7FB] px-4 py-8">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-5">
          <h1 className="text-2xl font-black text-park-navy">Message Host</h1>
          <p className="text-sm text-gray-400">
            Chat with the parking slot host
          </p>
        </div>

        <div className="h-[450px] space-y-3 overflow-y-auto p-5">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${
                msg.sender === "driver"
                  ? "ml-auto bg-park-navy text-white"
                  : "bg-park-teal-light text-park-navy"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 border-t border-gray-100 p-4">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            placeholder="Type your message..."
            className="flex-1 rounded-full border border-gray-200 px-5 py-3 text-sm outline-none focus:border-park-teal"
          />

          <button
            type="button"
            onClick={sendMessage}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-park-teal text-white hover:bg-park-teal-dark"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </main>
  );
}