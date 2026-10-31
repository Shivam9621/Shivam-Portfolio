"use client";

import { useAdminEdit } from "./AdminEditContext";
import { signOut } from "next-auth/react";
import { ShieldCheck, LogOut, CheckCircle2, Download } from "lucide-react";

interface AdminBarProps {
  userLogin?: string;
}

export function AdminBar({ userLogin }: AdminBarProps) {
  const { isEditMode, toggleEditMode } = useAdminEdit();

  return (
    <aside
      aria-label="Admin Control Bar"
      className="fixed top-0 left-0 right-0 z-[60] bg-[#0c0d16]/95 border-b border-cyan-500/40 backdrop-blur-xl px-4 py-2 text-xs font-mono text-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Admin indicator & Edit Mode Toggle */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Admin Active</span>
          </div>

          <div className="h-4 w-px bg-white/15" />

          {/* Edit mode toggle */}
          <div className="flex items-center gap-2">
            <span className="text-gray-300 font-medium">Edit mode:</span>
            <button
              onClick={toggleEditMode}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isEditMode ? "bg-cyan-500" : "bg-neutral-800"
              }`}
              role="switch"
              aria-checked={isEditMode}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  isEditMode ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
            <span className={`text-[11px] font-bold ${isEditMode ? "text-cyan-300" : "text-gray-500"}`}>
              [{isEditMode ? "ON" : "OFF"}]
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-emerald-400 pl-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Saved</span>
          </div>
        </div>

        {/* Right: User identification, Backup Export, & Sign Out */}
        <div className="flex items-center gap-3">
          {/* Backup JSON Button */}
          <a
            href="/api/admin/backup"
            download
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-cyan-300 hover:text-white hover:bg-white/10 hover:border-cyan-500/40 transition-colors"
            title="Download full JSON backup of portfolio data"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Backup JSON</span>
          </a>

          {userLogin && (
            <span className="hidden md:inline text-gray-400">
              user: <span className="text-white">@{userLogin}</span>
            </span>
          )}

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 hover:border-red-500/40 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-red-400" />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
