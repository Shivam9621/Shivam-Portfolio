import { z } from "zod";

const stringOrEmpty = z.string().optional().or(z.literal(""));

export const LinkSchema = z.object({
  id: z.string(),
  label: z.string().min(1),
  url: z.string().default(""),
  kind: z.enum(["github", "linkedin", "leetcode", "email", "other"]),
});
export type Link = z.infer<typeof LinkSchema>;

export const ProjectSchema = z.object({
  id: z.string(),
  slug: z.string().optional(),
  title: z.string().min(1, "Title is required").max(120),
  kind: z.enum(["featured", "standard"]).default("standard"),
  summary: z.string().max(2000).default(""),
  detail: z.string().max(5000).optional(),
  metrics: z.array(z.string()).default([]),
  stack: z.array(z.string()).default([]),
  repoUrl: stringOrEmpty,
  liveUrl: stringOrEmpty,
  imageUrl: stringOrEmpty,
  year: z.string().optional(),
  visible: z.boolean().default(true),
  order: z.number().default(999),
});
export type Project = z.infer<typeof ProjectSchema>;

export const ExperienceSchema = z.object({
  id: z.string(),
  company: z.string(),
  role: z.string(),
  team: z.string().optional(),
  location: z.string().optional(),
  start: z.string(),
  end: z.string(),
  bullets: z.array(z.string()).default([]),
  visible: z.boolean().default(true),
  order: z.number().default(999),
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
  items: z.array(z.string()).default([]),
});
export type SkillGroup = z.infer<typeof SkillGroupSchema>;

export const AchievementSchema = z.object({
  id: z.string(),
  text: z.string(),
  visible: z.boolean().default(true),
  order: z.number().default(999),
});
export type Achievement = z.infer<typeof AchievementSchema>;

export const ProfileSchema = z.object({
  name: z.string(),
  headline: z.string(),
  intro: z.string(),
  email: z.string(),
  location: z.string().optional(),
  avatarUrl: stringOrEmpty,
  resumeUrl: stringOrEmpty,
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
