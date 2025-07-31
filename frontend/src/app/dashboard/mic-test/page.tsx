"use client";

import { useEffect, useRef, useState } from "react";

export default function MicTest() {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState("");
  const [volume, setVolume] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    const startMic = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
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
      <p className="text-gray-600 mb-6">Play test audio on your interview device. Dikita should detect your voice here.</p>

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
        <p className="text-sm text-green-700 mt-4">✅ Listening... Adjust volume or move device closer.</p>
      )}
    </main>
  );
}
