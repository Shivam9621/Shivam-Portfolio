import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "https://shivamjaiswal.dev"),
  title: "Shivam Jaiswal | AI/ML Engineer",
  description: "AI/ML Engineer building Multilingual NLP, Cross-lingual RAG, and Agentic Systems.",
  openGraph: {
    title: "Shivam Jaiswal | AI/ML Engineer",
    description: "AI/ML Engineer building Multilingual NLP, Cross-lingual RAG, and Agentic Systems.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark`}>
      <body className="min-h-screen bg-[#050505] text-[#f4f4f5] font-sans antialiased selection:bg-cyan-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
