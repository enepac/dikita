// frontend/src/app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 flex items-center justify-center p-6">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          Your Invisible Interview Companion
        </h1>
        <p className="text-lg sm:text-xl text-slate-300">
          Dikita listens, understands, and responds—intelligently and
          invisibly—while you focus on impressing your interviewer.
          All in real time, from a separate device.
        </p>
        <Link
          href="/onboarding"
          className="inline-block mt-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition duration-300"
        >
          Get Started
        </Link>
        <p className="text-sm text-slate-500 mt-6">
          No installation. No screen sharing risk. Total control.
        </p>
      </div>
    </main>
  );
}
