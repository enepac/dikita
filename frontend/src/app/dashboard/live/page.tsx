"use client";

import { useEffect, useRef, useState } from "react";

export default function LiveInterviewPage() {
  const [transcript, setTranscript] = useState<string | null>(null);
  const [aiAnswer, setAiAnswer] = useState<string | null>("Your team’s mission aligns with my passion for customer success.");
  const [isGlance, setIsGlance] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const chunksRef = useRef<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const startAudioCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const file = new File([blob], "live-chunk.webm", { type: "audio/webm" });

        const formData = new FormData();
        formData.append("file", file);
        formData.append("model", "whisper-1");
        formData.append("language", "en");

        try {
          const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
            },
            body: formData,
          });

          const data = await response.json();
          if (data.text && !isMuted && !isPaused) {
            setTranscript(data.text);
          }
        } catch (err) {
          console.error("Whisper API error:", err);
        }

        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setTimeout(() => {
        recorder.stop();
      }, 5000); // 5s chunk
    } catch (err) {
      console.error("Mic access denied:", err);
    }
  };

  // Poll every 6s unless paused or muted
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isMuted && !isPaused) {
        startAudioCapture();
      }
    }, 6000);
    return () => clearInterval(interval);
  }, [isMuted, isPaused]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">🔴 LIVE — Listening to Interview</h1>

      {!isGlance && transcript && (
        <div className="mb-4 bg-gray-100 p-4 rounded">
          <p className="text-sm text-gray-600 font-medium">❓ Transcript:</p>
          <div className="mt-1 text-gray-900">{transcript}</div>
        </div>
      )}

      {!isGlance && aiAnswer && (
        <div className="mb-4 bg-white border p-4 rounded space-y-2">
          <p className="text-sm text-gray-600 font-medium">💡 AI Answer:</p>
          <div className="text-gray-900">{aiAnswer}</div>
          <div className="text-xs text-gray-500">Tags: 🤝 Behavioral | 💬 Friendly | ✅ Match</div>
        </div>
      )}

      <div className="flex gap-3 mt-6">
        <button onClick={() => setIsGlance(!isGlance)} className="bg-blue-100 text-blue-700 px-4 py-2 rounded text-sm">
          👁 Glance Mode
        </button>
        <button onClick={() => setIsMuted(!isMuted)} className="bg-red-100 text-red-700 px-4 py-2 rounded text-sm">
          {isMuted ? "🔔 Unmute" : "🔕 Mute"}
        </button>
        <button onClick={() => setIsPaused(!isPaused)} className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded text-sm">
          {isPaused ? "▶ Resume" : "⏸ Pause"}
        </button>
      </div>
    </div>
  );
}
