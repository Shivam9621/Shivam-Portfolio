"use client";

import { useState, useEffect } from "react";
import { SkillGroup, SkillGroupSchema } from "../portfolio/schema";
import { X, Cpu, AlertCircle, Save, Loader2 } from "lucide-react";

interface SkillDrawerFormProps {
  isOpen: boolean;
  onClose: () => void;
  skill?: SkillGroup | null;
  onSaved: (skill: SkillGroup) => void;
}

export function SkillDrawerForm({
  isOpen,
  onClose,
  skill,
  onSaved,
}: SkillDrawerFormProps) {
  const isEditing = Boolean(skill?.id);

  const [formData, setFormData] = useState({
    group: "",
    itemsText: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (skill) {
      setFormData({
        group: skill.group || "",
        itemsText: (skill.items || []).join(", "),
      });
      setErrors({});
    } else {
      setFormData({
        group: "",
        itemsText: "",
      });
      setErrors({});
    }
  }, [skill, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);

    const items = formData.itemsText
      .split(/[,,\n]/)
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      ...(skill?.id ? { id: skill.id } : {}),
      group: formData.group.trim(),
      items,
    };

    const parsed = SkillGroupSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((err: any) => {
        const fieldName = err.path[0]?.toString() || "form";
        fieldErrors[fieldName] = err.message;
      });
      setErrors(fieldErrors);
      setSubmitting(false);
      return;
    }

    try {
      const endpoint = isEditing
        ? `/api/admin/skills/${skill!.id}`
        : "/api/admin/skills";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save skill group");
      }

      onSaved(data.skill || payload);
      onClose();
    } catch (err: any) {
      setErrors({ form: err.message || "An unexpected error occurred" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      <div className="relative w-full max-w-md bg-[#0e0f18] border-l border-white/10 p-6 sm:p-8 overflow-y-auto shadow-2xl flex flex-col justify-between z-10 text-gray-200">
        <div>
          <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-cyan-400" />
                <span>{isEditing ? "Edit Skill Group" : "Add Skill Group"}</span>
              </h2>
              <p className="text-xs text-gray-400 mt-1 font-mono">
                {isEditing ? `Modifying ${skill?.group}` : "Add a category of technologies"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {errors.form && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errors.form}</span>
            </div>
          )}

          <form id="skill-form" onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-gray-300 font-semibold mb-1">
                Category Name *
              </label>
              <input
                type="text"
                required
                value={formData.group}
                onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                placeholder="e.g. AI and ML, Cloud & DevOps"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none text-white text-sm"
              />
              {errors.group && <p className="text-red-400 text-[11px] mt-1">{errors.group}</p>}
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">
                Technologies / Skills (Comma-separated) *
              </label>
              <textarea
                required
                rows={5}
                value={formData.itemsText}
                onChange={(e) => setFormData({ ...formData, itemsText: e.target.value })}
                placeholder="Python, C++, LangChain, FastAPI, Docker, PyTorch"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none text-white text-xs leading-relaxed"
              />
              {errors.items && <p className="text-red-400 text-[11px] mt-1">{errors.items}</p>}
            </div>
          </form>
        </div>

        <div className="pt-6 border-t border-white/10 flex items-center justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-xs font-mono"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="skill-form"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs font-mono text-black bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all duration-300 disabled:opacity-50 cursor-pointer"
          >
            {submitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Category</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
