"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/discover", label: "Discover", icon: "❤️" },
  { href: "/leaderboard", label: "Leaderboard", icon: "🏆" },
  { href: "/chat", label: "Chat", icon: "💬" },
  { href: "/profile", label: "Profile", icon: "👤" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <>
      {/* Top bar for desktop */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gradient">MeetFree</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    active
                      ? "bg-[var(--primary)] text-white"
                      : "text-gray-600 hover:bg-[var(--muted)] hover:text-[var(--primary)]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:inline-flex text-sm font-medium text-[var(--primary)] hover:underline"
            >
              Log in
            </Link>
            <Link
              href="/login"
              className="btn-primary px-4 py-2 rounded-full text-sm font-semibold"
            >
              Join Free
            </Link>
          </div>
        </div>
      </header>

      {/* Bottom mobile navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[var(--border)] safe-area-pb">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center flex-1 h-full text-xs gap-0.5 ${
                  active ? "text-[var(--primary)]" : "text-gray-500"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
