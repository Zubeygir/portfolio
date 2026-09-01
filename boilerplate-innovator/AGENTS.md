# Boilerplate Innovator — AI Coding Agent Guidelines

Welcome to the **Boilerplate Innovator** project. When making changes or building a new client site on this repository, you must adhere strictly to these guidelines to maintain the integrity of the boilerplate architecture.

## 1. Architectural Philosophy

This repository is a **Reusable Client Website Starter Kit**. It consists of two distinct layers:
1. **Core Infrastructure (`/shared`, `/core`):** Highly reusable components, settings, and utilities that apply to almost *any* website (e.g., SEO, Site Settings, Base UI, Header/Footer wrappers).
2. **Site-Specific Implementation (`/sections`, `/site`):** The actual content models and visual layout for the specific client (e.g., Projects, Services, Doctors, Vehicles). 

Currently, the repository ships with a "Creative Studio" demo implementation. Your primary job in a new project is to replace this demo implementation without breaking the core infrastructure.

## 2. Directory Rules

- **`components/ui/`**: Contains base UI primitives (shadcn). **Do not modify these unless explicitly requested.**
- **`components/shared/`**: Components used across all projects (Header, Footer, SanityImage).
- **`components/sections/`**: Client-specific sections (Hero, Projects, Contact). **You will modify/replace these.**
- **`sanity/schemas/core/`**: Shared schemas (SiteSettings). **Do not remove these.**
- **`sanity/schemas/site/`**: Client-specific schemas. **You will replace these.**
- **`styles/sections/`**: Client-specific CSS. **You will replace these.**

## 3. TypeScript Type Safety

- **No `any` or `any[]`**.
- Define all CMS models in `lib/types.ts`.
- Prefer manual types that accurately reflect the Sanity schema over complex auto-generated setups unless the project scales significantly.

## 4. Sanity Fallback Behavior

Sanity configuration is **optional**. The site must continue to work using fallback local data (JSON files in `/messages/`) if `NEXT_PUBLIC_SANITY_PROJECT_ID` is not provided. 
- Use the `validateEnv()` helper in `lib/env.ts`.
- Do not add `!` (non-null assertions) to Sanity environment variables.
- The `SanityImage` component must gracefully return `null` if the builder cannot be initialized.

## 5. CSS & Styling

- Keep `globals.css` clean. It should only contain Tailwind imports, CSS variables (design tokens), base reset, and core layout elements (`.shell`, typography).
- Keep component-specific styles either in the component file (via Tailwind utility classes) or in dedicated `.css` files under `styles/sections/` imported into `globals.css`.
- Maintain the current aesthetic quality. Avoid generic styling.

## 6. Execution Protocol

1. **Understand before coding**: Check `lib/site.config.ts`, `lib/types.ts`, and `app/[locale]/layout.tsx` to understand the setup.
2. **Isolate Changes**: When building a new page or section, put the models in `sanity/schemas/site/` and components in `components/sections/`.
3. **Keep it Production Ready**: Ensure accessibility (aria attributes), responsive design, and SEO metadata are always implemented.
