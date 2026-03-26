# Implementation Plan

## Goal

Create a new project in `tommiteam/tommitoan.com/` for a public-first brand gateway on `tommitoan.com`.

## Key decisions already made

- brand mode: public-first
- gateway panels: `Portfolio`, `Discover`, `Products`
- canonical domain: `tommitoan.com`
- recruiter satellite: `toanngo.cv`
- private tools on the homepage: no

## Companion docs

- `business-strategy.md` for audience and positioning
- `technical-direction.md` for framework and stack decisions
- `delivery-batches.md` for small execution slices

## Recommended technical base

Build a fresh Next.js static-export site and selectively port the best ideas from existing repos.

### Reuse from `/_tommitoan/toanngo.cv/`

- brand tone
- content quality
- premium motion style
- strong project and homelab storytelling
- visual primitives and atmosphere

### Reuse from `/me/`

- metadata structure
- sitemap and robots support
- static export setup
- deployment and CI patterns

## Why not clone either repo directly

- `toanngo.cv` is visually stronger but built as a lean SPA centered on CV content
- `me` already has route structure but has more placeholder pages and generic styling debt
- a fresh app with selective reuse gives a cleaner long-term base

## Phase breakdown

This is the strategic phase map. For implementation-sized chunks, use `delivery-batches.md`.

### Phase 1 - Project bootstrap

- scaffold project structure
- choose font system and design tokens
- set metadata base to `https://tommitoan.com`
- create route structure for `/`, `/discover`, `/products`
- create single source of truth for content

### Phase 2 - Gateway homepage

- build landing section
- implement 3-panel gateway interaction
- wire `Portfolio` to external `toanngo.cv`
- wire `Discover` and `Products` to internal routes
- tune transitions and reduced-motion fallback

### Phase 3 - Discover page

- build sections for intro, homelab, self-hosting, channels, playgrounds
- add visual proof with diagrams or screenshots where available
- keep copy concise and curated

### Phase 4 - Products page

- build product grid or hub layout
- add status labels
- include public links only
- support future planned items without fake detail

### Phase 5 - SEO and polish

- metadata per route
- sitemap and robots
- OG image strategy
- favicon and social previews
- accessible navigation and keyboard states

### Phase 6 - Deployment preparation

- static export check
- build verification
- deployment doc update
- prepare domain and ingress decision

## Suggested project structure

```text
tommiteam/tommitoan.com/
├── docs/
├── public/
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── discover/
│   │   └── products/
│   ├── components/
│   │   ├── gateway/
│   │   ├── layout/
│   │   ├── sections/
│   │   └── ui/
│   ├── content/
│   │   └── site-content.ts
│   └── lib/
└── package.json
```

## Delivery priorities

### Must-have for first build

- branded homepage
- 3-panel gateway interaction
- Discover page
- Products page
- metadata and sitemap
- mobile-ready responsive layout

### Nice-to-have if time allows

- richer transition overlays
- animated diagrams
- polished OG image generation
- status badges and filters on products page

### Later

- blog
- now page
- auth-gated private area
- CMS or MDX content pipeline

## Risks

- scope creep from trying to expose too many services
- copying too much resume content into the gateway
- overbuilding motion before content is solid

## Implementation decision summary

- public-first: yes
- canonical domain: `tommitoan.com`
- recruiter satellite: `toanngo.cv`
- public tool hub: yes
- third panel label: `Products`
- private tools on homepage: no
