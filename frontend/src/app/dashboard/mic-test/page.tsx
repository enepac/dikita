"use client";

import { useState, useRef } from "react";

export default function MicTestPage() {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    setError(null);
    setTranscript(null);
    setRecording(true);
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);

      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const file = new File([blob], "mic-test.webm", { type: "audio/webm" });

        // Upload to OpenAI Whisper API
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
          if (data.text) {
            setTranscript(data.text);
          } else {
            setError("No transcript received.");
          }
        } catch {
          setError("Transcription failed.");
        } finally {
          setRecording(false);
        }
      };

      recorder.start();
      setTimeout(() => {
        recorder.stop();
        stream.getTracks().forEach((track) => track.stop());
      }, 5000); // 5 seconds for faster test
    } catch {
      setError("Microphone access denied.");
      setRecording(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">🎙 Mic Test — Confirm Listening</h1>

      <button
        onClick={startRecording}
        disabled={recording}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {recording ? "Listening..." : "Start Mic Test"}
      </button>

      {transcript && (
        <div className="mt-4 bg-green-100 p-3 rounded">
          ✅ Transcript: <em>{transcript}</em>
        </div>
      )}

      {error && (
        <div className="mt-4 bg-red-100 p-3 rounded">
          ❌ Error: <em>{error}</em>
        </div>
      )}

      {(transcript || error) && (
        <div className="mt-6 flex gap-4">
          <button
            onClick={() => window.location.href = "/dashboard/ready"}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            ✅ Continue
          </button>
          <button
            onClick={startRecording}
            className="bg-yellow-600 text-white px-4 py-2 rounded"
          >
            🔁 Retry
          </button>
        </div>
      )}
    </div>
  );
}
