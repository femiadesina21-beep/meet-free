"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { getSession, type SessionUser } from "@/lib/session";

type ApiUser = { id: string; name: string; avatar: string };
type ApiChat = {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: string;
};

export default function ChatListPage() {
  const router = useRouter();
  const [me, setMe] = useState<SessionUser | null>(null);
  const [chats, setChats] = useState<ApiChat[]>([]);
  const [usersById, setUsersById] = useState<Record<string, ApiUser>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.push("/login");
      return;
    }
    setMe(session);
    load(session.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function load(myId: string) {
    setLoading(true);
    try {
      const [chatsRes, usersRes] = await Promise.all([
        fetch("/api/chats"),
        fetch("/api/users"),
      ]);
      const chatsData = await chatsRes.json();
      const usersData = await usersRes.json();

      const map: Record<string, ApiUser> = {};
      (usersData.users || []).forEach((u: ApiUser) => (map[u.id] = u));
      setUsersById(map);

      const mine = (chatsData.chats || []).filter((c: ApiChat) =>
        c.participants.includes(myId)
      );
      setChats(mine);
    } finally {
      setLoading(false);
    }
  }

  function otherUser(chat: ApiChat): ApiUser | undefined {
    const otherId = chat.participants.find((id) => id !== me?.id);
    return otherId ? usersById[otherId] : undefined;
  }

  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-0">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading…</div>
        ) : chats.length === 0 ? (
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
            {chats.map((chat) => {
              const user = otherUser(chat);
              if (!user) return null;
              return (
                <Link
                  key={chat.id}
                  href={`/chat/${chat.id}`}
                  className="flex items-center gap-4 p-3 rounded-2xl hover:bg-[var(--muted)] transition border border-transparent hover:border-[var(--border)]"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-14 h-14 rounded-full object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold truncate">{user.name}</p>
                      <span className="text-xs text-gray-400 shrink-0 ml-2">
                        {chat.lastMessageTime}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate mt-0.5">
                      {chat.lastMessage || "Say hi 👋"}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="mt-10 p-4 bg-[var(--muted)] rounded-2xl text-center text-sm text-gray-600">
          💬 Chat is completely free on MeetFree.
        </div>
      </main>
    </div>
  );
}
