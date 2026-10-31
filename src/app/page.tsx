import type { Metadata } from "next";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { getPortfolioData } from "@/features/portfolio/server/data";
import { getAdminSession } from "@/features/admin/session";
import { AdminEditProvider } from "@/features/admin/AdminEditContext";
import { TopBar } from "@/features/portfolio/components/TopBar";
import { Hero } from "@/features/portfolio/components/Hero";
import { ExperienceSection } from "@/features/portfolio/components/ExperienceSection";
import { ProjectsSection } from "@/features/portfolio/components/ProjectsSection";
import { SkillsSection } from "@/features/portfolio/components/SkillsSection";
import { EducationAchievementsSection } from "@/features/portfolio/components/EducationAchievementsSection";
import { ContactSection } from "@/features/portfolio/components/ContactSection";

// Dynamically import AdminBar only for verified admins (visitors never download this bundle)
const DynamicAdminBar = dynamic(() =>
  import("@/features/admin/AdminBar").then((mod) => mod.AdminBar)
);

async function AdminBarServer() {
  const session = await getAdminSession();
  if (!session?.isAdmin) return null;
  return (
    <DynamicAdminBar
      userLogin={session.user?.login || session.user?.name || undefined}
    />
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPortfolioData();
  const { profile } = data;

  return {
    title: `${profile.name} | AI/ML Engineer`,
    description: profile.headline,
    openGraph: {
      title: `${profile.name} | AI/ML Engineer`,
      description: profile.headline,
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${profile.name} | AI/ML Engineer`,
      description: profile.headline,
    },
  };
}

export default async function HomePage() {
  const data = await getPortfolioData();

  const { profile, links, projects, experience, education, skills, achievements, coursework } = data;

  const activeLinks = links
    .filter((l) => l.url && l.url.trim().length > 0 && !l.url.startsWith("mailto:"))
    .map((l) => l.url);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: "AI/ML Engineer",
    description: profile.headline,
    email: `mailto:${profile.email}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: profile.location || "Bengaluru",
      addressCountry: "India",
    },
    sameAs: activeLinks,
    knowsAbout: skills.flatMap((s) => s.items),
  };

  return (
    <AdminEditProvider>
      <div className="min-h-screen bg-[#050505] text-[#f4f4f5] selection:bg-cyan-500 selection:text-black">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <Suspense fallback={null}>
          <AdminBarServer />
        </Suspense>

        <div>
          <TopBar profile={profile} />
          <main className="relative z-10">
            <Hero profile={profile} links={links} />
            <ExperienceSection experience={experience} />
            <ProjectsSection projects={projects} />
            <SkillsSection skills={skills} />
            <EducationAchievementsSection
              education={education}
              achievements={achievements}
              coursework={coursework}
            />
            <ContactSection profile={profile} links={links} />
          </main>
        </div>
      </div>
    </AdminEditProvider>
  );
}
