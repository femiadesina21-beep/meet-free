"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getSession, type SessionUser } from "@/lib/session";

type ApiUser = { id: string; name: string; avatar: string };
type ApiMessage = {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
};
type ApiChat = { id: string; participants: string[] };

export default function ChatDetailPage() {
  const params = useParams();
  const router = useRouter();
  const chatId = params.id as string;

  const [me, setMe] = useState<SessionUser | null>(null);
  const [otherUser, setOtherUser] = useState<ApiUser | null>(null);
  const [messages, setMessages] = useState<ApiMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.push("/login");
      return;
    }
    setMe(session);
    load(session.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function load(myId: string) {
    setLoading(true);
    try {
      const [chatsRes, msgsRes, usersRes] = await Promise.all([
        fetch("/api/chats"),
        fetch(`/api/chats/${chatId}/messages`),
        fetch("/api/users"),
      ]);
      const chatsData = await chatsRes.json();
      const msgsData = await msgsRes.json();
      const usersData = await usersRes.json();

      const chat: ApiChat | undefined = (chatsData.chats || []).find(
        (c: ApiChat) => c.id === chatId
      );
      if (!chat) {
        setNotFound(true);
        return;
      }
      const otherId = chat.participants.find((id) => id !== myId);
      const other = (usersData.users || []).find((u: ApiUser) => u.id === otherId);
      setOtherUser(other || null);
      setMessages(msgsData.messages || []);
    } finally {
      setLoading(false);
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || !me) return;
    const text = input.trim();
    setInput("");

    // optimistic update
    const tempMsg: ApiMessage = {
      id: `temp_${Date.now()}`,
      senderId: me.id,
      text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      const res = await fetch(`/api/chats/${chatId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId: me.id, text }),
      });
      const data = await res.json();
      if (data.message) {
        setMessages((prev) =>
          prev.map((m) => (m.id === tempMsg.id ? data.message : m))
        );
      }
    } catch {
      // message stays optimistic on the screen even if the network call failed
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading…</p>
      </div>
    );
  }

  if (notFound || !otherUser) {
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

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <header className="sticky top-0 z-40 bg-white border-b border-[var(--border)] px-4 h-14 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="text-2xl text-gray-600 hover:text-[var(--primary)]"
        >
          ←
        </button>
        <img
          src={otherUser.avatar}
          alt={otherUser.name}
          className="w-9 h-9 rounded-full object-cover"
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">{otherUser.name}</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-sm text-gray-400 mt-8">
            Say hi to {otherUser.name} 👋
          </p>
        )}
        {messages.map((msg) => {
          const isMe = msg.senderId === me?.id;
          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                  isMe
                    ? "bg-[var(--primary)] text-white rounded-br-md"
                    : "bg-white border border-[var(--border)] rounded-bl-md"
                }`}
              >
                <p>{msg.text}</p>
                <p className={`text-[10px] mt-1 ${isMe ? "text-white/70" : "text-gray-400"}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="sticky bottom-0 bg-white border-t border-[var(--border)] p-3 flex items-center gap-2">
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
