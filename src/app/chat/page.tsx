"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { mockChats, type Chat } from "@/lib/mock-data";
import Link from "next/link";

export default function ChatListPage() {
  const [chats] = useState<Chat[]>(mockChats);

  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-0">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>

        {chats.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">💬</div>
            <p className="text-gray-500">No conversations yet.</p>
            <Link
              href="/discover"
              className="inline-block mt-4 text-[var(--primary)] font-medium hover:underline"
            >
              Start discovering people →
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {chats.map((chat) => (
              <Link
                key={chat.id}
                href={`/chat/${chat.id}`}
                className="flex items-center gap-4 p-3 rounded-2xl hover:bg-[var(--muted)] transition border border-transparent hover:border-[var(--border)]"
              >
                <div className="relative shrink-0">
                  <img
                    src={chat.user.avatar}
                    alt={chat.user.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  {chat.user.online && (
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold truncate">{chat.user.name}</p>
                    <span className="text-xs text-gray-400 shrink-0 ml-2">
                      {chat.lastMessageTime}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate mt-0.5">
                    {chat.lastMessage}
                  </p>
                </div>

                {chat.unread > 0 && (
                  <span className="shrink-0 w-5 h-5 rounded-full bg-[var(--primary)] text-white text-xs font-bold flex items-center justify-center">
                    {chat.unread}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10 p-4 bg-[var(--muted)] rounded-2xl text-center text-sm text-gray-600">
          💬 Chat is completely free on MeetFree.
          <br />
          Real-time messaging coming with full backend.
        </div>
      </main>
    </div>
  );
}
