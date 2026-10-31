"use client";

import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error boundary triggered:", error);
  }, [error]);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050505] px-4">
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-rose-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative z-10 max-w-md w-full rounded-2xl border border-rose-500/20 bg-white/[0.03] p-8 text-center backdrop-blur-xl shadow-2xl">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 mb-6">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="text-xl font-bold tracking-tight text-white mb-2">
          System Anomaly Detected
        </h1>
        <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
          {error?.message || "An unexpected disturbance occurred while rendering this interface."}
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition-all duration-200 hover:brightness-110 active:scale-95"
          >
            Attempt Recovery
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-neutral-300 transition-all duration-200 hover:bg-white/10 hover:text-white"
          >
            Reload Portfolio
          </a>
        </div>
      </div>
    </div>
  );
}
