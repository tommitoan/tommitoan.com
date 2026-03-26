# Technical Direction

## Technical goal

Build a premium public-first brand site that is easy to extend, SEO-friendly, and deployable either on a static host or your homelab.

## Framework options

| Option | Pros | Cons | Verdict |
|------|------|------|---------|
| Next.js static export | strong routing, metadata, sitemap, reuse from `/me/`, React ecosystem, easy multi-page structure | more framework weight than a very simple site | Recommended |
| Astro | excellent for content sites, very performant, nice hybrid model | weaker direct reuse from existing repos, more migration effort for current React-heavy donor assets | Good alternative, not first choice |
| Vite React SPA | simple, lightweight, easy reuse from `toanngo.cv` | weaker out-of-box SEO and route metadata story, less ideal for brand gateway with multiple pages | Not recommended for this project |

## Recommended stack

- framework: Next.js 16 App Router
- rendering mode: static export
- language: TypeScript 5
- package manager: `pnpm`
- styling: Tailwind CSS v4
- animation: Framer Motion
- icons: `lucide-react`
- content source: typed local content file in `src/content/`
- deployment target: static output first, homelab-compatible

## Why this stack

### Why Next.js

- best fit for `/`, `/discover`, and `/products`
- route-level metadata is built in
- sitemap and robots support already exists in `/me/`
- easy future growth into blog, lab, now page, or auth areas

### Why static export

- no server required for phase 1
- easy deploy to Vercel, Cloudflare Pages, Netlify, or Nginx
- can still be containerized and served from k3s later

### Why `pnpm`

- already used in the newer `toanngo.cv` project
- fast installs and efficient workspace behavior
- good default for a fresh frontend app in this workspace

## Design-system recommendation

Do not start with a heavy component library.

Recommended:

- build bespoke layout and gateway components
- keep a very small UI primitive layer
- use utility classes plus a few custom tokens and helper classes

Avoid:

- pulling in a large generic UI system too early
- letting shadcn-like defaults define the look of the site

## Motion and graphics recommendation

### Phase 1

- CSS gradients and layered backgrounds
- Framer Motion for panel transitions and reveals
- no mandatory 3D scene

### Phase 2 or later

- selective canvas or Three.js element if it clearly improves the gateway experience
- only introduce it after the core design works without it

Reason:

- `toanngo.cv` shows strong visual taste, but its hero/orbit system is complex
- phase 1 should prioritize strong architecture and shippable polish over expensive visual engineering

## Recommended project structure

```text
src/
├── app/
│   ├── page.tsx
│   ├── discover/page.tsx
│   ├── products/page.tsx
│   ├── layout.tsx
│   ├── robots.ts
│   └── sitemap.ts
├── components/
│   ├── gateway/
│   ├── layout/
│   ├── sections/
│   └── ui/
├── content/
│   └── site-content.ts
├── lib/
│   ├── metadata.ts
│   └── utils.ts
└── styles/
```

## Content model recommendation

Keep phase 1 content local and typed.

Recommended objects:

- `siteMeta`
- `gatewayPanels`
- `discover`
- `products`
- `socialChannels`
- `footer`

Later upgrades:

- MDX for blog and long-form content
- headless CMS only if content editing becomes frequent

## Asset strategy

- reuse screenshots and diagrams from `toanngo.cv` where appropriate
- keep brand assets in `public/`
- generate or design route-specific social preview images later

## Build and verification baseline

Recommended commands for the new app:

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
```

## Technical risks

- overengineering motion before layout and content are stable
- importing too much complex code from donor repos
- choosing a component system that makes the site look generic
- adding 3D too early and hurting performance or delivery speed

## Final recommendation

Use a fresh `Next.js + TypeScript + Tailwind + Framer Motion` app, statically exported, with bespoke UI and a typed local content model.
