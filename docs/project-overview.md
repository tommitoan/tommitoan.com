# Project Overview

## Purpose

`tommitoan.com` is Toan Ngo's public site and now works as a gateway into three internal worlds.

It has three jobs:

- give a strong first impression
- route visitors into the right world quickly
- keep route content editable through structured content files

## Current routes

### `/`

Fullscreen astronaut gateway.

- three windows: Tech, Discover, Fengshui
- clicking a window triggers a jump effect
- the selected route opens as an internal page

Main files:

- `src/app/(gateway)/page.tsx`
- `src/components/gateway/space-gateway-home.tsx`
- `src/components/gateway/space-window.tsx`
- `src/content/gateway-content.ts`

### `/tech`

Engineering and CV world.

- backend and platform summary
- skills, experience, projects, education, contact
- acts as the internal version of the CV route

Main files:

- `src/app/(content)/tech/page.tsx`
- `src/components/tech/tech-hero.tsx`
- `src/content/tech-content.ts`

### `/discover`

Narrative route for homelab, experiments, and channels.

Main files:

- `src/app/(content)/discover/page.tsx`
- `src/content/site-content.ts`

### `/fengshui`

Curated Bazica and Feng Shui route.

- explains why this lane exists
- links to Bazica demo and repository
- acts as a seed for future symbolic/product work

Main files:

- `src/app/(content)/fengshui/page.tsx`

## Route architecture

### `src/app/(gateway)`

Homepage-only fullscreen branch.

### `src/app/(content)`

Shared long-form branch for scrollable internal routes.

## Where content lives

### `src/content/site-content.ts`

Use this for:

- metadata
- navigation
- discover copy
- shared site text

### `src/content/gateway-content.ts`

Use this for:

- homepage window labels
- homepage window route targets
- small route descriptions for the gateway

### `src/content/tech-content.ts`

Use this for:

- tech route hero text
- skills
- experience
- projects
- education
- contact links

## Asset locations

- route visuals: `public/`
- social preview: `public/social-card.svg`

## Rendering and deployment model

- framework: Next.js App Router
- output: static export
- config: `next.config.ts`
- build output: `out/`

## Fast edit guide

- change homepage route labels and links: `src/content/gateway-content.ts`
- change homepage gateway visuals: `src/components/gateway/space-gateway-home.tsx` and `src/app/globals.css`
- change Tech copy: `src/content/tech-content.ts`
- change Discover copy: `src/content/site-content.ts`
- change page metadata: `src/lib/metadata.ts` or `src/app/layout.tsx`
