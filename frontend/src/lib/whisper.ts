// frontend/src/lib/whisper.ts

export async function transcribeAudio(blob: Blob): Promise<string> {
  console.log("🔊 Received audio blob for transcription:", blob);

  // TODO: Load Whisper WASM model and process blob here
  // For now, simulate with fake delay and response
  await new Promise((resolve) => setTimeout(resolve, 1200));

  return "🧠 Simulated transcript: 'Testing one two three...'";
}
