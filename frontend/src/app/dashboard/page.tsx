// frontend/src/app/dashboard/page.tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="text-center p-10">Loading...</div>;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 gap-4">
      <h2 className="text-2xl font-bold">🗂 My Interviews</h2>
      <p className="text-gray-600">Welcome, {user.isAnonymous ? "Guest" : user.displayName}</p>

      <div className="flex gap-3 mt-4">
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
          ➕ New Interview
        </button>
        <button className="bg-gray-200 text-black px-4 py-2 rounded-lg hover:bg-gray-300">
          ▶ Resume
        </button>
      </div>

      <button
        onClick={logout}
        className="mt-8 text-sm text-red-600 hover:underline"
      >
        Log out
      </button>
    </main>
  );
}
