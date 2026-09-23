"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { mockChats } from "@/lib/mock-data";

export default function ChatDetailPage() {
  const params = useParams();
  const router = useRouter();
  const chatId = params.id as string;
  const chat = mockChats.find((c) => c.id === chatId);

  const [messages, setMessages] = useState(chat?.messages || []);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!chat) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Chat not found</p>
          <Link href="/chat" className="text-[var(--primary)] hover:underline">
            ← Back to messages
          </Link>
        </div>
      </div>
    );
  }

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg = {
      id: `m${Date.now()}`,
      senderId: "me",
      text: input.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isRead: false,
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-[var(--border)] px-4 h-14 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="text-2xl text-gray-600 hover:text-[var(--primary)]"
        >
          ←
        </button>
        <img
          src={chat.user.avatar}
          alt={chat.user.name}
          className="w-9 h-9 rounded-full object-cover"
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">{chat.user.name}</p>
          <p className="text-xs text-gray-500">
            {chat.user.online ? "Online" : "Offline"}
          </p>
        </div>
        <button className="text-xl" title="Video call (coming soon)">
          🎥
        </button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg) => {
          const isMe = msg.senderId === "me";
          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                  isMe
                    ? "bg-[var(--primary)] text-white rounded-br-md"
                    : "bg-white border border-[var(--border)] rounded-bl-md"
                }`}
              >
                <p>{msg.text}</p>
                <p
                  className={`text-[10px] mt-1 ${
                    isMe ? "text-white/70" : "text-gray-400"
                  }`}
                >
                  {msg.timestamp}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="sticky bottom-0 bg-white border-t border-[var(--border)] p-3 flex items-center gap-2">
        <button className="text-2xl text-gray-400 hover:text-[var(--primary)]">
          📷
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 bg-[var(--muted)] rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--primary-light)]"
        />
        <button
          onClick={sendMessage}
          className="btn-primary w-10 h-10 rounded-full flex items-center justify-center text-lg"
        >
          ➤
        </button>
      </div>
    </div>
  );
}
