"use client";

import { useEffect, useRef, useState } from "react";
import { transcribeAudio } from "@/lib/whisper";

export default function MicTest() {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState("");
  const [volume, setVolume] = useState(0);
  const [transcript, setTranscript] = useState("");
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);

  useEffect(() => {
    const startMic = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        audioContextRef.current = new AudioContext();
        const source = audioContextRef.current.createMediaStreamSource(stream);
        const analyser = audioContextRef.current.createAnalyser();
        source.connect(analyser);
        analyser.fftSize = 256;
        analyserRef.current = analyser;

        setListening(true);
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const updateVolume = () => {
          analyser.getByteFrequencyData(dataArray);
          const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
          setVolume(Math.round(avg));
          rafIdRef.current = requestAnimationFrame(updateVolume);
        };

        updateVolume();
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error(err.message);
          setError("🎙 Microphone access denied or unavailable.");
        } else {
          console.error(err);
          setError("🎙 Unknown error occurred.");
        }
      }
    };

    startMic();

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      audioContextRef.current?.close();
    };
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-2xl font-bold mb-2">🎙 Mic Test</h2>
      <p className="text-gray-600 mb-6">
        Play test audio on your interview device. Dikita should detect your
        voice here.
      </p>

      {error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="w-72 h-6 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-100"
            style={{ width: `${volume}%` }}
          ></div>
        </div>
      )}

      {listening && !error && (
        <p className="text-sm text-green-700 mt-4">
          ✅ Listening... Adjust volume or move device closer.
        </p>
      )}

      <button
        onClick={async () => {
          setIsTranscribing(true);
          setTranscript("🔄 Transcribing...");
          const fakeBlob = new Blob();
          const result = await transcribeAudio(fakeBlob);
          setTranscript(result);
          setIsTranscribing(false);
        }}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
      >
        {isTranscribing && (
          <svg
            className="animate-spin h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            ></path>
          </svg>
        )}
        {isTranscribing ? "Transcribing..." : "🧠 Simulate Transcription"}
      </button>

      {transcript && <p className="mt-4 text-sm text-blue-700">{transcript}</p>}
    </main>
  );
}
