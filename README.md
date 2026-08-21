# TAD AI Resource Hub

A curated field guide to robust AI tools, creative workflows, project ideas, and critical resources for students and faculty in Bemidji State University’s School of Technology, Art & Design.

Created and directed by **Eric Carlson**, with AI-assisted research, development, and implementation.

## Live site

[Open the TAD AI Resource Hub](https://theeray.github.io/tad-ai/)

## What it includes

- Searchable and filterable directory of creative AI resources
- **Verified**, **Emerging**, and **TAD-built** status labels
- Workflow maps for illustration, animation, 3D, audio, prototyping, research, and responsible practice
- External Tiki-Toki AI history timeline with 2D and 3D viewing options
- Project prompts and course learning resources
- Responsive layouts for desktop, tablet, and mobile
- TAD-derived visual identity, logo, and favicon

“Verified” identifies a high-quality, robust tool for its stated workflow. It is not blanket ethical or institutional endorsement. The directory was last curated in August 2026.

## Technology

- React 19
- Next.js 16 compatibility through Vinext
- Vite 8
- Cloudflare Worker-compatible deployment
- TypeScript and CSS

## Run locally

Requirements: Node.js 22.13 or newer on Linux.

```bash
npm ci
npm run dev
```

Create a production build with:

```bash
npm run build
```

## Project structure

- `app/page.tsx` — interface and interactions
- `app/resource-data.ts` — curated resources, workflows, projects, and learning links
- `app/globals.css` — visual system and responsive layouts
- `public/` — TAD logo, favicon, and social-preview assets

## Updating the directory

Review a tool’s current functionality, professional usefulness, terms, privacy, ownership, and limitations before changing its status. Keep summaries scoped to the workflow that was actually evaluated.
