import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-100 via-pink-50 to-red-50" />
        <div className="relative max-w-6xl mx-auto px-4 pt-16 pb-24 md:pt-24 md:pb-32">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900">
              Meet new people.{" "}
              <span className="text-gradient">Chat free.</span>
              <br />
              Climb the photo leaderboards.
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-600 leading-relaxed">
              MeetFree is the dating app where boys and girls connect for free,
              share photos, get real views, and compete for the most-watched
              pictures every week and month.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="btn-primary px-8 py-4 rounded-full text-lg font-semibold shadow-lg"
              >
                Join Free – Start Meeting
              </Link>
              <Link
                href="/leaderboard"
                className="px-8 py-4 rounded-full text-lg font-semibold border-2 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--muted)] transition"
              >
                View Leaderboards
              </Link>
            </div>

            <p className="mt-6 text-sm text-gray-500">
              100% free chat · No credit card required · Real photo views
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Why people love <span className="text-gradient">MeetFree</span>
          </h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-14">
            Everything you need to meet, chat, and stand out — completely free.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Free Real-time Chat",
                desc: "Message anyone you match with for free. No limits, no paywalls for basic chat.",
                emoji: "💬",
              },
              {
                title: "Photo Views & Leaderboards",
                desc: "Every view counts. Climb the weekly and monthly most-watched photo rankings.",
                emoji: "🏆",
              },
              {
                title: "Discover Nearby",
                desc: "Find people near you with distance filters and interest matching.",
                emoji: "📍",
              },
              {
                title: "Stories",
                desc: "Share temporary moments that disappear after 24 hours.",
                emoji: "📸",
              },
              {
                title: "Safe & Verified",
                desc: "Report, block, and verified profiles help keep the community safe.",
                emoji: "🛡️",
              },
              {
                title: "Video Chat Ready",
                desc: "Start a video call right from the chat when you’re ready to meet face-to-face.",
                emoji: "🎥",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-[var(--background)] rounded-2xl p-6 card-shadow border border-[var(--border)] hover:border-[var(--primary-light)] transition"
              >
                <div className="text-3xl mb-3">{f.emoji}</div>
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to meet someone special?
          </h2>
          <p className="text-lg opacity-90 mb-8">
            Join thousands of people already chatting and climbing the photo leaderboards.
          </p>
          <Link
            href="/login"
            className="inline-block bg-white text-[var(--primary)] px-8 py-4 rounded-full text-lg font-bold hover:bg-rose-50 transition shadow-lg"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-white border-t border-[var(--border)] text-center text-sm text-gray-500">
        <p>© 2026 MeetFree. Made with ❤️ for real connections.</p>
      </footer>
    </div>
  );
}
