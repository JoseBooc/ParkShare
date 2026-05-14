"use client";

import { useState } from "react";
import { Plus, User, Send } from "lucide-react";
import Link from "next/link";
import { MESSAGES } from "@/lib/mock-data";
import type { Message } from "@/lib/types";

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>(MESSAGES);
  const [selected, setSelected] = useState<Message | null>(null);
  const [reply, setReply] = useState("");
  const [chatHistory, setChatHistory] = useState<Record<string, { from: "host" | "driver"; text: string; time: string }[]>>({
    "msg-1": [
      { from: "driver", text: "Hi! Is the slot still available for tomorrow?", time: "2 min ago" },
    ],
    "msg-2": [
      { from: "driver", text: "Is overnight parking allowed? I'll be there by midnight.", time: "1 hour ago" },
    ],
    "msg-3": [
      { from: "driver", text: "Thank you for confirming my booking. See you tomorrow!", time: "Yesterday" },
      { from: "host", text: "You're welcome! The slot will be ready for you. Safe travels.", time: "Yesterday" },
    ],
    "msg-4": [
      { from: "driver", text: "Can I extend my booking by 2 more hours?", time: "2 days ago" },
      { from: "host", text: "Yes, that's fine! I'll update your booking now.", time: "2 days ago" },
    ],
  });

  function handleSelect(msg: Message) {
    setSelected(msg);
    // Mark as read
    setMessages((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, read: true } : m))
    );
  }

  function handleSend() {
    if (!reply.trim() || !selected) return;
    setChatHistory((prev) => ({
      ...prev,
      [selected.id]: [
        ...(prev[selected.id] || []),
        { from: "host", text: reply.trim(), time: "Just now" },
      ],
    }));
    setReply("");
  }

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="p-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-park-navy">Message Inbox</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-400 mt-0.5">{unreadCount} unread messages</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/host/slots/add"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-park-teal text-white text-sm font-semibold hover:bg-park-teal-dark transition-colors"
          >
            <Plus size={16} /> Add Slot
          </Link>
          <div className="w-9 h-9 rounded-full bg-park-teal flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
        </div>
      </div>

      <div className="flex gap-4 h-[600px]">
        {/* Message List */}
        <div className="w-64 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col flex-shrink-0">
          <div className="p-3 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Conversations
            </p>
          </div>
          <ul className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {messages.map((msg) => (
              <li key={msg.id}>
                <button
                  onClick={() => handleSelect(msg)}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                    selected?.id === msg.id ? "bg-park-teal-light/50" : ""
                  } ${!msg.read ? "bg-park-teal-light/30" : ""}`}
                >
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 rounded-full bg-park-teal-light flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User size={14} className="text-park-teal" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-park-navy truncate">
                          {msg.fromName}
                        </p>
                        {!msg.read && (
                          <span className="w-2 h-2 rounded-full bg-park-teal flex-shrink-0 ml-1" />
                        )}
                      </div>
                      {msg.slotName && (
                        <p className="text-[10px] text-park-teal truncate">{msg.slotName}</p>
                      )}
                      <p className="text-[11px] text-gray-400 truncate mt-0.5">{msg.preview}</p>
                      <p className="text-[10px] text-gray-300 mt-0.5">{msg.date}</p>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Chat Window */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          {selected ? (
            <>
              {/* Chat Header */}
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-park-teal-light flex items-center justify-center">
                  <User size={16} className="text-park-teal" />
                </div>
                <div>
                  <p className="font-semibold text-park-navy text-sm">{selected.fromName}</p>
                  {selected.slotName && (
                    <p className="text-xs text-park-teal">{selected.slotName}</p>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                {(chatHistory[selected.id] || []).map((chat, i) => (
                  <div
                    key={i}
                    className={`flex ${chat.from === "host" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                        chat.from === "host"
                          ? "bg-park-navy text-white rounded-br-sm"
                          : "bg-gray-100 text-gray-700 rounded-bl-sm"
                      }`}
                    >
                      <p>{chat.text}</p>
                      <p
                        className={`text-[10px] mt-1 ${
                          chat.from === "host" ? "text-white/60" : "text-gray-400"
                        }`}
                      >
                        {chat.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply Input */}
              <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-2">
                <input
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm outline-none focus:border-park-teal transition-colors"
                />
                <button
                  onClick={handleSend}
                  disabled={!reply.trim()}
                  className="w-9 h-9 rounded-full bg-park-teal text-white flex items-center justify-center hover:bg-park-teal-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={15} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <User size={48} className="text-gray-200 mb-3" />
              <p className="font-medium">Select a conversation</p>
              <p className="text-sm mt-1">Choose a message from the left to reply</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
