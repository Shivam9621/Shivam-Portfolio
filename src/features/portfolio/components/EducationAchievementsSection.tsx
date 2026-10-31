"use client";

import { useState, useEffect } from "react";
import { Education, Achievement } from "../schema";
import { useAdminEdit } from "@/features/admin/AdminEditContext";
import { AchievementDrawerForm } from "@/features/admin/AchievementDrawerForm";
import { EducationDrawerForm } from "@/features/admin/EducationDrawerForm";
import {
  GraduationCap,
  Trophy,
  Award,
  BookOpen,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";

interface EducationAchievementsProps {
  education: Education[];
  achievements: Achievement[];
  coursework?: string[];
}

export function EducationAchievementsSection({
  education: initialEducation,
  achievements: initialAchievements,
  coursework = [],
}: EducationAchievementsProps) {
  const { isEditMode } = useAdminEdit();
  const [education, setEducation] = useState<Education[]>(initialEducation);
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);

  // Achievement Drawer
  const [achDrawerOpen, setAchDrawerOpen] = useState(false);
  const [editingAch, setEditingAch] = useState<Achievement | null>(null);

  // Education Drawer
  const [eduDrawerOpen, setEduDrawerOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<Education | null>(null);

  useEffect(() => {
    setEducation(initialEducation);
  }, [initialEducation]);

  useEffect(() => {
    setAchievements(initialAchievements);
  }, [initialAchievements]);

  const visibleEducation = education
    .filter((e) => isEditMode || e.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const visibleAchievements = achievements
    .filter((a) => isEditMode || a.visible !== false)
    .sort((a, b) => a.order - b.order);

  const defaultCoursework = coursework.length > 0 ? coursework : [
    "Database Management Systems (DBMS)",
    "Operating Systems",
    "Data Structures & Algorithms (DSA)",
    "Computer Networks",
    "Machine Learning",
    "Artificial Intelligence",
  ];

  const handleDeleteEdu = async (eduId: string) => {
    setEducation(education.filter((e) => e.id !== eduId));
    try {
      await fetch(`/api/admin/education/${eduId}`, { method: "DELETE" });
    } catch (err) {
      console.error("Failed to delete education:", err);
    }
  };

  const handleSavedEdu = (saved: Education) => {
    const exists = education.some((e) => e.id === saved.id);
    if (exists) {
      setEducation(education.map((e) => (e.id === saved.id ? saved : e)));
    } else {
      setEducation([...education, saved]);
    }
  };

  const handleDeleteAch = async (achId: string) => {
    setAchievements(achievements.filter((a) => a.id !== achId));
    try {
      await fetch(`/api/admin/achievements/${achId}`, { method: "DELETE" });
    } catch (err) {
      console.error("Failed to delete achievement:", err);
    }
  };

  const handleSavedAch = (saved: Achievement) => {
    const exists = achievements.some((a) => a.id === saved.id);
    if (exists) {
      setAchievements(achievements.map((a) => (a.id === saved.id ? saved : a)));
    } else {
      setAchievements([...achievements, saved]);
    }
  };

  return (
    <section id="achievements" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Education & Coursework Column */}
        <div className="lg:col-span-5 space-y-8">
          {/* Education */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-semibold tracking-wider uppercase">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Academic Foundation</span>
                </div>
                <h2 className="text-3xl font-extrabold text-white">
                  Education
                </h2>
              </div>

              {isEditMode && (
                <button
                  onClick={() => {
                    setEditingEdu(null);
                    setEduDrawerOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Degree</span>
                </button>
              )}
            </div>

            <div className="space-y-4">
              {visibleEducation.map((edu) => (
                <div
                  key={edu.id}
                  className="group relative rounded-2xl border border-white/10 bg-[#0c0d14]/80 backdrop-blur-xl p-6 hover:border-cyan-500/40 transition-all duration-300"
                >
                  <div className="flex items-center justify-between text-xs font-mono text-cyan-400 mb-2">
                    <span>{edu.period}</span>
                    {edu.note && (
                      <span className="px-2.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-semibold">
                        {edu.note}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    {edu.school}
                  </h3>
                  <p className="text-sm text-gray-300">
                    {edu.degree}
                  </p>

                  {/* Admin controls for Education & CGPA */}
                  {isEditMode && (
                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingEdu(edu);
                          setEduDrawerOpen(true);
                        }}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/20 transition-colors cursor-pointer"
                        title="Edit education & CGPA"
                      >
                        <Pencil className="w-3 h-3" />
                        <span>Edit CGPA / Details</span>
                      </button>
                      <button
                        onClick={() => handleDeleteEdu(edu.id)}
                        className="p-1 rounded text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete education record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Coursework Block */}
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-xs font-semibold tracking-wider uppercase">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Curriculum</span>
              </div>
              <h2 className="text-2xl font-extrabold text-white">
                Relevant Coursework
              </h2>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0c0d14]/80 backdrop-blur-xl p-6 space-y-3 hover:border-purple-500/30 transition-all duration-300">
              <p className="text-xs text-gray-400 mb-2">
                Core computer science and intelligence systems coursework completed at RGIPT:
              </p>
              <div className="flex flex-wrap gap-2">
                {defaultCoursework.map((course, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono bg-white/[0.04] border border-white/10 text-gray-300 hover:text-white hover:border-cyan-500/40 hover:bg-cyan-500/10 transition-colors"
                  >
                    {course}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Achievements Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 text-xs font-semibold tracking-wider uppercase">
                <Trophy className="w-3.5 h-3.5" />
                <span>Milestones</span>
              </div>
              <h2 className="text-3xl font-extrabold text-white">
                Honors & Achievements
              </h2>
            </div>

            {isEditMode && (
              <button
                onClick={() => {
                  setEditingAch(null);
                  setAchDrawerOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Achievement</span>
              </button>
            )}
          </div>

            <div className="space-y-4">
              {visibleAchievements.map((ach) => (
                <div
                  key={ach.id}
                  className="group flex items-start justify-between gap-3.5 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-colors"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400 shrink-0 mt-0.5">
                      <Award className="w-4 h-4" />
                    </div>
                    <p className="text-sm sm:text-base text-gray-200 leading-snug">
                      {ach.text}
                    </p>
                  </div>

                  {isEditMode && (
                    <div className="flex items-center gap-1 shrink-0 bg-white/5 border border-white/10 rounded-lg p-1">
                      <button
                        onClick={() => {
                          setEditingAch(ach);
                          setAchDrawerOpen(true);
                        }}
                        className="p-1 rounded text-gray-400 hover:text-yellow-400 transition-colors cursor-pointer"
                        title="Edit achievement"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteAch(ach.id)}
                        className="p-1 rounded text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete achievement"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
        </div>
      </div>

      <AchievementDrawerForm
        isOpen={achDrawerOpen}
        onClose={() => setAchDrawerOpen(false)}
        achievement={editingAch}
        onSaved={handleSavedAch}
      />

      <EducationDrawerForm
        isOpen={eduDrawerOpen}
        onClose={() => setEduDrawerOpen(false)}
        education={editingEdu}
        onSaved={handleSavedEdu}
      />
    </section>
  );
}
