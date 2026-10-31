"use client";

import { useState, useEffect } from "react";
import { Profile, ProfileSchema } from "../portfolio/schema";
import { X, User, AlertCircle, Save, Loader2 } from "lucide-react";

interface ProfileDrawerFormProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile;
  onSaved: (profile: Profile) => void;
}

export function ProfileDrawerForm({
  isOpen,
  onClose,
  profile,
  onSaved,
}: ProfileDrawerFormProps) {
  const [formData, setFormData] = useState({
    name: profile.name || "",
    headline: profile.headline || "",
    intro: profile.intro || "",
    email: profile.email || "",
    location: profile.location || "",
    resumeUrl: profile.resumeUrl || "",
    avatarUrl: profile.avatarUrl || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setFormData({
      name: profile.name || "",
      headline: profile.headline || "",
      intro: profile.intro || "",
      email: profile.email || "",
      location: profile.location || "",
      resumeUrl: profile.resumeUrl || "",
      avatarUrl: profile.avatarUrl || "",
    });
    setErrors({});
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);

    const payload = {
      name: formData.name.trim(),
      headline: formData.headline.trim(),
      intro: formData.intro.trim(),
      email: formData.email.trim(),
      location: formData.location.trim() || undefined,
      resumeUrl: formData.resumeUrl.trim() || undefined,
      avatarUrl: formData.avatarUrl.trim() || undefined,
    };

    const parsed = ProfileSchema.safeParse(payload);
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
      const res = await fetch("/api/admin/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      onSaved(data.profile || payload);
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
                <User className="w-5 h-5 text-cyan-400" />
                <span>Edit Profile & Hero</span>
              </h2>
              <p className="text-xs text-gray-400 mt-1 font-mono">
                Update headline, biography, location and contact details
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

          <form id="profile-form" onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-gray-300 font-semibold mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none text-white text-sm"
              />
              {errors.name && <p className="text-red-400 text-[11px] mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">
                Headline / Role *
              </label>
              <input
                type="text"
                required
                value={formData.headline}
                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none text-white text-sm"
              />
              {errors.headline && <p className="text-red-400 text-[11px] mt-1">{errors.headline}</p>}
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">
                Bio / Introduction *
              </label>
              <textarea
                required
                rows={4}
                value={formData.intro}
                onChange={(e) => setFormData({ ...formData, intro: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none text-white text-xs leading-relaxed"
              />
              {errors.intro && <p className="text-red-400 text-[11px] mt-1">{errors.intro}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none text-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">
                Resume / CV URL
              </label>
              <input
                type="url"
                value={formData.resumeUrl}
                onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                placeholder="https://drive.google.com/..."
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">
                Avatar Image Path / URL
              </label>
              <input
                type="text"
                value={formData.avatarUrl}
                onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                placeholder="/shivam.jpg"
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none text-white text-xs"
              />
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
            form="profile-form"
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
                <span>Save Profile</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
