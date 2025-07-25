'use client';

import { useState, useRef, useEffect } from "react";
import Link from "next/link";


export default function MicTestPage() {
  const [micStatus, setMicStatus] = useState<"idle" | "active" | "denied" | "error">("idle");
  const [volume, setVolume] = useState(0);
  const [transcripts, setTranscripts] = useState<string[]>([]);
  const animationRef = useRef<number | null>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const transcriptionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const FAKE_SENTENCES = [
    "Hi, can you hear me okay?",
    "Looks like your microphone is working.",
    "This is a sample transcription for testing.",
    "You're all set to proceed.",
  ];

  const handleStartMicTest = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicStatus("active");

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      source.connect(analyser);

      const updateVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        const normalized = Math.min(average / 128, 1); // Normalize 0–1
        setVolume(normalized);

        if (circleRef.current) {
          const scale = 1 + normalized * 1.5;
          circleRef.current.style.transform = `scale(${scale})`;
          circleRef.current.style.opacity = `${0.5 + normalized * 0.5}`;
        }

        animationRef.current = requestAnimationFrame(updateVolume);
      };

      updateVolume();

      // Simulate transcript lines every 2.5s
      transcriptionIntervalRef.current = setInterval(() => {
        setTranscripts((prev) => {
          const nextIndex = prev.length % FAKE_SENTENCES.length;
          return [...prev, FAKE_SENTENCES[nextIndex]];
        });
      }, 2500);

    } catch (error) {
      console.error("Microphone access error:", error);
      if (error instanceof DOMException && error.name === "NotAllowedError") {
        setMicStatus("denied");
      } else {
        setMicStatus("error");
      }
    }
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (transcriptionIntervalRef.current) clearInterval(transcriptionIntervalRef.current);
    };
  }, []);

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

        {/* Visual Pulse */}
        <div className="flex justify-center">
          <div
            ref={circleRef}
            className="w-24 h-24 mt-4 rounded-full bg-blue-400 opacity-50 transition-transform duration-75"
          ></div>
        </div>

        {/* Transcript Output */}
        <div className="border border-slate-600 rounded-lg p-4 mt-4 text-left h-36 overflow-y-auto bg-slate-700 text-sm text-slate-300 space-y-1">
          {transcripts.length === 0 ? (
            <p className="italic text-slate-500">Transcript will appear here...</p>
          ) : (
            transcripts.map((line, idx) => <p key={idx}>• {line}</p>)
          )}
        </div>

        <Link href="/" className="text-sm underline text-slate-400 hover:text-white transition">
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
