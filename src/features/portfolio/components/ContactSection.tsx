"use client";

import { useState } from "react";
import { Link as LinkItem, Profile } from "../schema";
import { Mail, Code, Copy, Check, Send } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./Icons";

interface ContactSectionProps {
  profile: Profile;
  links: LinkItem[];
}

export function ContactSection({ profile, links }: ContactSectionProps) {
  const [copied, setCopied] = useState(false);
  const activeLinks = links.filter((l) => l.url && l.url.trim().length > 0);

  const copyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const githubLink = activeLinks.find((l) => l.kind === "github")?.url;
  const linkedinLink = activeLinks.find((l) => l.kind === "linkedin")?.url;
  const leetcodeLink = activeLinks.find((l) => l.kind === "leetcode")?.url;

  return (
    <footer id="contact" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-[#0c0d16] to-[#06070a] p-8 sm:p-14 overflow-hidden shadow-2xl text-center">
        {/* Ambient glow inside card */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-2xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-semibold tracking-wider uppercase">
            <Send className="w-3.5 h-3.5" />
            <span>Connect & Collaborate</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Let&apos;s Build Something <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
              Remarkable Together
            </span>
          </h2>

          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            I am currently open to AI/ML engineering roles, RAG research opportunities, and backend architecture challenges.
          </p>

          {/* Email Action Box */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={`mailto:${profile.email}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-black bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all duration-300"
            >
              <Mail className="w-4 h-4" />
              <span>Send an Email</span>
            </a>

            <button
              onClick={copyEmail}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-medium text-sm text-gray-300 bg-white/5 border border-white/10 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-gray-400" />
                  <span>Copy: {profile.email}</span>
                </>
              )}
            </button>
          </div>

          {/* Social Links */}
          <div className="pt-8 border-t border-white/10 flex items-center justify-center gap-4">
            {githubLink && (
              <a
                href={githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors text-xs font-mono"
              >
                <GithubIcon className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            )}

            {linkedinLink && (
              <a
                href={linkedinLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors text-xs font-mono"
              >
                <LinkedinIcon className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
            )}

            {leetcodeLink && (
              <a
                href={leetcodeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors text-xs font-mono"
              >
                <Code className="w-4 h-4" />
                <span>LeetCode</span>
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="mt-12 text-center text-xs font-mono text-gray-500">
        © 2026 {profile.name} · Engineered with Next.js & TypeScript
      </div>
    </footer>
  );
}
