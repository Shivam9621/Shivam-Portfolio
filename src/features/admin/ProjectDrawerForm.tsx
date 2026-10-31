"use client";

import { useState, useEffect } from "react";
import { Project, ProjectSchema } from "../portfolio/schema";
import { X, Sparkles, AlertCircle, Save, Loader2 } from "lucide-react";

interface ProjectDrawerFormProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project | null;
  onSaved: (project: Project) => void;
}

export function ProjectDrawerForm({
  isOpen,
  onClose,
  project,
  onSaved,
}: ProjectDrawerFormProps) {
  const isEditing = Boolean(project?.id);

  const [formData, setFormData] = useState({
    title: "",
    kind: "standard" as "featured" | "standard",
    year: "2025",
    summary: "",
    detail: "",
    metricsText: "",
    stackText: "",
    repoUrl: "",
    liveUrl: "",
    visible: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || "",
        kind: project.kind || "standard",
        year: project.year || "",
        summary: project.summary || "",
        detail: project.detail || "",
        metricsText: (project.metrics || []).join("\n"),
        stackText: (project.stack || []).join(", "),
        repoUrl: project.repoUrl || "",
        liveUrl: project.liveUrl || "",
        visible: project.visible !== false,
      });
      setErrors({});
    } else {
      setFormData({
        title: "",
        kind: "standard",
        year: "2025",
        summary: "",
        detail: "",
        metricsText: "",
        stackText: "",
        repoUrl: "",
        liveUrl: "",
        visible: true,
      });
      setErrors({});
    }
  }, [project, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);

    const metrics = formData.metricsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const stack = formData.stackText
      .split(/[,,\n]/)
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      id: project?.id || `proj-${Date.now()}`,
      title: formData.title.trim(),
      kind: formData.kind,
      year: formData.year.trim() || undefined,
      summary: formData.summary.trim(),
      detail: formData.detail.trim() || undefined,
      metrics,
      stack,
      repoUrl: formData.repoUrl.trim() || undefined,
      liveUrl: formData.liveUrl.trim() || undefined,
      visible: formData.visible,
      order: project?.order ?? 999,
      slug: project?.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    };

    // Client-side Zod validation
    const parsed = ProjectSchema.safeParse(payload);
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
        ? `/api/admin/projects/${project!.id}`
        : "/api/admin/projects";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save project");
      }

      onSaved(data.project || payload);
      onClose();
    } catch (err: any) {
      setErrors({ form: err.message || "An unexpected error occurred" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-lg bg-[#0e0f18] border-l border-white/10 p-6 sm:p-8 overflow-y-auto shadow-2xl flex flex-col justify-between z-10 text-gray-200">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <span>{isEditing ? "Edit Project" : "Add New Project"}</span>
              </h2>
              <p className="text-xs text-gray-400 mt-1 font-mono">
                {isEditing ? `Modifying ${project?.title}` : "Create and publish a system card"}
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

          {/* Form */}
          <form id="project-form" onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
            {/* Title */}
            <div>
              <label className="block text-gray-300 font-semibold mb-1">
                Project Title *
              </label>
              <input
                type="text"
                required
                maxLength={80}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Cross-lingual RAG Chatbot"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none text-white text-sm"
              />
              {errors.title && <p className="text-red-400 text-[11px] mt-1">{errors.title}</p>}
            </div>

            {/* Kind & Year */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  Card Tier
                </label>
                <select
                  value={formData.kind}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      kind: e.target.value as "featured" | "standard",
                    })
                  }
                  className="w-full px-3 py-2.5 rounded-xl bg-[#141520] border border-white/10 focus:border-cyan-500 focus:outline-none text-white text-xs"
                >
                  <option value="standard">Standard Row</option>
                  <option value="featured">Featured (Detailed)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  Year
                </label>
                <input
                  type="text"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  placeholder="2025"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none text-white text-xs"
                />
              </div>
            </div>

            {/* Summary */}
            <div>
              <label className="block text-gray-300 font-semibold mb-1">
                Summary (1-2 sentences) *
              </label>
              <textarea
                required
                maxLength={400}
                rows={3}
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder="What it does and what you built..."
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none text-white text-xs leading-relaxed"
              />
              {errors.summary && <p className="text-red-400 text-[11px] mt-1">{errors.summary}</p>}
            </div>

            {/* Detail (featured) */}
            <div>
              <label className="block text-gray-300 font-semibold mb-1">
                Technical Detail (Architectural highlights)
              </label>
              <textarea
                maxLength={1200}
                rows={3}
                value={formData.detail}
                onChange={(e) => setFormData({ ...formData, detail: e.target.value })}
                placeholder="How it works under the hood, key decisions..."
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none text-white text-xs leading-relaxed"
              />
            </div>

            {/* Metrics */}
            <div>
              <label className="block text-gray-300 font-semibold mb-1">
                Metrics (1 per line, max 4)
              </label>
              <textarea
                rows={2}
                value={formData.metricsText}
                onChange={(e) => setFormData({ ...formData, metricsText: e.target.value })}
                placeholder="0.95+ faithfulness (RAGAS)&#10;44 tests, 90% coverage"
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none text-white text-xs"
              />
            </div>

            {/* Tech Stack */}
            <div>
              <label className="block text-gray-300 font-semibold mb-1">
                Tech Stack (Comma-separated)
              </label>
              <input
                type="text"
                value={formData.stackText}
                onChange={(e) => setFormData({ ...formData, stackText: e.target.value })}
                placeholder="FastAPI, ChromaDB, LangChain, Docker"
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none text-white text-xs"
              />
            </div>

            {/* Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  GitHub Repo URL
                </label>
                <input
                  type="url"
                  value={formData.repoUrl}
                  onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
                  placeholder="https://github.com/Shivam9621/..."
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  Live Demo URL
                </label>
                <input
                  type="url"
                  value={formData.liveUrl}
                  onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none text-white text-xs"
                />
              </div>
            </div>

            {/* Visibility Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/10">
              <div>
                <span className="text-white font-medium block">Public Visibility</span>
                <span className="text-gray-400 text-[11px]">Show on live portfolio</span>
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

        {/* Footer actions */}
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
            form="project-form"
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
                <span>{isEditing ? "Save Changes" : "Create Project"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
