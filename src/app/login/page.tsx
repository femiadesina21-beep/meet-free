"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isSignup ? "/api/auth/register" : "/api/auth/login";
      const body = isSignup
        ? { name, email, password, age: 25, gender: "other", bio: "", location: "", interests: [] }
        : { email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      if (data.user) {
        localStorage.setItem("meetfree_user", JSON.stringify(data.user));
      }

      router.push("/discover");
    } catch (err) {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-rose-50 via-pink-50 to-red-50">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="text-3xl font-bold text-gradient">
              MeetFree
            </Link>
            <p className="mt-2 text-gray-600">
              {isSignup ? "Create your free account" : "Welcome back"}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 card-shadow border border-[var(--border)]">
            <form onSubmit={handleSubmit} className="space-y-5">
              {isSignup && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={isSignup}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)] focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)] focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)] focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-xl">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3.5 rounded-full font-semibold text-lg disabled:opacity-60"
              >
                {loading ? "Please wait..." : isSignup ? "Create Free Account" : "Log In"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              {isSignup ? (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => setIsSignup(false)}
                    className="text-[var(--primary)] font-medium hover:underline"
                  >
                    Log in
                  </button>
                </>
              ) : (
                <>
                  New here?{" "}
                  <button
                    onClick={() => setIsSignup(true)}
                    className="text-[var(--primary)] font-medium hover:underline"
                  >
                    Join free
                  </button>
                </>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 text-center text-xs text-gray-400">
              Demo: aisha@meetfree.com / demo123
              <br />
              Chat is always free on MeetFree.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
