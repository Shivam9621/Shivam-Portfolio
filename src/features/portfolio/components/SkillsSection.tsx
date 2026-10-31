"use client";

import { useState, useEffect } from "react";
import { SkillGroup } from "../schema";
import { useAdminEdit } from "@/features/admin/AdminEditContext";
import { SkillDrawerForm } from "@/features/admin/SkillDrawerForm";
import { Cpu, Terminal, Layers, Brain, Wrench, Pencil, Trash2, Plus } from "lucide-react";

interface SkillsSectionProps {
  skills: SkillGroup[];
}

const groupIcons: Record<string, React.ReactNode> = {
  Languages: <Terminal className="w-5 h-5 text-cyan-400" />,
  "AI and ML": <Brain className="w-5 h-5 text-purple-400" />,
  Libraries: <Layers className="w-5 h-5 text-blue-400" />,
  Tools: <Wrench className="w-5 h-5 text-emerald-400" />,
  Fundamentals: <Cpu className="w-5 h-5 text-yellow-400" />,
};

export function SkillsSection({ skills: initialSkills }: SkillsSectionProps) {
  const { isEditMode } = useAdminEdit();
  const [skills, setSkills] = useState<SkillGroup[]>(initialSkills);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<SkillGroup | null>(null);

  useEffect(() => {
    setSkills(initialSkills);
  }, [initialSkills]);

  if (skills.length === 0 && !isEditMode) return null;

  const handleDelete = async (skillId: string) => {
    setSkills(skills.filter((s) => s.id !== skillId));
    try {
      await fetch(`/api/admin/skills/${skillId}`, { method: "DELETE" });
    } catch (err) {
      console.error("Failed to delete skill:", err);
    }
  };

  const handleSaved = (saved: SkillGroup) => {
    const exists = skills.some((s) => s.id === saved.id);
    if (exists) {
      setSkills(skills.map((s) => (s.id === saved.id ? saved : s)));
    } else {
      setSkills([...skills, saved]);
    }
  };

  return (
    <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center space-y-3 mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold tracking-wider uppercase">
          <Cpu className="w-3.5 h-3.5" />
          <span>Core Capabilities</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Skills & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400">Technologies</span>
        </h2>
        <p className="text-gray-400 max-w-lg mx-auto text-sm sm:text-base">
          A toolkit engineered for high-performance AI, distributed backends, and full-stack pipelines.
        </p>

        {isEditMode && (
          <div className="pt-2">
            <button
              onClick={() => {
                setEditingSkill(null);
                setDrawerOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold text-black bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all cursor-pointer font-mono"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Skill Category</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="group relative rounded-2xl border border-white/10 bg-[#0c0d14]/80 backdrop-blur-xl p-6 hover:border-cyan-500/40 hover:shadow-[0_0_25px_rgba(0,240,255,0.08)] transition-all duration-300"
          >
            {isEditMode && (
              <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg p-1">
                <button
                  onClick={() => {
                    setEditingSkill(skill);
                    setDrawerOpen(true);
                  }}
                  className="p-1 rounded text-gray-400 hover:text-cyan-300 transition-colors"
                  title="Edit category"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(skill.id)}
                  className="p-1 rounded text-gray-400 hover:text-red-400 transition-colors"
                  title="Delete category"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                {groupIcons[skill.group] || <Cpu className="w-5 h-5 text-cyan-400" />}
              </div>
              <h3 className="text-lg font-bold text-white">
                {skill.group}
              </h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {skill.items.map((item, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg text-xs font-mono bg-white/[0.04] border border-white/10 text-gray-300 hover:text-white hover:border-cyan-500/30 hover:bg-cyan-500/10 transition-colors"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <SkillDrawerForm
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        skill={editingSkill}
        onSaved={handleSaved}
      />
    </section>
  );
}
