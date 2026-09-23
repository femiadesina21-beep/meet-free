import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MeetFree – Free Chat Dating & Photo Leaderboards",
  description:
    "Meet new people, chat for free, share photos and climb the weekly & monthly most-viewed photo leaderboards. Find love on MeetFree.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        {children}
      </body>
    </html>
  );
}
