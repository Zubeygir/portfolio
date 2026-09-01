# Boilerplate Innovator

A production-ready, reusable Next.js + Sanity starter kit designed for rapidly developing modern client websites across various industries (clinics, law firms, agencies, SaaS, etc.).

## 🚀 Core Features

- **Next.js 16 (App Router)** & **React 19**
- **Sanity CMS** integration (fully optional, works with local JSON fallback)
- **Tailwind CSS 4** + **shadcn/ui** (base-ui primitives)
- **i18n** via `next-intl` (English & Turkish out of the box)
- **TypeScript** strict mode with generated types
- **SEO & Metadata** dynamic generation with `sitemap.xml`, `robots.txt` and JSON-LD schema
- **Environment Validation** fails gracefully without crashing

## 🏗️ Architecture: Core vs. Site-Specific

This boilerplate separates the **reusable core** from the **client-specific implementation**:

- **Core (Keep these)**: 
  - `components/ui/` (shadcn primitives)
  - `components/shared/` (Header, Footer, SanityImage, LocaleSwitcher)
  - `sanity/schemas/core/` (SiteSettings)
  - `lib/types.ts` & `lib/site.config.ts`
- **Site-Specific (Replace for each project)**: 
  - `components/sections/` (Hero, Projects, Services, etc.)
  - `sanity/schemas/site/` (Project, Service, Process schemas)
  - `app/[locale]/page.tsx`
  - `styles/sections/`

*The repository currently includes a "Creative Studio" theme as an example implementation. You should replace these site-specific files for your own client projects.*

## 🛠️ Quick Start

```bash
# 1. Clone repository
git clone https://github.com/your-username/boilerplate-innovator.git my-client-site
cd my-client-site

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env.local
# (Optional) Add Sanity project ID to use the CMS

# 4. Run development server
npm run dev
```

## 📜 Available Scripts

- `npm run dev`: Starts Next.js development server
- `npm run build`: Builds the application for production
- `npm run start`: Starts production server
- `npm run lint`: Runs oxlint for lightning-fast linting
- `npm run format`: Runs oxfmt for code formatting
- `npm run typecheck`: Validates TypeScript without emitting files
- `npm run check`: Runs typecheck and linting together
