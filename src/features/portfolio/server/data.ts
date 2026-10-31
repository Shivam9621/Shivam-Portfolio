import mongoose, { Schema } from "mongoose";
import { connectToDatabase } from "@/lib/db";
import {
  PortfolioData,
  PortfolioDataSchema,
  Project,
  Experience,
  SkillGroup,
  Education,
  Achievement,
  Profile,
  Link,
} from "../schema";
import { initialPortfolioData } from "./seed";

interface IPortfolioDoc {
  _id: string;
  data: PortfolioData;
}

const PortfolioDocSchema = new Schema<IPortfolioDoc>(
  {
    _id: { type: String, default: "main" },
    data: { type: Schema.Types.Mixed, required: true },
  },
  {
    timestamps: true,
  }
);

const PortfolioModel =
  mongoose.models.Portfolio ||
  mongoose.model<IPortfolioDoc>("Portfolio", PortfolioDocSchema);

let localPortfolioData: PortfolioData = JSON.parse(JSON.stringify(initialPortfolioData));

export async function getPortfolioData(): Promise<PortfolioData> {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return localPortfolioData;
    }

    const doc = await PortfolioModel.findById("main").lean<IPortfolioDoc | null>();
    if (!doc || !doc.data) {
      return localPortfolioData;
    }

    const parsed = PortfolioDataSchema.safeParse(doc.data);
    if (!parsed.success) {
      console.warn("Stored portfolio data failed validation, falling back to local:", parsed.error);
      return localPortfolioData;
    }

    return parsed.data;
  } catch (error) {
    console.warn("Failed to fetch portfolio data from DB, using fallback:", error);
    return localPortfolioData;
  }
}

export async function upsertPortfolioData(data: PortfolioData): Promise<PortfolioData> {
  const validated = PortfolioDataSchema.parse({
    ...data,
    updatedAt: new Date().toISOString(),
  });

  localPortfolioData = validated;

  const conn = await connectToDatabase();
  if (conn) {
    try {
      await PortfolioModel.findByIdAndUpdate(
        "main",
        {
          _id: "main",
          data: validated,
        },
        { upsert: true, new: true }
      );
    } catch (e) {
      console.warn("Could not save to MongoDB, kept in local memory:", e);
    }
  }

  return validated;
}

// PROFILE
export async function updateProfile(patch: Partial<Profile>): Promise<PortfolioData> {
  const current = await getPortfolioData();
  return upsertPortfolioData({
    ...current,
    profile: {
      ...current.profile,
      ...patch,
    },
  });
}

// PROJECTS
export async function addProject(project: Project): Promise<PortfolioData> {
  const current = await getPortfolioData();
  const maxOrder = current.projects.reduce((max, p) => Math.max(max, p.order || 0), 0);
  const newProject = {
    ...project,
    order: project.order ?? maxOrder + 1,
  };
  return upsertPortfolioData({
    ...current,
    projects: [...current.projects, newProject],
  });
}

export async function updateProject(id: string, patch: Partial<Project>): Promise<PortfolioData> {
  const current = await getPortfolioData();
  const updatedProjects = current.projects.map((p) => {
    if (p.id === id) {
      return { ...p, ...patch };
    }
    return p;
  });
  return upsertPortfolioData({
    ...current,
    projects: updatedProjects,
  });
}

export async function deleteProject(id: string): Promise<PortfolioData> {
  const current = await getPortfolioData();
  const filtered = current.projects.filter((p) => p.id !== id);
  return upsertPortfolioData({
    ...current,
    projects: filtered,
  });
}

export async function reorderProjects(orderedIds: string[]): Promise<PortfolioData> {
  const current = await getPortfolioData();
  const projectMap = new Map(current.projects.map((p) => [p.id, p]));
  const reordered: Project[] = [];

  orderedIds.forEach((id, index) => {
    const proj = projectMap.get(id);
    if (proj) {
      reordered.push({ ...proj, order: index + 1 });
      projectMap.delete(id);
    }
  });

  projectMap.forEach((proj) => {
    reordered.push({ ...proj, order: reordered.length + 1 });
  });

  return upsertPortfolioData({
    ...current,
    projects: reordered,
  });
}

// EXPERIENCE
export async function addExperience(exp: Experience): Promise<PortfolioData> {
  const current = await getPortfolioData();
  const maxOrder = current.experience.reduce((max, e) => Math.max(max, e.order || 0), 0);
  const newExp = {
    ...exp,
    order: exp.order ?? maxOrder + 1,
  };
  return upsertPortfolioData({
    ...current,
    experience: [...current.experience, newExp],
  });
}

export async function updateExperience(id: string, patch: Partial<Experience>): Promise<PortfolioData> {
  const current = await getPortfolioData();
  const updated = current.experience.map((e) => {
    if (e.id === id) {
      return { ...e, ...patch };
    }
    return e;
  });
  return upsertPortfolioData({
    ...current,
    experience: updated,
  });
}

export async function deleteExperience(id: string): Promise<PortfolioData> {
  const current = await getPortfolioData();
  return upsertPortfolioData({
    ...current,
    experience: current.experience.filter((e) => e.id !== id),
  });
}

// SKILLS
export async function addSkillGroup(group: SkillGroup): Promise<PortfolioData> {
  const current = await getPortfolioData();
  return upsertPortfolioData({
    ...current,
    skills: [...current.skills, group],
  });
}

export async function updateSkillGroup(id: string, patch: Partial<SkillGroup>): Promise<PortfolioData> {
  const current = await getPortfolioData();
  return upsertPortfolioData({
    ...current,
    skills: current.skills.map((s) => (s.id === id ? { ...s, ...patch } : s)),
  });
}

export async function deleteSkillGroup(id: string): Promise<PortfolioData> {
  const current = await getPortfolioData();
  return upsertPortfolioData({
    ...current,
    skills: current.skills.filter((s) => s.id !== id),
  });
}

// EDUCATION
export async function addEducation(edu: Education): Promise<PortfolioData> {
  const current = await getPortfolioData();
  return upsertPortfolioData({
    ...current,
    education: [...current.education, edu],
  });
}

export async function updateEducation(id: string, patch: Partial<Education>): Promise<PortfolioData> {
  const current = await getPortfolioData();
  return upsertPortfolioData({
    ...current,
    education: current.education.map((e) => (e.id === id ? { ...e, ...patch } : e)),
  });
}

export async function deleteEducation(id: string): Promise<PortfolioData> {
  const current = await getPortfolioData();
  return upsertPortfolioData({
    ...current,
    education: current.education.filter((e) => e.id !== id),
  });
}

// ACHIEVEMENTS
export async function addAchievement(ach: Achievement): Promise<PortfolioData> {
  const current = await getPortfolioData();
  return upsertPortfolioData({
    ...current,
    achievements: [...current.achievements, ach],
  });
}

export async function updateAchievement(id: string, patch: Partial<Achievement>): Promise<PortfolioData> {
  const current = await getPortfolioData();
  return upsertPortfolioData({
    ...current,
    achievements: current.achievements.map((a) => (a.id === id ? { ...a, ...patch } : a)),
  });
}

export async function deleteAchievement(id: string): Promise<PortfolioData> {
  const current = await getPortfolioData();
  return upsertPortfolioData({
    ...current,
    achievements: current.achievements.filter((a) => a.id !== id),
  });
}

// COURSEWORK
export async function updateCoursework(coursework: string[]): Promise<PortfolioData> {
  const current = await getPortfolioData();
  return upsertPortfolioData({
    ...current,
    coursework,
  });
}

// LINKS
export async function updateLinks(links: Link[]): Promise<PortfolioData> {
  const current = await getPortfolioData();
  return upsertPortfolioData({
    ...current,
    links,
  });
}
