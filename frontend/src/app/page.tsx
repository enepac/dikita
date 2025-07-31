"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { loginWithGoogle, loginAsGuest, user, loading } = useAuth();
  const router = useRouter();
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    if (!loading && user && triggered) {
      router.push("/dashboard");
    }
  }, [user, loading, triggered, router]);

  if (loading) return <div className="text-center p-10">Loading...</div>;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-3xl font-bold">🤖 Dikita</h1>
      <p className="text-lg text-gray-600">Your Invisible Interview Assistant</p>

      <div className="flex flex-col gap-3 mt-6 w-full max-w-xs">
        <button
          onClick={async () => {
            await loginWithGoogle();
            setTriggered(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
        >
          🔐 Sign in with Google
        </button>
        <button
          onClick={async () => {
            await loginAsGuest();
            setTriggered(true);
          }}
          className="border border-gray-400 hover:bg-gray-100 py-2 rounded-lg"
        >
          🚪 Continue as Guest
        </button>
      </div>
    </main>
  );
}
