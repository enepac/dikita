"use client";

import { useState } from "react";

export default function LiveInterviewPage() {
  const [transcriptVisible, setTranscriptVisible] = useState(true);
  const [aiAnswerVisible, setAiAnswerVisible] = useState(true);

  const mockTranscript = "Why do you want this role?";
  const mockAnswer = "Your team’s mission aligns with my passion for customer success.";
  const tags = ["🤝 Behavioral", "💬 Friendly", "✅ Match"];

  const toggleView = () => {
    setTranscriptVisible((prev) => !prev);
    setAiAnswerVisible((prev) => !prev);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">🔴 LIVE — Listening to Interview</h1>

      {transcriptVisible && (
        <div className="mb-4 bg-gray-100 p-4 rounded">
          <p className="text-sm text-gray-600 font-medium">❓ Transcript:</p>
          <div className="mt-1 text-gray-900">{mockTranscript}</div>
        </div>
      )}

      {aiAnswerVisible && (
        <div className="mb-4 bg-white border p-4 rounded space-y-2">
          <p className="text-sm text-gray-600 font-medium">💡 AI Answer:</p>
          <div className="text-gray-900">{mockAnswer}</div>
          <div className="text-xs text-gray-500">Tags: {tags.join(" | ")}</div>
        </div>
      )}

      <div className="flex gap-3 mt-6">
        <button
          onClick={toggleView}
          className="bg-blue-100 text-blue-700 px-4 py-2 rounded text-sm"
        >
          👁 Glance Mode
        </button>
        <button
          onClick={() => alert("Muted (not implemented)")}
          className="bg-red-100 text-red-700 px-4 py-2 rounded text-sm"
        >
          🔕 Mute
        </button>
        <button
          onClick={() => alert("Paused (not implemented)")}
          className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded text-sm"
        >
          ⏸ Pause
        </button>
      </div>
    </div>
  );
}
