"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export default function DriverMessagesPage() {
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    { sender: "host", text: "Hi! The parking slot is available." },
    { sender: "driver", text: "Great, I’m interested in booking it." },
  ]);

  function sendMessage(e?: React.FormEvent) {
    e?.preventDefault();

    const cleanMessage = message.trim();
    if (!cleanMessage) return;

    setMessages((currentMessages) => [
      ...currentMessages,
      { sender: "driver", text: cleanMessage },
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

        <form
          onSubmit={sendMessage}
          className="relative z-50 flex items-center gap-3 border-t border-gray-100 bg-white p-4"
        >
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="min-w-0 flex-1 rounded-full border border-gray-200 px-5 py-3 text-sm outline-none focus:border-park-teal"
          />

          <button
            type="submit"
            className="relative z-50 flex h-14 w-14 shrink-0 touch-manipulation items-center justify-center rounded-full bg-park-teal text-white active:scale-95"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </main>
  );
}