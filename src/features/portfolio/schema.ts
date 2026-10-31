import { z } from "zod";

const urlOrEmpty = z.string().url().or(z.literal("")).optional();

export const LinkSchema = z.object({
  id: z.string(),
  label: z.string().min(1),
  url: z.string().url().or(z.literal("")),
  kind: z.enum(["github", "linkedin", "leetcode", "email", "other"]),
});
export type Link = z.infer<typeof LinkSchema>;

export const ProjectSchema = z.object({
  id: z.string(), // nanoid
  slug: z.string(),
  title: z.string().min(1).max(80),
  kind: z.enum(["featured", "standard"]),
  summary: z.string().max(400), // 1-2 sentences, what it does
  detail: z.string().max(1200).optional(), // how it works / result
  metrics: z.array(z.string()).max(4), // e.g. "0.95+ faithfulness (RAGAS)"
  stack: z.array(z.string()).max(10),
  repoUrl: urlOrEmpty,
  liveUrl: urlOrEmpty,
  imageUrl: urlOrEmpty,
  year: z.string().optional(),
  visible: z.boolean().default(true), // hide without deleting
  order: z.number(),
});
export type Project = z.infer<typeof ProjectSchema>;

export const ExperienceSchema = z.object({
  id: z.string(),
  company: z.string(),
  role: z.string(),
  team: z.string().optional(),
  location: z.string().optional(),
  start: z.string(),
  end: z.string(), // "2025-06", "2025-08"
  bullets: z.array(z.string()).max(8),
  visible: z.boolean().default(true),
  order: z.number(),
});
export type Experience = z.infer<typeof ExperienceSchema>;

export const EducationSchema = z.object({
  id: z.string(),
  school: z.string(),
  degree: z.string(),
  period: z.string(),
  note: z.string().optional(),
  visible: z.boolean().default(true),
  order: z.number().optional(),
});
export type Education = z.infer<typeof EducationSchema>;

export const SkillGroupSchema = z.object({
  id: z.string(),
  group: z.string(),
  items: z.array(z.string()),
});
export type SkillGroup = z.infer<typeof SkillGroupSchema>;

export const AchievementSchema = z.object({
  id: z.string(),
  text: z.string(),
  visible: z.boolean().default(true),
  order: z.number(),
});
export type Achievement = z.infer<typeof AchievementSchema>;

export const ProfileSchema = z.object({
  name: z.string(),
  headline: z.string(),
  intro: z.string(),
  email: z.string().email(),
  location: z.string().optional(),
  avatarUrl: urlOrEmpty,
  resumeUrl: urlOrEmpty,
});
export type Profile = z.infer<typeof ProfileSchema>;

export const PortfolioDataSchema = z.object({
  profile: ProfileSchema,
  links: z.array(LinkSchema),
  projects: z.array(ProjectSchema),
  experience: z.array(ExperienceSchema),
  education: z.array(EducationSchema),
  skills: z.array(SkillGroupSchema),
  achievements: z.array(AchievementSchema),
  coursework: z.array(z.string()).default([]),
  updatedAt: z.string(),
});
export type PortfolioData = z.infer<typeof PortfolioDataSchema>;
