"use client";

import { useState } from "react";
import {
  User,
  Send,
  MessageCircle,
  Search,
} from "lucide-react";

import { MESSAGES } from "@/lib/mock-data";

import type { Message } from "@/lib/types";

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>(MESSAGES);

  const [selected, setSelected] = useState<Message | null>(null);

  const [reply, setReply] = useState("");

  const [search, setSearch] = useState("");

  const [chatHistory, setChatHistory] = useState<
    Record<
      string,
      {
        from: "host" | "driver";
        text: string;
        time: string;
      }[]
    >
  >({
    "msg-1": [
      {
        from: "driver",
        text: "Hi! Is the slot still available for tomorrow?",
        time: "2 min ago",
      },
    ],

    "msg-2": [
      {
        from: "driver",
        text: "Is overnight parking allowed? I'll be there by midnight.",
        time: "1 hour ago",
      },
    ],

    "msg-3": [
      {
        from: "driver",
        text: "Thank you for confirming my booking. See you tomorrow!",
        time: "Yesterday",
      },

      {
        from: "host",
        text: "You're welcome! The slot will be ready for you.",
        time: "Yesterday",
      },
    ],

    "msg-4": [
      {
        from: "driver",
        text: "Can I extend my booking by 2 more hours?",
        time: "2 days ago",
      },

      {
        from: "host",
        text: "Yes, that's fine! I'll update your booking now.",
        time: "2 days ago",
      },
    ],
  });

  function handleSelect(msg: Message) {
    setSelected(msg);

    setMessages((prev) =>
      prev.map((m) =>
        m.id === msg.id ? { ...m, read: true } : m
      )
    );
  }

  function handleSend() {
    if (!reply.trim() || !selected) return;

    setChatHistory((prev) => ({
      ...prev,

      [selected.id]: [
        ...(prev[selected.id] || []),

        {
          from: "host",
          text: reply.trim(),
          time: "Just now",
        },
      ],
    }));

    setReply("");
  }

  const unreadCount = messages.filter((m) => !m.read).length;

  const filteredMessages = messages.filter((msg) =>
    msg.fromName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-100 bg-[#eefbfd] px-4 py-5 sm:px-8 sm:py-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-park-teal sm:text-sm">
            Host Communication
          </p>

          <h1 className="mt-1 text-2xl font-extrabold text-park-navy sm:text-3xl">
            Message Inbox
          </h1>

          <p className="mt-0.5 text-xs text-gray-500 sm:mt-1 sm:text-sm">
            Manage client conversations and booking concerns.
          </p>
        </div>
      </header>

      <section className="px-4 py-6 sm:px-8 sm:py-8">
        <div className="mb-6 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-park-teal-light text-park-teal sm:mb-4 sm:h-11 sm:w-11 sm:rounded-2xl">
              <MessageCircle size={18} />
            </div>

            <p className="text-xs font-semibold text-gray-400 sm:text-sm">
              Total Conversations
            </p>

            <p className="mt-1 text-2xl font-extrabold text-park-navy sm:text-3xl">
              {messages.length}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-park-teal-light text-park-teal sm:mb-4 sm:h-11 sm:w-11 sm:rounded-2xl">
              <MessageCircle size={18} />
            </div>

            <p className="text-xs font-semibold text-gray-400 sm:text-sm">
              Unread Messages
            </p>

            <p className="mt-1 text-2xl font-extrabold text-park-navy sm:text-3xl">
              {unreadCount}
            </p>
          </div>

          <div className="col-span-2 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6 md:col-span-1">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-park-teal-light text-park-teal sm:mb-4 sm:h-11 sm:w-11 sm:rounded-2xl">
              <User size={18} />
            </div>

            <p className="text-xs font-semibold text-gray-400 sm:text-sm">
              Active Drivers
            </p>

            <p className="mt-1 text-2xl font-extrabold text-park-navy sm:text-3xl">
              {messages.length}
            </p>
          </div>
        </div>

        <div className="flex h-150 flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm sm:h-180 sm:flex-row sm:rounded-3xl">
          <aside className="flex h-2/5 w-full shrink-0 flex-col border-b border-gray-100 bg-[#eefbfd] sm:h-auto sm:w-85 sm:border-b-0 sm:border-r">
            <div className="border-b border-gray-100 p-5">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search messages"
                  className="w-full rounded-full border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition-colors focus:border-park-teal"
                />
              </div>
            </div>

            <ul className="flex-1 overflow-y-auto">
              {filteredMessages.map((msg) => (
                <li key={msg.id}>
                  <button
                    onClick={() => handleSelect(msg)}
                    className={`w-full border-b border-white/60 px-5 py-4 text-left transition-all hover:bg-white ${
                      selected?.id === msg.id
                        ? "bg-white"
                        : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm">
                        <User size={16} className="text-park-teal" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-bold text-park-navy">
                            {msg.fromName}
                          </p>

                          {!msg.read && (
                            <span className="h-2.5 w-2.5 rounded-full bg-park-teal" />
                          )}
                        </div>

                        {msg.slotName && (
                          <p className="mt-0.5 truncate text-xs font-semibold text-park-teal">
                            {msg.slotName}
                          </p>
                        )}

                        <p className="mt-1 truncate text-xs text-gray-500">
                          {msg.preview}
                        </p>

                        <p className="mt-1 text-[11px] text-gray-400">
                          {msg.date}
                        </p>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <section className="flex flex-1 flex-col bg-white">
            {selected ? (
              <>
                <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-park-teal-light">
                    <User size={18} className="text-park-teal" />
                  </div>

                  <div>
                    <p className="font-bold text-park-navy">
                      {selected.fromName}
                    </p>

                    {selected.slotName && (
                      <p className="text-sm text-park-teal">
                        {selected.slotName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto bg-[#f9fdfd] px-6 py-6">
                  {(chatHistory[selected.id] || []).map(
                    (chat, i) => (
                      <div
                        key={i}
                        className={`flex ${
                          chat.from === "host"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[75%] rounded-3xl px-5 py-3 text-sm shadow-sm ${
                            chat.from === "host"
                              ? "rounded-br-md bg-park-navy text-white"
                              : "rounded-bl-md bg-white text-gray-700"
                          }`}
                        >
                          <p>{chat.text}</p>

                          <p
                            className={`mt-2 text-[11px] ${
                              chat.from === "host"
                                ? "text-white/60"
                                : "text-gray-400"
                            }`}
                          >
                            {chat.time}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>

                <div className="border-t border-gray-100 bg-white px-6 py-4">
                  <div className="flex items-center gap-3">
                    <input
                      value={reply}
                      onChange={(e) =>
                        setReply(e.target.value)
                      }
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleSend()
                      }
                      placeholder="Type your message..."
                      className="flex-1 rounded-full border border-gray-200 px-5 py-3 text-sm outline-none transition-colors focus:border-park-teal"
                    />

                    <button
                      onClick={handleSend}
                      disabled={!reply.trim()}
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-park-teal text-white transition-colors hover:bg-park-teal-dark disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#eefbfd]">
                  <MessageCircle
                    size={34}
                    className="text-park-teal"
                  />
                </div>

                <h3 className="mt-5 text-xl font-extrabold text-park-navy">
                  No Conversation Selected
                </h3>

                <p className="mt-2 max-w-sm text-sm text-gray-500">
                  Select a conversation from the left to view
                  messages and reply to drivers.
                </p>
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}