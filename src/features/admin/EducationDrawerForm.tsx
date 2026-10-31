"use client";

import { useState, useEffect } from "react";
import { Education, EducationSchema } from "../portfolio/schema";
import { X, GraduationCap, AlertCircle, Save, Loader2 } from "lucide-react";

interface EducationDrawerFormProps {
  isOpen: boolean;
  onClose: () => void;
  education?: Education | null;
  onSaved: (edu: Education) => void;
}

export function EducationDrawerForm({
  isOpen,
  onClose,
  education,
  onSaved,
}: EducationDrawerFormProps) {
  const isEditing = Boolean(education?.id);

  const [formData, setFormData] = useState({
    school: "",
    degree: "",
    period: "",
    note: "", // CGPA / Grades
    visible: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (education) {
      setFormData({
        school: education.school || "",
        degree: education.degree || "",
        period: education.period || "",
        note: education.note || "",
        visible: education.visible !== false,
      });
      setErrors({});
    } else {
      setFormData({
        school: "",
        degree: "",
        period: "2022 - 2027",
        note: "CGPA 8.0",
        visible: true,
      });
      setErrors({});
    }
  }, [education, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const payload = {
      id: education?.id || undefined,
      school: formData.school.trim(),
      degree: formData.degree.trim(),
      period: formData.period.trim(),
      note: formData.note.trim() || undefined,
      visible: formData.visible,
    };

    const parsed = isEditing
      ? EducationSchema.partial().safeParse(payload)
      : EducationSchema.safeParse(payload);

    if (!parsed.success) {
      const issueMap: Record<string, string> = {};
      parsed.error.issues.forEach((err) => {
        const path = err.path[0]?.toString() || "form";
        issueMap[path] = err.message;
      });
      setErrors(issueMap);
      return;
    }

    setSubmitting(true);
    try {
      const url = isEditing
        ? `/api/admin/education/${education?.id}`
        : `/api/admin/education`;
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        let msg = "Failed to save education";
        if (typeof data.error === "string") msg = data.error;
        else if (Array.isArray(data.error)) msg = data.error[0]?.message || msg;
        throw new Error(msg);
      }

      const resData = await res.json();
      const savedEdu: Education =
        resData.education || {
          school: payload.school,
          degree: payload.degree,
          period: payload.period,
          note: payload.note,
          visible: payload.visible,
          id: education?.id || `edu-${Date.now()}`,
        };

      onSaved(savedEdu);
      onClose();
    } catch (err: any) {
      setErrors({ form: err.message || "Failed to save education record." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-[#0c0d14] border-l border-white/10 h-full overflow-y-auto p-6 md:p-8 flex flex-col justify-between shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {isEditing ? "Edit Education & CGPA" : "Add Education Record"}
                </h2>
                <p className="text-xs text-gray-400">
                  Update degree, institution, timeline, and CGPA score
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {errors.form && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errors.form}</span>
            </div>
          )}

          <form id="edu-form" onSubmit={handleSubmit} className="space-y-4">
            {/* Institution / School */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-300">
                Institution / University <span className="text-cyan-400">*</span>
              </label>
              <input
                type="text"
                value={formData.school}
                onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                placeholder="e.g. RGIPT Bengaluru"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                required
              />
              {errors.school && <p className="text-xs text-red-400">{errors.school}</p>}
            </div>

            {/* Degree */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-300">
                Degree & Branch <span className="text-cyan-400">*</span>
              </label>
              <input
                type="text"
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                placeholder="e.g. Integrated Dual Degree B.Tech CSE + M.Tech AI"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                required
              />
              {errors.degree && <p className="text-xs text-red-400">{errors.degree}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Period */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-300">
                  Duration / Years <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                  placeholder="e.g. 2022 - 2027"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  required
                />
                {errors.period && <p className="text-xs text-red-400">{errors.period}</p>}
              </div>

              {/* CGPA / Grade (Prominent Field) */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-cyan-400 font-mono">
                  CGPA / Grade
                </label>
                <input
                  type="text"
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  placeholder="e.g. CGPA: 8.5 / 10"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cyan-500/5 border border-cyan-500/30 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono"
                />
                {errors.note && <p className="text-xs text-red-400">{errors.note}</p>}
              </div>
            </div>

            {/* Visibility Toggle */}
            <div className="pt-2">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.visible}
                  onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
                  className="w-4 h-4 rounded bg-white/5 border border-white/20 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-0"
                />
                <span className="text-xs text-gray-300">
                  Visible on public portfolio
                </span>
              </label>
            </div>
          </form>
        </div>

        <div className="pt-6 border-t border-white/10 flex items-center justify-end gap-3 mt-8">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 text-sm font-medium transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edu-form"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black text-sm font-semibold shadow-lg shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isEditing ? "Save CGPA & Details" : "Create Education"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
