import { z } from "zod";

const envSchema = z.object({
  MONGODB_URI: z.string().optional(),
  NEXTAUTH_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().optional(),
  GITHUB_ID: z.string().optional(),
  GITHUB_SECRET: z.string().optional(),
  ADMIN_GITHUB_LOGIN: z.string().optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Environment validation error:", parsedEnv.error.format());
}

export const env = parsedEnv.success ? parsedEnv.data : process.env;
