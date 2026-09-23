"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";

type LeaderboardPhoto = {
  id: string;
  url: string;
  userName: string;
  views: number;
  likes: number;
};

export default function LeaderboardPage() {
  const [tab, setTab] = useState<"weekly" | "monthly">("weekly");
  const [data, setData] = useState<LeaderboardPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/leaderboard?period=${tab}`);
        const json = await res.json();
        setData(json.leaderboard || []);
      } catch {
        setData([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [tab]);

  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-0">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">🏆 Photo Leaderboard</h1>
          <p className="text-gray-600 mt-2">
            Most watched photos this {tab === "weekly" ? "week" : "month"}
          </p>
        </div>

        <div className="flex bg-[var(--muted)] rounded-full p-1 mb-8 max-w-xs mx-auto">
          <button
            onClick={() => setTab("weekly")}
            className={`flex-1 py-2.5 rounded-full text-sm font-semibold transition ${
              tab === "weekly"
                ? "bg-[var(--primary)] text-white shadow"
                : "text-gray-600 hover:text-[var(--primary)]"
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setTab("monthly")}
            className={`flex-1 py-2.5 rounded-full text-sm font-semibold transition ${
              tab === "monthly"
                ? "bg-[var(--primary)] text-white shadow"
                : "text-gray-600 hover:text-[var(--primary)]"
            }`}
          >
            This Month
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading leaderboard...</div>
        ) : data.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No photo views yet this {tab === "weekly" ? "week" : "month"}.
            <br />
            Be the first to climb the leaderboard!
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((photo, index) => {
              const rank = index + 1;
              const isTop3 = rank <= 3;

              return (
                <div
                  key={photo.id}
                  className={`flex items-center gap-4 bg-white rounded-2xl p-3 card-shadow border ${
                    isTop3 ? "border-[var(--primary-light)]" : "border-[var(--border)]"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0 ${
                      rank === 1
                        ? "bg-yellow-400 text-yellow-900"
                        : rank === 2
                        ? "bg-gray-300 text-gray-700"
                        : rank === 3
                        ? "bg-amber-600 text-white"
                        : "bg-[var(--muted)] text-gray-600"
                    }`}
                  >
                    {rank}
                  </div>

                  <div className="relative w-16 h-20 rounded-xl overflow-hidden shrink-0">
                    <img src={photo.url} alt="" className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{photo.userName}</p>
                    <p className="text-sm text-gray-500">
                      {photo.views.toLocaleString()} views · {photo.likes} likes
                    </p>
                  </div>

                  {isTop3 && (
                    <div className="text-2xl shrink-0">
                      {rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉"}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <p className="text-center text-sm text-gray-400 mt-10">
          Leaderboards reset every Monday (weekly) and 1st of the month (monthly).
          <br />
          Keep sharing great photos to climb higher!
        </p>
      </main>
    </div>
  );
}
