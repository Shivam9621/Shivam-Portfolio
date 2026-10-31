import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050505] px-4">
      {/* Background radial gradients */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />

      <div className="relative z-10 max-w-md w-full rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center backdrop-blur-xl shadow-2xl">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-6 text-2xl font-mono font-bold">
          404
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
          Sector Not Found
        </h1>
        <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
          The requested coordinate does not exist or has been shifted in hyperspace.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all duration-200 hover:brightness-110 active:scale-95"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Portfolio
        </Link>
      </div>
    </div>
  );
}
