"use client";

import { useState } from "react";
import { Profile } from "../schema";
import { ArrowUpRight, Menu, X } from "lucide-react";

interface TopBarProps {
  profile: Profile;
}

export function TopBar({ profile }: TopBarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/70 backdrop-blur-xl border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a
          href="#"
          className="text-2xl font-bold tracking-tight text-white flex items-center group"
        >
          <span>SJ</span>
          <span className="text-cyan-400 group-hover:text-purple-400 transition-colors">.</span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-300">
          <a href="#experience" className="hover:text-white transition-colors">
            Experience
          </a>
          <a href="#projects" className="hover:text-white transition-colors">
            Projects
          </a>
          <a href="#skills" className="hover:text-white transition-colors">
            Skills
          </a>
          <a href="#achievements" className="hover:text-white transition-colors">
            Achievements
          </a>
          <a href="#contact" className="hover:text-white transition-colors">
            Contact
          </a>
        </div>

        {/* Right CTA */}
        <div className="hidden md:flex items-center space-x-4">
          <a
            href={profile.resumeUrl || "https://drive.google.com/file/d/1-hCtASJqOcd1yB0hXsRNgAaD92KunuCw/view?usp=sharing"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-gray-200 hover:bg-white/10 hover:border-cyan-500/50 hover:text-white transition-all duration-300"
          >
            <span>Resume</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
          </a>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-300 hover:text-white p-2"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a0a0f] border-b border-white/10 px-4 pt-3 pb-6 space-y-3">
          <a
            href="#experience"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-300 hover:text-white py-1"
          >
            Experience
          </a>
          <a
            href="#projects"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-300 hover:text-white py-1"
          >
            Projects
          </a>
          <a
            href="#skills"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-300 hover:text-white py-1"
          >
            Skills
          </a>
          <a
            href="#achievements"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-300 hover:text-white py-1"
          >
            Achievements
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-300 hover:text-white py-1"
          >
            Contact
          </a>
        </div>
      )}
    </nav>
  );
}
