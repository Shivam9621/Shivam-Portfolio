"use client";

import { useState, useEffect } from "react";
import { Experience, ExperienceSchema } from "../portfolio/schema";
import { X, Briefcase, AlertCircle, Save, Loader2, Plus, Trash2 } from "lucide-react";

interface ExperienceDrawerFormProps {
  isOpen: boolean;
  onClose: () => void;
  experience?: Experience | null;
  onSaved: (exp: Experience) => void;
}

export function ExperienceDrawerForm({
  isOpen,
  onClose,
  experience,
  onSaved,
}: ExperienceDrawerFormProps) {
  const isEditing = Boolean(experience?.id);

  const [formData, setFormData] = useState({
    company: "",
    role: "",
    team: "",
    location: "",
    start: "2025-06",
    end: "2025-08",
    bullets: [""] as string[],
    visible: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (experience) {
      setFormData({
        company: experience.company || "",
        role: experience.role || "",
        team: experience.team || "",
        location: experience.location || "",
        start: experience.start || "",
        end: experience.end || "",
        bullets: experience.bullets && experience.bullets.length > 0 ? experience.bullets : [""],
        visible: experience.visible !== false,
      });
      setErrors({});
    } else {
      setFormData({
        company: "",
        role: "",
        team: "",
        location: "",
        start: "2025-06",
        end: "2025-08",
        bullets: [""],
        visible: true,
      });
      setErrors({});
    }
  }, [experience, isOpen]);

  if (!isOpen) return null;

  const handleBulletChange = (index: number, val: string) => {
    const updated = [...formData.bullets];
    updated[index] = val;
    setFormData({ ...formData, bullets: updated });
  };

  const addBullet = () => {
    if (formData.bullets.length < 8) {
      setFormData({ ...formData, bullets: [...formData.bullets, ""] });
    }
  };

  const removeBullet = (index: number) => {
    if (formData.bullets.length > 1) {
      setFormData({
        ...formData,
        bullets: formData.bullets.filter((_, idx) => idx !== index),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);

    const cleanBullets = formData.bullets.map((b) => b.trim()).filter(Boolean);

    const payload = {
      ...(experience?.id ? { id: experience.id } : {}),
      company: formData.company.trim(),
      role: formData.role.trim(),
      team: formData.team.trim() || undefined,
      location: formData.location.trim() || undefined,
      start: formData.start.trim(),
      end: formData.end.trim(),
      bullets: cleanBullets,
      visible: formData.visible,
      order: experience?.order ?? 99,
    };

    const parsed = ExperienceSchema.safeParse(payload);
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
        ? `/api/admin/experience/${experience!.id}`
        : "/api/admin/experience";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save experience");
      }

      onSaved(data.experience || payload);
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

      <div className="relative w-full max-w-lg bg-[#0e0f18] border-l border-white/10 p-6 sm:p-8 overflow-y-auto shadow-2xl flex flex-col justify-between z-10 text-gray-200">
        <div>
          <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-cyan-400" />
                <span>{isEditing ? "Edit Experience" : "Add Experience"}</span>
              </h2>
              <p className="text-xs text-gray-400 mt-1 font-mono">
                {isEditing ? `Modifying role at ${experience?.company}` : "Record a work position or internship"}
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

          <form id="exp-form" onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-gray-300 font-semibold mb-1">
                Role Title *
              </label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g. AI Engineer Intern"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none text-white text-sm"
              />
              {errors.role && <p className="text-red-400 text-[11px] mt-1">{errors.role}</p>}
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">
                Company Name *
              </label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g. Siemens EDA (Siemens Digital Industries Software)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none text-white text-sm"
              />
              {errors.company && <p className="text-red-400 text-[11px] mt-1">{errors.company}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  Team
                </label>
                <input
                  type="text"
                  value={formData.team}
                  onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                  placeholder="e.g. Catapult R&D"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Noida"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none text-white text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  Start Date *
                </label>
                <input
                  type="text"
                  required
                  value={formData.start}
                  onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                  placeholder="2025-06"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  End Date *
                </label>
                <input
                  type="text"
                  required
                  value={formData.end}
                  onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                  placeholder="2025-08"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none text-white text-xs"
                />
              </div>
            </div>

            {/* Bullets List */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <label className="block text-gray-300 font-semibold">
                  Contribution Bullets ({formData.bullets.length}/8) *
                </label>
                {formData.bullets.length < 8 && (
                  <button
                    type="button"
                    onClick={addBullet}
                    className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Bullet</span>
                  </button>
                )}
              </div>

              {formData.bullets.map((bullet, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <textarea
                    rows={2}
                    required
                    value={bullet}
                    onChange={(e) => handleBulletChange(idx, e.target.value)}
                    placeholder={`Bullet #${idx + 1}...`}
                    className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none text-white text-xs leading-relaxed"
                  />
                  {formData.bullets.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeBullet(idx)}
                      className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-white/5"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              {errors.bullets && <p className="text-red-400 text-[11px] mt-1">{errors.bullets}</p>}
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/10">
              <div>
                <span className="text-white font-medium block">Public Visibility</span>
                <span className="text-gray-400 text-[11px]">Show on public portfolio</span>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, visible: !formData.visible })}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  formData.visible ? "bg-cyan-500" : "bg-neutral-800"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    formData.visible ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
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
            form="exp-form"
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
                <span>{isEditing ? "Save Changes" : "Create Experience"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
