# Portfolio Build Plan: Shivam Jaiswal

## 1. Goal

A personal portfolio at one URL modeled after **[Resfolio](https://github.com/AbhivirSingh/Resfolio)** ([live demo](https://abhivir.vercel.app/)) where:

- Visitors experience a dark, futuristic, high-impact AI/ML engineer portfolio.
- I log in once and the same page becomes editable in place. I can add, edit, hide, delete, and reorder projects, experience, achievements, and links without touching code.
- Content lives in MongoDB Atlas, with fallback to local seed data.

---

## 2. Architecture & Design Direction

### 2.1 Aesthetic & Visual Direction (Resfolio Inspired)
- **Palette:** Deep pitch-black background (`#050505`), glassmorphic dark cards (`#0c0d14` with `rgba(255,255,255,0.1)` borders), and ambient radial glowing blur orbs (electric cyan `#00f0ff` and neon purple `#a855f7`).
- **Typography:** English only (no Hindi glyphs), clean modern tech sans (`Geist`) and monospace (`Geist Mono`).
- **Hero:**
  - Status badge: `AVAILABLE FOR OPPORTUNITIES` with live pulsating green radar dot.
  - Big headline: `Hi, I'm Shivam Jaiswal` with gradient text (`from-cyan-400 via-blue-500 to-purple-500`).
  - Interactive terminal card (`shivam.profile.ts`) displaying role, Siemens EDA experience, and technical specializations.
- **Experience:** High-impact timeline cards highlighting Siemens EDA (Catapult R&D), dates, locations, team tags, and bulleted achievements.
- **Projects:** Modern grid with interactive category filters, featured status badges, RAGAS metrics, tech tags, and direct GitHub / Live demo buttons.
- **Skills:** Categorized dark glass cards with domain icons (Languages, AI & ML, Libraries, Tools, Fundamentals).
- **Achievements & Education:** Dual-column layout showcasing RGIPT Bengaluru dual degree alongside GATE 2026 CS, IIT-JEE Top 1%, and Hackathon awards.
- **Contact:** Central "Let's Build Something Remarkable Together" card with quick email action, copy-to-clipboard, and external networks.

### 2.2 Stack
- Next.js (App Router) + TypeScript + Tailwind CSS
- MongoDB Atlas + Mongoose (with instant fallback to `seed.ts`)
- NextAuth (Auth.js) with GitHub OAuth allowlist (`ADMIN_GITHUB_LOGIN`)
- Zod (shared schemas)
- @dnd-kit/sortable (reordering in admin mode)

---

## 3. Data Model (`schema.ts`)
Shared Zod schema across forms, DAL, and MongoDB.

---

## 4. Build Phases

- [x] **Phase 1: Foundation.** Next.js setup, Zod schemas, MongoDB connection with seed fallback, unstyled data verification.
- [x] **Phase 2: Resfolio Public Design.** Deep dark theme, ambient glows, terminal card, interactive project cards, skills grid, achievements, and contact section.
- [x] **Phase 3: Auth.** NextAuth with GitHub, allowlist via `ADMIN_GITHUB_LOGIN`, `requireAdmin()`, middleware for `/api/admin/*`, sign-in page, admin bar.
- [x] **Phase 4: Project CRUD.** Inline editing for projects: drawer form, edit, hide, delete with confirm, drag-and-drop reordering.
- [x] **Phase 5: Remaining Sections CRUD.** Editing for experience, skills, education, achievements, links, and profile text.
- [ ] **Phase 6: Hardening & Launch.** Rate limiting, security headers, backup export, and Vercel deployment.
