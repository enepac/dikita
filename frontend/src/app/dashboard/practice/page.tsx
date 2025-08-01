"use client";

import { useState } from "react";

const questions = [
  "Tell me about a project you led.",
  "How do you handle pressure?",
  "What excites you about this role?",
];

export default function PracticeModePage() {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const currentQuestion = questions[index];

  const handleSubmit = () => {
    if (answer.trim()) setSubmitted(true);
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % questions.length);
    setAnswer("");
    setSubmitted(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">🧪 Practice Mode</h1>

      <div className="mb-4 bg-gray-100 p-4 rounded">
        <p className="font-medium text-gray-800">❓ Q: “{currentQuestion}”</p>
      </div>

      {submitted ? (
        <div className="bg-white border p-4 rounded space-y-2">
          <p className="text-sm text-gray-600">💬 A: “{answer}”</p>
          <div className="text-xs text-gray-500">Tags: 🧠 Technical | 💬 Clear | 👍 High Fit</div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setSubmitted(false)}
              className="bg-yellow-500 text-white px-4 py-2 rounded"
            >
              👎 Retry
            </button>
            <button
              onClick={handleNext}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              🔁 Next Question
            </button>
          </div>
        </div>
      ) : (
        <>
          <textarea
            className="w-full p-3 border rounded mb-4"
            rows={4}
            placeholder="Type your answer here..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            👍 Submit Answer
          </button>
        </>
      )}
    </div>
  );
}
