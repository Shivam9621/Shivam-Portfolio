"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { Project } from "../schema";
import { SortableProjectCard } from "./SortableProjectCard";
import { ProjectDrawerForm } from "@/features/admin/ProjectDrawerForm";
import { useAdminEdit } from "@/features/admin/AdminEditContext";
import { FolderGit2, Plus, AlertTriangle } from "lucide-react";

interface ProjectsSectionProps {
  projects: Project[];
}

export function ProjectsSection({ projects: initialProjects }: ProjectsSectionProps) {
  const { isEditMode } = useAdminEdit();
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [filter, setFilter] = useState<"all" | "featured" | "standard">("all");

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Delete modal state
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Filter logic: in edit mode, show all (including hidden); in public mode, hide visible: false
  const displayedProjects = projects
    .filter((p) => isEditMode || p.visible !== false)
    .filter((p) => {
      if (filter === "all") return true;
      return p.kind === filter;
    })
    .sort((a, b) => a.order - b.order);

  // Drag & drop reorder
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = projects.findIndex((p) => p.id === active.id);
    const newIndex = projects.findIndex((p) => p.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const reordered = arrayMove(projects, oldIndex, newIndex).map((p, idx) => ({
        ...p,
        order: idx + 1,
      }));

      // Optimistic update
      setProjects(reordered);

      // Persist to API
      try {
        await fetch("/api/admin/reorder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            section: "projects",
            orderedIds: reordered.map((p) => p.id),
          }),
        });
      } catch (err) {
        console.error("Failed to persist project reordering:", err);
      }
    }
  };

  // Toggle Visibility
  const handleToggleVisible = async (proj: Project) => {
    const newVisibility = proj.visible === false;
    const updated = projects.map((p) =>
      p.id === proj.id ? { ...p, visible: newVisibility } : p
    );
    setProjects(updated);

    try {
      await fetch(`/api/admin/projects/${proj.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visible: newVisibility }),
      });
    } catch (err) {
      console.error("Failed to update visibility:", err);
    }
  };

  // Delete project
  const confirmDelete = async () => {
    if (!deletingProject) return;
    const projId = deletingProject.id;
    setProjects(projects.filter((p) => p.id !== projId));
    setDeletingProject(null);

    try {
      await fetch(`/api/admin/projects/${projId}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Failed to delete project:", err);
    }
  };

  // Saved callback from drawer
  const handleProjectSaved = (savedProject: Project) => {
    const exists = projects.some((p) => p.id === savedProject.id);
    if (exists) {
      setProjects(projects.map((p) => (p.id === savedProject.id ? savedProject : p)));
    } else {
      setProjects([...projects, savedProject]);
    }
  };

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center space-y-3 mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-xs font-semibold tracking-wider uppercase">
          <FolderGit2 className="w-3.5 h-3.5" />
          <span>Technical Portfolio</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-500 to-cyan-400">Projects</span>
        </h2>
        <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
          Production systems, cross-lingual NLP pipelines, and distributed architectures.
        </p>

        {/* Filter Tabs & Edit Mode Indicator */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          {(["all", "featured", "standard"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-all duration-300 ${
                filter === tab
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                  : "bg-white/5 text-gray-400 hover:text-white border border-white/10"
              }`}
            >
              {tab === "all" ? "All Systems" : tab}
            </button>
          ))}

          {isEditMode && (
            <button
              onClick={() => {
                setEditingProject(null);
                setDrawerOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold text-black bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Project</span>
            </button>
          )}
        </div>
      </div>

      {/* Projects Grid with Drag and Drop */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={displayedProjects.map((p) => p.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {displayedProjects.map((project) => (
              <SortableProjectCard
                key={project.id}
                project={project}
                isEditMode={isEditMode}
                onEdit={(proj) => {
                  setEditingProject(proj);
                  setDrawerOpen(true);
                }}
                onToggleVisible={handleToggleVisible}
                onDelete={(proj) => setDeletingProject(proj)}
              />
            ))}

            {/* Dashed Add Project Card (Visible when in Edit Mode) */}
            {isEditMode && (
              <button
                onClick={() => {
                  setEditingProject(null);
                  setDrawerOpen(true);
                }}
                className="rounded-2xl border-2 border-dashed border-cyan-500/30 hover:border-cyan-400 bg-cyan-950/10 hover:bg-cyan-950/20 p-8 flex flex-col items-center justify-center gap-3 transition-all duration-300 min-h-[280px] group cursor-pointer"
              >
                <div className="p-3 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 group-hover:scale-110 transition-transform">
                  <Plus className="w-6 h-6" />
                </div>
                <div className="text-center font-mono">
                  <span className="text-sm font-bold text-white block group-hover:text-cyan-300">
                    Add New Project
                  </span>
                  <span className="text-xs text-gray-400 block mt-1">
                    Opens drawer form to publish new system
                  </span>
                </div>
              </button>
            )}
          </div>
        </SortableContext>
      </DndContext>

      {/* Side Drawer Form */}
      <ProjectDrawerForm
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        project={editingProject}
        onSaved={handleProjectSaved}
      />

      {/* Delete Confirmation Modal */}
      {deletingProject && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div
            onClick={() => setDeletingProject(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0e0f18] p-6 shadow-2xl space-y-5 text-gray-200">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Delete Project</h3>
                <p className="text-xs text-gray-400 leading-relaxed font-mono">
                  Are you sure you want to permanently delete{" "}
                  <strong className="text-white">&quot;{deletingProject.title}&quot;</strong>? You can also hide it instead of deleting.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2 text-xs font-mono">
              <button
                onClick={() => {
                  handleToggleVisible(deletingProject);
                  setDeletingProject(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                Hide Instead
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 hover:bg-red-500/30 transition-colors font-semibold cursor-pointer"
              >
                Permanently Delete
              </button>
              <button
                onClick={() => setDeletingProject(null)}
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
