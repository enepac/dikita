"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type ChatMessage = {
  question: string;
  answer: string;
  timestamp: string;
};

export default function LiveInterviewPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [spokenText, setSpokenText] = useState("");
  const chunksRef = useRef<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const lastQuestionRef = useRef<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const isValid = (text: string): boolean => {
    const lower = text.toLowerCase();
    const invalidPatterns = [
      "you're welcome",
      "thank you for watching",
      "feel free to ask",
      "please clarify",
      "i'm here to help",
      "go to ",
      "subs by ",
      "i'm sorry",
      "as an ai",
    ];
    return !invalidPatterns.some((phrase) => lower.includes(phrase));
  };

  const highlightReadPortion = (fullText: string, readText: string): JSX.Element => {
    const readLength = readText.length;
    if (!readText || !fullText.toLowerCase().startsWith(readText.toLowerCase())) {
      return <>{fullText}</>;
    }
    return (
      <>
        <mark className="bg-yellow-200 text-black">
          {fullText.slice(0, readLength)}
        </mark>
        {fullText.slice(readLength)}
      </>
    );
  };

  const startAudioCapture = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);

      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const file = new File([blob], "live-chunk.webm", { type: "audio/webm" });

        const formData = new FormData();
        formData.append("file", file);
        formData.append("model", "whisper-1");
        formData.append("language", "en");

        try {
          const transcriptRes = await fetch("https://api.openai.com/v1/audio/transcriptions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
            },
            body: formData,
          });

          const transcriptData = await transcriptRes.json();
          const spoken = transcriptData.text?.trim();

          if (!spoken || isMuted || isPaused || spoken.length < 4) {
            return;
          }

          setSpokenText(spoken);

          if (!isValid(spoken) || spoken === lastQuestionRef.current) return;

          lastQuestionRef.current = spoken;

          const gptRes = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "gpt-4o",
              messages: [
                {
                  role: "system",
                  content:
                    "You are acting as the interviewee. Provide a direct, first-person answer to the interview question. Do not include tips, filler, or clarification prompts. Only return a serious, professional response.",
                },
                {
                  role: "user",
                  content: spoken,
                },
              ],
              temperature: 0.7,
            }),
          });

          const gptData = await gptRes.json();
          const answer = gptData?.choices?.[0]?.message?.content?.trim();

          if (answer && isValid(answer)) {
            setMessages([
              {
                question: spoken,
                answer,
                timestamp: new Date().toISOString(),
              },
            ]);
          }
        } catch (err) {
          console.error("Whisper or GPT error:", err);
        }

        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setTimeout(() => {
        recorder.stop();
      }, 5000);
    } catch (err) {
      console.error("Mic access denied:", err);
    }
  }, [isMuted, isPaused]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isMuted && !isPaused) {
        startAudioCapture();
      }
    }, 6000);
    return () => clearInterval(interval);
  }, [isMuted, isPaused, startAudioCapture]);

  useEffect(() => {
    containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const renderStatus = () => {
    if (isMuted) return "🔇 Muted";
    if (isPaused) return "⏸ Paused";
    return "🎙 Listening...";
  };

  return (
    <div className="p-4 h-screen flex flex-col bg-white text-[0.95rem] leading-relaxed">
      <div className="text-sm text-gray-500 mb-2">{renderStatus()}</div>

      <div ref={containerRef} className="flex-1 overflow-y-auto space-y-6 pr-1">
        {messages.map((msg, i) => (
          <div key={i} className="space-y-2">
            <div className="bg-gradient-to-r from-slate-100 to-slate-200 p-3 rounded-md shadow-sm">
              <p className="text-sm text-gray-500 mb-1">Q:</p>
              <p className="text-gray-800">{msg.question}</p>
            </div>
            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-3 rounded-md shadow-sm">
              <p className="text-sm text-gray-500 mb-1">A:</p>
              <p className="text-gray-900">
                {highlightReadPortion(msg.answer, spokenText)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex gap-2 justify-between">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm"
        >
          {isMuted ? "🔔 Unmute" : "🔕 Mute"}
        </button>
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="bg-yellow-100 text-yellow-700 px-3 py-2 rounded text-sm"
        >
          {isPaused ? "▶ Resume" : "⏸ Pause"}
        </button>
      </div>
    </div>
  );
}
