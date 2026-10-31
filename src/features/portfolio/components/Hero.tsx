"use client";

import { useState } from "react";
import Image from "next/image";
import { Profile, Link as LinkItem } from "../schema";
import { ArrowRight, Download, Mail, Code, Sparkles, Briefcase, Award, Pencil } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./Icons";
import { useAdminEdit } from "@/features/admin/AdminEditContext";
import { ProfileDrawerForm } from "@/features/admin/ProfileDrawerForm";

interface HeroProps {
  profile: Profile;
  links: LinkItem[];
}

export function Hero({ profile: initialProfile, links }: HeroProps) {
  const { isEditMode } = useAdminEdit();
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);

  const githubLink = links.find((l) => l.kind === "github")?.url || "https://github.com/Shivam9621";
  const linkedinLink = links.find((l) => l.kind === "linkedin")?.url;
  const leetcodeLink = links.find((l) => l.kind === "leetcode")?.url;
  const resumeUrl = profile.resumeUrl || "https://drive.google.com/file/d/1-hCtASJqOcd1yB0hXsRNgAaD92KunuCw/view?usp=sharing";

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-10 left-1/4 -translate-x-1/2 w-[520px] h-[520px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse-glow -z-10" />
      <div className="absolute top-36 right-10 w-[580px] h-[580px] bg-cyan-500/15 rounded-full blur-[150px] pointer-events-none animate-pulse-glow -z-10" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Bio & CTAs */}
        <div className="lg:col-span-7 space-y-6 text-left">
          {/* Status Badge & Edit Profile CTA */}
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold tracking-wider uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Available For Opportunities
            </div>

            {isEditMode && (
              <button
                onClick={() => setProfileDrawerOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-medium text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 transition-all cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
              Hi, I&apos;m <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
                {profile.name}
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 font-light pt-1">
              {profile.headline}
            </p>
          </div>

          {/* Intro Description */}
          <p className="text-gray-400 text-base sm:text-lg max-w-xl leading-relaxed">
            {profile.intro}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-black bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] transition-all duration-300 cursor-pointer"
            >
              <span>Explore Projects</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-white/5 border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-500/10 shadow-[0_0_15px_rgba(0,240,255,0.15)] transition-all duration-300 cursor-pointer"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Resume / CV</span>
            </a>

            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-medium text-sm text-gray-300 bg-white/5 border border-white/10 hover:text-white hover:border-white/20 transition-all duration-300 cursor-pointer"
            >
              <span>Contact</span>
            </a>
          </div>

          {/* Social Icons Row */}
          <div className="flex items-center gap-4 pt-4 text-gray-400">
            {githubLink && (
              <a
                href={githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all duration-300"
                aria-label="GitHub Profile"
              >
                <GithubIcon className="w-5 h-5" />
              </a>
            )}

            {linkedinLink && (
              <a
                href={linkedinLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all duration-300"
                aria-label="LinkedIn Profile"
              >
                <LinkedinIcon className="w-5 h-5" />
              </a>
            )}

            {leetcodeLink && (
              <a
                href={leetcodeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all duration-300"
                aria-label="LeetCode Profile"
              >
                <Code className="w-5 h-5" />
              </a>
            )}

            <a
              href={`mailto:${profile.email}`}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all duration-300"
              aria-label="Email Me"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Right Column: Professional Portrait Showcase */}
        <div className="lg:col-span-5 w-full flex justify-center">
          <div className="relative group max-w-sm sm:max-w-md w-full">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-3xl blur-xl opacity-40 group-hover:opacity-75 transition duration-500 -z-10" />

            <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-[#0c0d14]/90 backdrop-blur-xl p-3 shadow-2xl">
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-neutral-900">
                <Image
                  src={profile.avatarUrl || "/shivam.jpg"}
                  alt={profile.name}
                  fill
                  priority
                  className="object-cover object-top filter brightness-105 group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 450px"
                />

                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                  <div className="flex items-center gap-1.5 font-semibold drop-shadow-md">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>{profile.name}</span>
                  </div>
                  <span className="text-[11px] font-mono text-cyan-300 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-cyan-500/30">
                    B.Tech + M.Tech AI
                  </span>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.04] border border-white/10 text-gray-300">
                  <Briefcase className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">Siemens EDA R&D</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.04] border border-white/10 text-gray-300">
                  <Award className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                  <span className="truncate">GATE 2026 CS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProfileDrawerForm
        isOpen={profileDrawerOpen}
        onClose={() => setProfileDrawerOpen(false)}
        profile={profile}
        onSaved={(updated) => setProfile(updated)}
      />
    </section>
  );
}
