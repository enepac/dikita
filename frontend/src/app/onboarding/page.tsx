// frontend/src/app/onboarding/page.tsx
import Link from "next/link";

export default function OnboardingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6 bg-slate-800 p-8 rounded-2xl shadow-xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-center">
          Create Your Dikita Account
        </h1>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-slate-300">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 rounded-lg transition duration-300">
            Send OTP
          </button>
        </div>

        <div className="text-center text-sm text-slate-400 relative my-6">
          <span className="bg-slate-800 px-2 z-10 relative">or sign up with</span>
          <div className="absolute left-0 top-1/2 w-full h-px bg-slate-600 -z-10"></div>
        </div>

        <div className="flex flex-col space-y-3">
          <button className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 rounded-lg transition duration-300">
            Continue with Google
          </button>
          <button className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 rounded-lg transition duration-300">
            Continue with GitHub
          </button>
        </div>

        <div className="text-center text-sm text-slate-500 mt-4">
          <Link href="/" className="underline hover:text-white transition">
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
