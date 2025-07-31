"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function UploadDocuments() {
  const [files, setFiles] = useState<File[]>([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [uploading, setUploading] = useState(false);

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
    setUploading(true);
    setStatusMessage("");

    for (const file of files) {
      const storagePath = `uploads/${Date.now()}-${file.name}`;

      const { error: storageError } = await supabase.storage
        .from("documents")
        .upload(storagePath, file);

      if (storageError) {
        setStatusMessage(`❌ Upload failed for ${file.name}`);
        console.error("Upload error:", storageError.message);
        continue;
      }

      const { error: dbError } = await supabase.from("documents").insert({
        file_name: file.name,
        storage_path: storagePath,
      });

      if (dbError) {
        setStatusMessage(`❌ Metadata failed for ${file.name}`);
        console.error("Metadata error:", dbError.message);
      } else {
        setStatusMessage(`✅ Uploaded ${file.name} successfully`);
      }
    }

    setUploading(false);
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
          <li key={i} className="flex justify-between items-center border p-2 rounded mb-2">
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
        disabled={uploading}
        className={`bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 ${
          uploading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {uploading ? "Uploading..." : "🧠 Embed Docs into AI Memory"}
      </button>

      {statusMessage && (
        <p className="mt-4 text-sm text-green-700 transition-all duration-500">
          {statusMessage}
        </p>
      )}
    </main>
  );
}
