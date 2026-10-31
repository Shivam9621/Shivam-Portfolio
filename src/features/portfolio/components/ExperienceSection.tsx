"use client";

import { useState, useEffect } from "react";
import { Experience } from "../schema";
import { useAdminEdit } from "@/features/admin/AdminEditContext";
import { ExperienceDrawerForm } from "@/features/admin/ExperienceDrawerForm";
import {
  Briefcase,
  Calendar,
  MapPin,
  CheckCircle2,
  Pencil,
  Eye,
  EyeOff,
  Trash2,
  Plus,
  AlertTriangle,
} from "lucide-react";

interface ExperienceSectionProps {
  experience: Experience[];
}

export function ExperienceSection({ experience: initialExperience }: ExperienceSectionProps) {
  const { isEditMode } = useAdminEdit();
  const [experience, setExperience] = useState<Experience[]>(initialExperience);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [deletingExp, setDeletingExp] = useState<Experience | null>(null);

  useEffect(() => {
    setExperience(initialExperience);
  }, [initialExperience]);

  const visibleExp = experience
    .filter((e) => isEditMode || e.visible !== false)
    .sort((a, b) => a.order - b.order);

  const handleToggleVisible = async (exp: Experience) => {
    const newVisibility = exp.visible === false;
    const updated = experience.map((e) =>
      e.id === exp.id ? { ...e, visible: newVisibility } : e
    );
    setExperience(updated);

    try {
      await fetch(`/api/admin/experience/${exp.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visible: newVisibility }),
      });
    } catch (err) {
      console.error("Failed to update experience visibility:", err);
    }
  };

  const confirmDelete = async () => {
    if (!deletingExp) return;
    const expId = deletingExp.id;
    setExperience(experience.filter((e) => e.id !== expId));
    setDeletingExp(null);

    try {
      await fetch(`/api/admin/experience/${expId}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Failed to delete experience:", err);
    }
  };

  const handleSaved = (saved: Experience) => {
    const exists = experience.some((e) => e.id === saved.id);
    if (exists) {
      setExperience(experience.map((e) => (e.id === saved.id ? saved : e)));
    } else {
      setExperience([...experience, saved]);
    }
  };

  return (
    <section id="experience" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center space-y-3 mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-semibold tracking-wider uppercase">
          <Briefcase className="w-3.5 h-3.5" />
          <span>Professional Background</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Work <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Experience</span>
        </h2>
        <p className="text-gray-400 max-w-lg mx-auto text-sm sm:text-base">
          Engineering roles and production R&D contributions.
        </p>

        {isEditMode && (
          <div className="pt-2">
            <button
              onClick={() => {
                setEditingExp(null);
                setDrawerOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold text-black bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all cursor-pointer font-mono"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Position</span>
            </button>
          </div>
        )}
      </div>

      <div className="space-y-8 max-w-4xl mx-auto">
        {visibleExp.map((exp) => {
          const isHidden = exp.visible === false;
          return (
            <div
              key={exp.id}
              className={`relative rounded-2xl border bg-[#0c0d14]/80 backdrop-blur-xl p-6 sm:p-8 transition-all duration-300 ${
                isHidden
                  ? "border-yellow-500/30 bg-[#12110c]/80 opacity-75"
                  : "border-white/10 hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(0,240,255,0.08)]"
              }`}
            >
              {/* Admin Toolbar */}
              {isEditMode && (
                <div className="mb-4 pb-3 border-b border-white/15 flex items-center justify-between bg-white/[0.03] -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 p-3 px-6 sm:px-8 rounded-t-2xl font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400 font-bold">Admin Controls</span>
                    {isHidden && (
                      <span className="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 text-[10px]">
                        HIDDEN
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleVisible(exp)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isHidden
                          ? "text-yellow-400 bg-yellow-500/10 hover:bg-yellow-500/20"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                      title={isHidden ? "Hidden from visitors (Click to show)" : "Visible (Click to hide)"}
                    >
                      {isHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => {
                        setEditingExp(exp);
                        setDrawerOpen(true);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-colors"
                      title="Edit role & bullets"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Edit Bullets</span>
                    </button>
                    <button
                      onClick={() => setDeletingExp(exp)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete experience"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-6 border-b border-white/10">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    {exp.role}
                  </h3>
                  <div className="text-base sm:text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 pt-0.5">
                    {exp.company}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-gray-300">
                    <Calendar className="w-3 h-3 text-cyan-400" />
                    <span>{exp.start} — {exp.end}</span>
                  </span>
                  {exp.location && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-gray-400">
                      <MapPin className="w-3 h-3 text-purple-400" />
                      <span>{exp.location}</span>
                    </span>
                  )}
                </div>
              </div>

              {exp.team && (
                <div className="pt-4 pb-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-2.5 py-1 rounded-md">
                    Team: {exp.team}
                  </span>
                </div>
              )}

              <ul className="space-y-3.5 pt-4 text-gray-300 text-sm sm:text-base leading-relaxed">
                {exp.bullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-1" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <ExperienceDrawerForm
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        experience={editingExp}
        onSaved={handleSaved}
      />

      {/* Delete confirmation modal */}
      {deletingExp && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div
            onClick={() => setDeletingExp(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0e0f18] p-6 shadow-2xl space-y-5 text-gray-200">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Delete Position</h3>
                <p className="text-xs text-gray-400 leading-relaxed font-mono">
                  Are you sure you want to delete <strong className="text-white">&quot;{deletingExp.role}&quot;</strong> at {deletingExp.company}?
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2 text-xs font-mono">
              <button
                onClick={() => {
                  handleToggleVisible(deletingExp);
                  setDeletingExp(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-200 hover:text-white transition-colors cursor-pointer"
              >
                Hide Instead
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 hover:bg-red-500/30 transition-colors font-semibold cursor-pointer"
              >
                Delete
              </button>
              <button
                onClick={() => setDeletingExp(null)}
                className="py-2.5 px-3 rounded-xl border border-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
