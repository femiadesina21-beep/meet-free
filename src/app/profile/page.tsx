"use client";

import Navbar from "@/components/Navbar";
import { currentUser } from "@/lib/mock-data";
import Link from "next/link";

export default function ProfilePage() {
  const user = currentUser;

  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-0">
      <Navbar />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6">
        {/* Header card */}
        <div className="bg-white rounded-3xl overflow-hidden card-shadow border border-[var(--border)]">
          <div className="h-32 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]" />
          <div className="px-6 pb-6 -mt-12">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-md"
            />
            <div className="mt-3">
              <h1 className="text-2xl font-bold">
                {user.name}, {user.age}
              </h1>
              <p className="text-gray-500 text-sm">📍 {user.location}</p>
              <p className="mt-3 text-gray-700 text-sm leading-relaxed">{user.bio}</p>

              <div className="flex flex-wrap gap-2 mt-4">
                {user.interests.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-[var(--muted)] text-[var(--primary)] px-3 py-1 rounded-full font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="bg-white rounded-2xl p-4 text-center card-shadow border border-[var(--border)]">
            <div className="text-xl font-bold text-[var(--primary)]">
              {user.photos.reduce((s, p) => s + p.views, 0)}
            </div>
            <div className="text-xs text-gray-500 mt-1">Total Views</div>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center card-shadow border border-[var(--border)]">
            <div className="text-xl font-bold text-[var(--primary)]">
              {user.photos.length}
            </div>
            <div className="text-xs text-gray-500 mt-1">Photos</div>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center card-shadow border border-[var(--border)]">
            <div className="text-xl font-bold text-[var(--primary)]">0</div>
            <div className="text-xs text-gray-500 mt-1">Matches</div>
          </div>
        </div>

        {/* Photos */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg">My Photos</h2>
            <button className="text-sm text-[var(--primary)] font-medium">
              + Add Photo
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {user.photos.map((photo) => (
              <div
                key={photo.id}
                className="relative aspect-[3/4] rounded-2xl overflow-hidden"
              >
                <img
                  src={photo.url}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                  <p className="text-white text-xs font-medium">
                    👁 {photo.views.toLocaleString()} views
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 space-y-3">
          <button className="w-full btn-primary py-3.5 rounded-full font-semibold">
            Edit Profile
          </button>
          <Link
            href="/leaderboard"
            className="block w-full text-center py-3.5 rounded-full font-semibold border-2 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--muted)] transition"
          >
            View Leaderboards
          </Link>
        </div>
      </main>
    </div>
  );
}
