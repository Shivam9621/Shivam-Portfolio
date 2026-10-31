"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Project } from "../schema";
import { GithubIcon } from "./Icons";
import {
  ExternalLink,
  Sparkles,
  GripVertical,
  Pencil,
  Eye,
  EyeOff,
  Trash2,
} from "lucide-react";

interface SortableProjectCardProps {
  project: Project;
  isEditMode: boolean;
  onEdit: (project: Project) => void;
  onToggleVisible: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export function SortableProjectCard({
  project,
  isEditMode,
  onEdit,
  onToggleVisible,
  onDelete,
}: SortableProjectCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id, disabled: !isEditMode });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : "auto",
  };

  const isHidden = project.visible === false;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-2xl border bg-[#0c0d14]/90 backdrop-blur-xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 ${
        isHidden
          ? "border-yellow-500/30 opacity-70 bg-[#12110c]/80"
          : project.kind === "featured"
          ? "border-white/15 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(0,240,255,0.12)]"
          : "border-white/10 hover:border-white/25 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]"
      }`}
    >
      {/* Admin Controls Toolbar (Visible when in Edit Mode) */}
      {isEditMode && (
        <div className="mb-4 pb-3 border-b border-white/15 flex items-center justify-between bg-white/[0.03] -mx-6 -mt-6 p-3 px-6 rounded-t-2xl">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1.5 rounded-lg text-gray-400 hover:text-cyan-400 hover:bg-white/5 transition-colors"
            title="Drag to reorder"
          >
            <GripVertical className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onToggleVisible(project)}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                isHidden
                  ? "text-yellow-400 bg-yellow-500/10 hover:bg-yellow-500/20"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
              title={isHidden ? "Hidden from visitors (Click to show)" : "Visible (Click to hide)"}
            >
              {isHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>

            <button
              onClick={() => onEdit(project)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors"
              title="Edit project details"
            >
              <Pencil className="w-4 h-4" />
            </button>

            <button
              onClick={() => onDelete(project)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Delete project"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div>
        {/* Card Top */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {project.kind === "featured" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-cyan-500/30 text-cyan-300 uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                Featured
              </span>
            )}
            {isHidden && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 uppercase">
                Hidden
              </span>
            )}
            {project.year && (
              <span className="text-xs font-mono text-gray-500">
                {project.year}
              </span>
            )}
          </div>

          {/* Direct Action Icons */}
          <div className="flex items-center gap-2">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/10 transition-colors"
                aria-label="View Source Code"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-colors"
                aria-label="View Live Project"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Title & Summary */}
        <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors mb-2">
          {project.title}
        </h3>

        <p className="text-gray-300 text-sm leading-relaxed mb-4">
          {project.summary}
        </p>

        {/* Detailed description if featured */}
        {project.detail && (
          <div className="p-3 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-gray-400 leading-relaxed mb-4">
            {project.detail}
          </div>
        )}

        {/* Metrics Badge */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {project.metrics.map((metric, idx) => (
              <span
                key={idx}
                className="inline-block px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
              >
                ✓ {metric}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Tech Stack & Links */}
      <div className="pt-4 border-t border-white/10">
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.stack.map((tech, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/5 border border-white/10 text-gray-300"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-300 hover:text-white transition-colors"
            >
              <GithubIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span>Source Code</span>
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:underline transition-colors ml-auto"
            >
              <span>Live Demo</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
