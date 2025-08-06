'use client';
import React, { useState, useRef } from 'react';

export default function MicTestPage() {
  const [transcript, setTranscript] = useState('');
  const [fingerprintTranscript, setFingerprintTranscript] = useState('');
  const [error, setError] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [trainingSeconds, setTrainingSeconds] = useState(0);
  const [micBlob, setMicBlob] = useState<Blob | null>(null);
  const [yourVoiceBlob, setYourVoiceBlob] = useState<Blob | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = (type: 'test' | 'train') => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (type === 'test') {
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds((s) => s + 1);
      }, 1000);
    } else {
      setTrainingSeconds(0);
      timerRef.current = setInterval(() => {
        setTrainingSeconds((s) => s + 1);
      }, 1000);
    }
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const startMicTest = async () => {
    try {
      setError('');
      setTranscript('');
      setIsRecording(true);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stopTimer();
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setMicBlob(blob);

        const formData = new FormData();
        formData.append('file', blob, 'mic-test.webm');
        formData.append('model', 'whisper-1');
        formData.append('language', 'en');

        const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
          },
          body: formData,
        });

        const data = await res.json();
        setTranscript(data.text || 'No transcript returned.');
        stream.getTracks().forEach((track) => track.stop());
        setIsRecording(false);
      };

      mediaRecorder.start();
      startTimer('test');
    } catch (err) {
      console.error(err);
      setError('❌ Could not access mic.');
      setIsRecording(false);
    }
  };

  const stopMicTest = () => {
    mediaRecorderRef.current?.stop();
  };

  const startVoiceTraining = async () => {
    try {
      setError('');
      setIsTraining(true);
      setYourVoiceBlob(null);
      setFingerprintTranscript('');

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        stopTimer();
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setYourVoiceBlob(blob);
        stream.getTracks().forEach((track) => track.stop());
        setIsTraining(false);
      };

      recorder.start();
      startTimer('train');
    } catch (err) {
      console.error(err);
      setError('❌ Failed to start voice training.');
      setIsTraining(false);
    }
  };

  const stopVoiceTraining = () => {
    mediaRecorderRef.current?.stop();
  };

  // 🚧 DEV ONLY: Send voice fingerprint to Whisper for verification
  const verifyFingerprintWithWhisper = async () => {
    if (!yourVoiceBlob) return;
    const formData = new FormData();
    formData.append('file', yourVoiceBlob, 'fingerprint.webm');
    formData.append('model', 'whisper-1');
    formData.append('language', 'en');

    const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
      },
      body: formData,
    });

    const data = await res.json();
    setFingerprintTranscript(data.text || 'No transcript returned.');
  };

  return (
    <main className="p-6 max-w-xl mx-auto space-y-6 text-center">
      <h1 className="text-2xl font-semibold">🎙 Mic Test + Voice Training</h1>

      {/* Mic Test */}
      <section className="space-y-3">
        <h2 className="text-lg font-medium">Mic Test</h2>
        <p className="text-gray-600">Play interview audio aloud and confirm transcription.</p>

        {!isRecording ? (
          <button
            onClick={startMicTest}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            ▶ Start Mic Test
          </button>
        ) : (
          <button
            onClick={stopMicTest}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            ⏹ Stop
          </button>
        )}

        {isRecording && (
          <p className="text-sm text-gray-500">⏱ Recording: {recordingSeconds}s</p>
        )}

        {transcript && (
          <p className="text-sm text-gray-800 mt-2">📝 Transcript: “{transcript}”</p>
        )}

        {micBlob && (
          <audio controls className="mt-2 mx-auto">
            <source src={URL.createObjectURL(micBlob)} type="audio/webm" />
            Your browser does not support audio playback.
          </audio>
        )}
      </section>

      <hr />

      {/* Voice Training */}
      <section className="space-y-3">
        <h2 className="text-lg font-medium">Voice Fingerprint Training</h2>
        <p className="text-gray-600">Read the paragraph aloud for speaker separation.</p>

        <blockquote className="bg-gray-100 p-3 rounded text-sm text-gray-700">
          “Hi, my name is [Your Name]. I’m preparing for a job interview using the Dikita assistant.
          My goal is to answer questions clearly and confidently. I enjoy solving problems and working
          on real-world software challenges.”
        </blockquote>

        {!isTraining ? (
          <button
            onClick={startVoiceTraining}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            ▶ Start Training
          </button>
        ) : (
          <button
            onClick={stopVoiceTraining}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            ⏹ Stop
          </button>
        )}

        {isTraining && (
          <p className="text-sm text-gray-500">⏱ Recording: {trainingSeconds}s</p>
        )}

        {yourVoiceBlob && (
          <>
            <p className="text-green-700 text-sm mt-2">✅ Voice fingerprint saved.</p>
            <audio controls className="mt-2 mx-auto">
              <source src={URL.createObjectURL(yourVoiceBlob)} type="audio/webm" />
              Your browser does not support audio playback.
            </audio>

            {/* 🚧 DEV ONLY: Whisper verification for fingerprint */}
            <button
              onClick={verifyFingerprintWithWhisper}
              className="mt-4 px-3 py-1 bg-gray-800 text-white rounded text-sm"
            >
              🔍 Dev Only: Verify Fingerprint via Whisper
            </button>

            {fingerprintTranscript && (
              <p className="text-sm mt-2 text-blue-700">
                🔊 Whisper Transcript: “{fingerprintTranscript}”
              </p>
            )}
          </>
        )}
      </section>

      {error && <p className="text-red-600 text-sm">{error}</p>}
    </main>
  );
}
