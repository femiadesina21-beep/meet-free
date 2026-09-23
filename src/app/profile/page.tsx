"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { getSession, setSession, type SessionUser } from "@/lib/session";

type ApiPhoto = { id: string; url: string; views: number; likes: number };

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [me, setMe] = useState<SessionUser | null>(null);
  const [photos, setPhotos] = useState<ApiPhoto[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.push("/login");
      return;
    }
    setMe(session);
    setBio(session.bio || "");
    setLocation(session.location || "");
    loadPhotos(session.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadPhotos(userId: string) {
    const res = await fetch(`/api/photos?userId=${userId}`);
    const data = await res.json();
    setPhotos(data.photos || []);
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !me) return;

    setUploadError("");
    if (file.size > 4 * 1024 * 1024) {
      setUploadError("Photo must be under 4MB");
      return;
    }

    setUploading(true);
    try {
      const base64 = await fileToBase64(file);
      const res = await fetch("/api/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: me.id, imageBase64: base64 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setPhotos((prev) => [...prev, data.photo]);
    } catch (err: any) {
      setUploadError(err.message || "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function saveProfile() {
    if (!me) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/users/${me.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio, location }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      const updated = { ...me, bio, location };
      setMe(updated);
      setSession(updated);
      setEditing(false);
    } catch {
      // keep the edit form open so they can retry
    } finally {
      setSaving(false);
    }
  }

  if (!me) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-gray-500">Loading…</p>
        </div>
      </div>
    );
  }

  const totalViews = photos.reduce((s, p) => s + p.views, 0);

  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-0">
      <Navbar />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6">
        <div className="bg-white rounded-3xl overflow-hidden card-shadow border border-[var(--border)]">
          <div className="h-32 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]" />
          <div className="px-6 pb-6 -mt-12">
            <img
              src={me.avatar}
              alt={me.name}
              className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-md"
            />
            <div className="mt-3">
              <h1 className="text-2xl font-bold">
                {me.name}, {me.age}
              </h1>

              {editing ? (
                <div className="mt-3 space-y-2">
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Location"
                    className="w-full border border-[var(--border)] rounded-xl px-3 py-2 text-sm"
                  />
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Bio"
                    rows={3}
                    className="w-full border border-[var(--border)] rounded-xl px-3 py-2 text-sm"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveProfile}
                      disabled={saving}
                      className="btn-primary px-4 py-2 rounded-full text-sm font-semibold disabled:opacity-60"
                    >
                      {saving ? "Saving…" : "Save"}
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="px-4 py-2 rounded-full text-sm font-semibold border border-[var(--border)]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-gray-500 text-sm">📍 {me.location || "Add your location"}</p>
                  <p className="mt-3 text-gray-700 text-sm leading-relaxed">
                    {me.bio || "Add a bio to tell people about yourself"}
                  </p>
                </>
              )}

              <div className="flex flex-wrap gap-2 mt-4">
                {(me.interests || []).map((tag) => (
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

        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="bg-white rounded-2xl p-4 text-center card-shadow border border-[var(--border)]">
            <div className="text-xl font-bold text-[var(--primary)]">{totalViews}</div>
            <div className="text-xs text-gray-500 mt-1">Total Views</div>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center card-shadow border border-[var(--border)]">
            <div className="text-xl font-bold text-[var(--primary)]">{photos.length}</div>
            <div className="text-xs text-gray-500 mt-1">Photos</div>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center card-shadow border border-[var(--border)]">
            <div className="text-xl font-bold text-[var(--primary)]">
              {photos.reduce((s, p) => s + p.likes, 0)}
            </div>
            <div className="text-xs text-gray-500 mt-1">Likes</div>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg">My Photos</h2>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="text-sm text-[var(--primary)] font-medium disabled:opacity-60"
            >
              {uploading ? "Uploading…" : "+ Add Photo"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          {uploadError && <p className="text-red-500 text-xs mb-3">{uploadError}</p>}

          {photos.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">
              No photos yet — add one so people can see you!
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {photos.map((photo) => (
                <div key={photo.id} className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                  <img src={photo.url} alt="" className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                    <p className="text-white text-xs font-medium">
                      👁 {photo.views.toLocaleString()} views
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 space-y-3">
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="w-full btn-primary py-3.5 rounded-full font-semibold"
            >
              Edit Profile
            </button>
          )}
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
