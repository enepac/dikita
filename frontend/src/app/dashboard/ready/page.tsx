"use client";

export default function SessionReadyPage() {
  const mockSession = {
    role: "L1 Support Hero",
    tone: "Friendly",
    language: "English",
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">🎯 Final Session Parameters</h1>

      <div className="space-y-2 bg-gray-100 p-4 rounded">
        <p><strong>Role:</strong> {mockSession.role}</p>
        <p><strong>Tone:</strong> {mockSession.tone}</p>
        <p><strong>Language:</strong> {mockSession.language}</p>

        <div className="mt-4 p-3 bg-white border rounded">
          <p className="text-sm text-gray-600 font-medium">Prompt Preview:</p>
          <pre className="text-sm mt-1 bg-gray-50 p-2 rounded overflow-x-auto">
{`{
  role: "${mockSession.role}",
  tone: "${mockSession.tone}",
  language: "${mockSession.language}",
  docs: ["resume.pdf", "job_description.pdf", "elevator_pitch.docx"]
}`}
          </pre>
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <button
          onClick={() => window.location.href = "/dashboard/practice"}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          🧪 Start Practice
        </button>
        <button
          onClick={() => window.location.href = "/dashboard/live"}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          ▶ Skip to Live
        </button>
      </div>
    </div>
  );
}
