// frontend/src/app/dashboard/setup/page.tsx
"use client";

import { useState } from "react";

export default function SetupWorkspace() {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [tone, setTone] = useState("Confident");
  const [language, setLanguage] = useState("English");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const config = { company, role, tone, language };
    console.log("Workspace Config:", config);
    // TODO: Save to Supabase and redirect to upload
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <h2 className="text-2xl font-bold mb-4">🛠 Create Interview Workspace</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
        <input
          type="text"
          placeholder="Company Name"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="border px-4 py-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Role Title"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border px-4 py-2 rounded"
          required
        />
        <select value={tone} onChange={(e) => setTone(e.target.value)} className="border px-4 py-2 rounded">
          <option>Confident</option>
          <option>Friendly</option>
          <option>Calm</option>
          <option>Professional</option>
        </select>
        <select value={language} onChange={(e) => setLanguage(e.target.value)} className="border px-4 py-2 rounded">
          <option>English</option>
          <option>French</option>
          <option>Spanish</option>
        </select>

        <button type="submit" className="bg-green-600 text-white py-2 rounded hover:bg-green-700">
          ✅ Save & Continue
        </button>
      </form>
    </main>
  );
}
