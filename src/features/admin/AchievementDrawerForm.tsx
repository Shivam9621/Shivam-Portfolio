"use client";

import { useState, useEffect } from "react";
import { Achievement, AchievementSchema } from "../portfolio/schema";
import { X, Trophy, AlertCircle, Save, Loader2 } from "lucide-react";

interface AchievementDrawerFormProps {
  isOpen: boolean;
  onClose: () => void;
  achievement?: Achievement | null;
  onSaved: (ach: Achievement) => void;
}

export function AchievementDrawerForm({
  isOpen,
  onClose,
  achievement,
  onSaved,
}: AchievementDrawerFormProps) {
  const isEditing = Boolean(achievement?.id);

  const [formData, setFormData] = useState({
    text: "",
    visible: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (achievement) {
      setFormData({
        text: achievement.text || "",
        visible: achievement.visible !== false,
      });
      setErrors({});
    } else {
      setFormData({
        text: "",
        visible: true,
      });
      setErrors({});
    }
  }, [achievement, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);

    const payload = {
      ...(achievement?.id ? { id: achievement.id } : {}),
      text: formData.text.trim(),
      visible: formData.visible,
      order: achievement?.order ?? 99,
    };

    const parsed = AchievementSchema.safeParse(payload);
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
        ? `/api/admin/achievements/${achievement!.id}`
        : "/api/admin/achievements";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save achievement");
      }

      onSaved(data.achievement || payload);
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
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span>{isEditing ? "Edit Achievement" : "Add Achievement"}</span>
              </h2>
              <p className="text-xs text-gray-400 mt-1 font-mono">
                Record a milestone, contest rating or rank
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

          <form id="ach-form" onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-gray-300 font-semibold mb-1">
                Achievement Description *
              </label>
              <textarea
                required
                rows={4}
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                placeholder="e.g. Solved 400+ LeetCode problems (Rating 1660)..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-yellow-500 focus:outline-none text-white text-xs leading-relaxed"
              />
              {errors.text && <p className="text-red-400 text-[11px] mt-1">{errors.text}</p>}
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
            form="ach-form"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs font-mono text-black bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 shadow-[0_0_15px_rgba(234,179,8,0.3)] transition-all duration-300 disabled:opacity-50 cursor-pointer"
          >
            {submitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Achievement</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
