import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXTAUTH_URL || "https://shivamjaiswal.dev";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
