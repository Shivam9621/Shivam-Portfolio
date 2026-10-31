import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXTAUTH_URL || "https://shivamjaiswal.dev";

  return [
    {
      url: siteUrl,
      lastModified: "2026-10-31",
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
