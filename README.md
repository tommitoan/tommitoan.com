# tommitoan.com

Personal website for Toan Ngo, built with Next.js as a space gateway with three internal worlds: `Tech`, `Discover`, and `Fengshui`.

## What is in this repo

- `/` is a fullscreen 3D astronaut gateway with 3 interactive portal windows, built with React Three Fiber and Framer Motion
- `/tech` is the internal engineering and CV route
- `/discover` is the broader story: homelab, experiments, and channels
- `/fengshui` is the curated Bazica and Feng Shui product lane
- `src/content/site-content.ts` holds shared site metadata and route copy
- `src/content/space-gateway-content.ts` controls homepage portal labels, colors, and destinations
- `src/content/tech-content.ts` controls the internal Tech route

## Stack

- Next.js 16 App Router
- React 19
- TypeScript 5
- Tailwind CSS v4
- Framer Motion
- React Three Fiber / Drei (for 3D astronaut and starfield)
- pnpm

## Local development

```bash
pnpm install
pnpm dev
pnpm lint
pnpm typecheck
pnpm build
```

## Key files

- `src/app/(gateway)/page.tsx` - homepage route
- `src/components/gateway/space-gateway-home.tsx` - the layered R3F + Framer Motion 3D gateway scene
- `src/components/canvas/StarsBackground.tsx` - mathematical drifting starfield
- `src/components/canvas/SpaceBackgroundAstronaut.tsx` - procedural floating 2D astronaut
- `src/app/(content)/tech/page.tsx` - Tech route
- `src/app/(content)/discover/page.tsx` - Discover route
- `src/app/(content)/fengshui/page.tsx` - Fengshui route

## Adjust the homepage gateway

If you want to change the homepage routes, labels, colors, or gradients, edit `src/content/space-gateway-content.ts`.

If you want to change the 3D layout, physics, or visuals, edit:

- `src/components/gateway/space-gateway-home.tsx`
- `src/components/canvas/spaceBackgroundConfig.ts`
- `src/components/canvas/SpaceBackgroundAstronaut.tsx`

More beginner-friendly guidance is in `docs/gateway-scene-guide.md`.

## Docs

- `docs/README.md` - docs index
- `docs/project-overview.md` - current route map and content ownership
- `docs/development-guide.md` - run, build, and edit workflow
- `docs/gateway-scene-guide.md` - how to tune the homepage gateway scene

Older planning docs are still kept in `docs/` for reference.
