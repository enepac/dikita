'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import {
  sendSignInLinkToEmail,
  ActionCodeSettings,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";

export default function OnboardingPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const router = useRouter();

  // ✅ Redirect user to /mic-test only if onboardingStarted flag is set
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const onboardingStarted = localStorage.getItem("onboardingStarted") === "true";

      if (user && onboardingStarted) {
        localStorage.removeItem("onboardingStarted");

        const hasSessionProfile = false; // 🔧 Replace later with real profile check
        if (!hasSessionProfile) {
          router.push("/mic-test");
        } else {
          router.push("/session/setup");
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const actionCodeSettings: ActionCodeSettings = {
    url: "http://localhost:3000/onboarding",
    handleCodeInApp: true,
  };

  const handleSendOtp = async () => {
    if (!email) {
      setErrorMsg("Please enter a valid email.");
      return;
    }

    try {
      setStatus("loading");
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      localStorage.setItem("onboardingStarted", "true");
      window.localStorage.setItem("emailForSignIn", email);
      setStatus("sent");
      setErrorMsg("");
    } catch (error: any) {
      setStatus("error");
      setErrorMsg(error.message || "Failed to send link.");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      localStorage.setItem("onboardingStarted", "true");
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log("Google user:", result.user);
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  const handleGithubSignIn = async () => {
    try {
      localStorage.setItem("onboardingStarted", "true");
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log("GitHub user:", result.user);
    } catch (error) {
      console.error("GitHub sign-in error:", error);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6 bg-slate-800 p-8 rounded-2xl shadow-xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-center">
          Create Your Dikita Account
        </h1>

        <div className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-300"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleSendOtp}
            disabled={status === "loading"}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 rounded-lg transition duration-300 disabled:opacity-50"
          >
            {status === "loading" ? "Sending..." : "Send OTP"}
          </button>

          {status === "sent" && (
            <p className="text-sm text-green-400">
              Sign-in link sent! Check your email.
            </p>
          )}
          {status === "error" && (
            <p className="text-sm text-red-400">{errorMsg}</p>
          )}
        </div>

        <div className="text-center text-sm text-slate-400 relative my-6">
          <span className="bg-slate-800 px-2 z-10 relative">
            or sign up with
          </span>
          <div className="absolute left-0 top-1/2 w-full h-px bg-slate-600 -z-10"></div>
        </div>

        <div className="flex flex-col space-y-3">
          <button
            onClick={handleGoogleSignIn}
            className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 rounded-lg transition duration-300"
          >
            Continue with Google
          </button>

          <button
            onClick={handleGithubSignIn}
            className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 rounded-lg transition duration-300"
          >
            Continue with GitHub
          </button>
        </div>

        <div className="text-center text-sm text-slate-500 mt-4">
          <Link href="/" className="underline hover:text-white transition">
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
