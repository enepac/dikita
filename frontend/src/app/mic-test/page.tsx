'use client';

import { useState } from "react";
import Link from "next/link";

export default function MicTestPage() {
  const [micStatus, setMicStatus] = useState<"idle" | "active" | "denied" | "error">("idle");

  const handleStartMicTest = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicStatus("active");

      // Optional: Stop stream after detection to release resources
      stream.getTracks().forEach((track) => track.stop());

      console.log("Microphone access granted");
    } catch (error) {
      console.error("Microphone access error:", error);
      if (error instanceof DOMException && error.name === "NotAllowedError") {
        setMicStatus("denied");
      } else {
        setMicStatus("error");
      }
    }
  };

  const renderStatusMessage = () => {
    switch (micStatus) {
      case "active":
        return <p className="text-green-400">✅ Microphone is working!</p>;
      case "denied":
        return <p className="text-red-400">❌ Microphone access was denied.</p>;
      case "error":
        return <p className="text-red-400">⚠️ Unable to access microphone.</p>;
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6 bg-slate-800 p-8 rounded-2xl shadow-xl text-center">
        <h1 className="text-2xl sm:text-3xl font-bold">Test Your Microphone</h1>
        <p className="text-slate-400 text-sm">
          Before we begin, let’s make sure your microphone is working properly.
        </p>

        <button
          onClick={handleStartMicTest}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 rounded-lg transition duration-300"
        >
          Start Mic Test
        </button>

        {renderStatusMessage()}

        <div className="border border-slate-600 rounded-lg p-4 mt-4 text-left h-36 overflow-y-auto bg-slate-700 text-sm text-slate-300">
          <p className="italic text-slate-500">Transcript will appear here...</p>
        </div>

        <Link href="/" className="text-sm underline text-slate-400 hover:text-white transition">
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
