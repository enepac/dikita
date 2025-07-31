// frontend/src/app/page.tsx
"use client";

import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { loginWithGoogle, loginAsGuest, loading } = useAuth();

  if (loading) return <div className="text-center p-10">Loading...</div>;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-3xl font-bold">🤖 Dikita</h1>
      <p className="text-lg text-gray-600">Your Invisible Interview Assistant</p>

      <div className="flex flex-col gap-3 mt-6 w-full max-w-xs">
        <button
          onClick={loginWithGoogle}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
        >
          🔐 Sign in with Google
        </button>
        <button
          onClick={loginAsGuest}
          className="border border-gray-400 hover:bg-gray-100 py-2 rounded-lg"
        >
          🚪 Continue as Guest
        </button>
      </div>
    </main>
  );
}
