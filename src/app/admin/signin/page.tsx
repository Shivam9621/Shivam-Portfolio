import { Suspense } from "react";
import { connection } from "next/server";
import { signIn } from "@/lib/auth";
import { getAdminSession } from "@/features/admin/session";
import { redirect } from "next/navigation";
import { GithubIcon } from "@/features/portfolio/components/Icons";
import { ShieldAlert, Lock, ArrowLeft, Zap, ShieldCheck } from "lucide-react";

async function SignInForm({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  await connection();
  const session = await getAdminSession();
  if (session?.isAdmin) {
    redirect("/");
  }

  const { error } = await searchParams;
  const isGithubConfigured = Boolean(process.env.GITHUB_ID && process.env.GITHUB_SECRET);

  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0c0d14]/90 backdrop-blur-xl p-8 shadow-2xl space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-cyan-400 mb-2">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Admin Access
        </h1>
        <p className="text-sm text-gray-400">
          Sign in as <span className="text-cyan-400 font-mono">@Shivam9621</span> to manage your portfolio in real time.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Access Denied (403)</p>
            <p className="text-xs text-red-300/80 mt-1">
              {error === "AccessDenied"
                ? "Your GitHub account is not on the administrator allowlist."
                : "Invalid credentials or unauthorized login attempt."}
            </p>
          </div>
        </div>
      )}

      {/* 1-Click Instant Admin Sign-in (Seamless & Reliable) */}
      <form
        action={async () => {
          "use server";
          await signIn("admin-passcode", {
            passcode: "admin123",
            redirectTo: "/",
          });
        }}
        className="space-y-3"
      >
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl font-semibold text-sm text-black bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_25px_rgba(0,240,255,0.5)] transition-all duration-300 cursor-pointer"
        >
          <Zap className="w-4 h-4 fill-black" />
          <span>Instant 1-Click Admin Sign-In</span>
        </button>
        <p className="text-center text-[11px] text-gray-400 flex items-center justify-center gap-1.5 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Direct authorized admin access as @Shivam9621</span>
        </p>
      </form>

      <div className="relative flex items-center justify-center">
        <div className="border-t border-white/10 w-full"></div>
        <span className="bg-[#0c0d14] px-3 text-xs font-mono text-gray-500 uppercase">
          OR
        </span>
        <div className="border-t border-white/10 w-full"></div>
      </div>

      {/* GitHub OAuth Form */}
      {isGithubConfigured ? (
        <form
          action={async () => {
            "use server";
            await signIn("github", { redirectTo: "/" });
          }}
          className="space-y-4"
        >
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl font-medium text-sm text-white bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
          >
            <GithubIcon className="w-5 h-5" />
            <span>Sign in with GitHub OAuth</span>
          </button>
        </form>
      ) : (
        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-gray-400 space-y-1">
          <p className="font-semibold text-gray-300 flex items-center gap-1.5">
            <GithubIcon className="w-4 h-4 text-gray-400" />
            <span>GitHub OAuth Mode</span>
          </p>
          <p className="text-[11px] leading-relaxed text-gray-400">
            GITHUB_ID is empty in .env.local. Use the <strong className="text-cyan-400 font-normal">Instant 1-Click Sign-In</strong> button above for local development.
          </p>
        </div>
      )}

      <div className="pt-4 border-t border-white/10 text-center">
        <a
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Public Portfolio</span>
        </a>
      </div>
    </div>
  );
}

export default function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <div className="min-h-screen bg-[#050505] text-[#f4f4f5] flex items-center justify-center p-4">
      {/* Ambient background glow */}
      <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <Suspense fallback={<div className="text-gray-500 text-sm font-mono">Loading...</div>}>
        <SignInForm searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
