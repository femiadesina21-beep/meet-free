"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { getSession, type SessionUser } from "@/lib/session";

type ApiPhoto = { id: string; url: string; views: number; likes: number };
type ApiUser = {
  id: string;
  name: string;
  age: number;
  bio: string;
  location: string;
  interests: string[];
  avatar: string;
  isVerified?: boolean;
  photos: ApiPhoto[];
};

export default function DiscoverPage() {
  const router = useRouter();
  const [me, setMe] = useState<SessionUser | null>(null);
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedCount, setLikedCount] = useState(0);
  const [passedCount, setPassedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [matchToast, setMatchToast] = useState<ApiUser | null>(null);
  const [viewedPhotoIds, setViewedPhotoIds] = useState<Set<string>>(new Set());

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
      const [usersRes, likesRes] = await Promise.all([
        fetch("/api/users"),
        fetch(`/api/likes?userId=${myId}`),
      ]);
      const usersData = await usersRes.json();
      const likesData = await likesRes.json();
      const alreadyLiked: string[] = likesData.likedIds || [];

      const pool: ApiUser[] = (usersData.users || []).filter(
        (u: ApiUser) => u.id !== myId && !alreadyLiked.includes(u.id)
      );
      setUsers(pool);
    } finally {
      setLoading(false);
    }
  }

  const current = users[currentIndex];

  useEffect(() => {
    const photo = current?.photos?.[0];
    if (!photo || viewedPhotoIds.has(photo.id)) return;
    setViewedPhotoIds((prev) => new Set(prev).add(photo.id));
    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ photoId: photo.id }),
    }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id]);

  const next = () => {
    setCurrentIndex((i) => i + 1);
  };

  const handlePass = () => {
    if (!current) return;
    setPassedCount((c) => c + 1);
    next();
  };

  const handleLike = async () => {
    if (!current || !me) return;
    setLikedCount((c) => c + 1);
    try {
      const res = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromUserId: me.id, toUserId: current.id }),
      });
      const data = await res.json();
      if (data.matched) {
        setMatchToast(current);
        return;
      }
    } catch {
      // ignore network errors for the demo-grade MVP
    }
    next();
  };

  const closeMatch = () => {
    setMatchToast(null);
    next();
  };

  if (!me || loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-gray-500">Loading people nearby…</p>
        </div>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4 text-center">
          <p className="text-gray-500">
            That&apos;s everyone for now.
            <br />
            Check back later for new people!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-0">
      <Navbar />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Discover</h1>
          <span className="text-sm text-gray-500">
            {likedCount} likes · {passedCount} passed
          </span>
        </div>

        <div className="relative bg-white rounded-3xl overflow-hidden card-shadow border border-[var(--border)]">
          <div className="relative aspect-[3/4] bg-gray-100">
            <img
              src={current.photos[0]?.url || current.avatar}
              alt={current.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

            {current.isVerified && (
              <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                ✓ Verified
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="text-2xl font-bold">
                    {current.name}, {current.age}
                  </h2>
                  <p className="text-sm opacity-90 mt-0.5">📍 {current.location}</p>
                </div>
                <div className="text-right text-sm">
                  <div className="font-semibold">
                    {(current.photos[0]?.views ?? 0).toLocaleString()}
                  </div>
                  <div className="opacity-80 text-xs">photo views</div>
                </div>
              </div>
              <p className="mt-2 text-sm opacity-90 line-clamp-2">{current.bio}</p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {current.interests.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 mt-8">
          <button
            onClick={handlePass}
            className="w-16 h-16 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center text-2xl shadow-md hover:border-gray-300 hover:scale-105 transition active:scale-95"
            aria-label="Pass"
          >
            ✕
          </button>
          <button
            onClick={handleLike}
            className="w-20 h-20 rounded-full btn-primary flex items-center justify-center text-3xl shadow-lg hover:scale-105 transition active:scale-95"
            aria-label="Like"
          >
            ❤️
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Tap ❤️ to like · Tap ✕ to pass
        </p>
      </main>

      {matchToast && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
          <div className="text-center text-white">
            <div className="text-5xl mb-3">🎉</div>
            <h2 className="text-3xl font-bold text-gradient mb-2">It&apos;s a Match!</h2>
            <p className="mb-6">You and {matchToast.name} liked each other</p>
            <div className="flex flex-col gap-3 max-w-xs mx-auto">
              <Link
                href="/chat"
                className="btn-primary py-3 rounded-full font-semibold"
                onClick={() => setMatchToast(null)}
              >
                Send a message
              </Link>
              <button onClick={closeMatch} className="text-white/80 underline text-sm">
                Keep swiping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
