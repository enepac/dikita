// frontend/src/app/dashboard/upload/page.tsx
"use client";

import { supabase } from "@/lib/supabase"; // make sure this import is at the top
import { useState } from "react";

export default function UploadDocuments() {
  const [files, setFiles] = useState<File[]>([]);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const dropped = Array.from(event.dataTransfer.files);
    setFiles((prev) => [...prev, ...dropped]);
  };

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files ? Array.from(event.target.files) : [];
    setFiles((prev) => [...prev, ...selected]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    for (const file of files) {
      const { data, error } = await supabase.storage
        .from("documents")
        .upload(`uploads/${Date.now()}-${file.name}`, file);

      if (error) {
        console.error("Upload error:", error.message);
      } else {
        console.log("File uploaded:", data.path);
      }
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center p-6">
      <h2 className="text-2xl font-bold mb-4">📤 Upload Documents</h2>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="w-full max-w-xl p-6 border-2 border-dashed rounded-lg text-center mb-4"
      >
        Drag & Drop files here or{" "}
        <label className="text-blue-600 underline cursor-pointer">
          browse
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            multiple
            hidden
            onChange={handleFileInput}
          />
        </label>
      </div>

      <ul className="w-full max-w-xl mb-4">
        {files.map((file, i) => (
          <li
            key={i}
            className="flex justify-between items-center border p-2 rounded mb-2"
          >
            {file.name}
            <button
              onClick={() => removeFile(i)}
              className="text-red-500 hover:underline"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
      >
        🧠 Embed Docs into AI Memory
      </button>
    </main>
  );
}
