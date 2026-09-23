"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { mockUsers, type User } from "@/lib/mock-data";
import Link from "next/link";

export default function DiscoverPage() {
  const [users] = useState<User[]>(mockUsers);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState<string[]>([]);
  const [passed, setPassed] = useState<string[]>([]);

  const current = users[currentIndex];

  const handleLike = () => {
    if (!current) return;
    setLiked((prev) => [...prev, current.id]);
    next();
  };

  const handlePass = () => {
    if (!current) return;
    setPassed((prev) => [...prev, current.id]);
    next();
  };

  const next = () => {
    if (currentIndex < users.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setCurrentIndex(0); // loop for demo
    }
  };

  if (!current) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-gray-500">No more profiles right now. Check back later!</p>
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
            {liked.length} likes · {passed.length} passed
          </span>
        </div>

        {/* Card */}
        <div className="relative bg-white rounded-3xl overflow-hidden card-shadow border border-[var(--border)]">
          <div className="relative aspect-[3/4] bg-gray-100">
            {/* Main photo */}
            <img
              src={current.photos[0]?.url || current.avatar}
              alt={current.name}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

            {/* Online badge */}
            {current.online && (
              <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Online
              </div>
            )}

            {/* Verified */}
            {current.isVerified && (
              <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                ✓ Verified
              </div>
            )}

            {/* Info */}
            <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="text-2xl font-bold">
                    {current.name}, {current.age}
                  </h2>
                  <p className="text-sm opacity-90 mt-0.5">
                    📍 {current.location} · {current.distance} km away
                  </p>
                </div>
                <div className="text-right text-sm">
                  <div className="font-semibold">{current.photos[0]?.views.toLocaleString()}</div>
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

        {/* Action buttons */}
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
          <Link
            href={`/profile?id=${current.id}`}
            className="w-16 h-16 rounded-full bg-white border-2 border-[var(--primary-light)] flex items-center justify-center text-2xl shadow-md hover:scale-105 transition active:scale-95"
            aria-label="View profile"
          >
            ℹ️
          </Link>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Swipe right (❤️) to like · Swipe left (✕) to pass
        </p>
      </main>
    </div>
  );
}
