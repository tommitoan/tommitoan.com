# tommitoan.com

Personal website for Toan Ngo, built as a static Next.js space gateway with three routes: `Tech`, `Discover`, and `Feng Shui`.

## Routes

- `/` gateway homepage with 3 interactive portals
- `/tech` engineering profile and CV route
- `/discover` homelab, experiments, and public channels
- `/fengshui` Bazica and symbolic-product route

## Repo Structure

- `src/app/` route entry points, layouts, metadata, sitemap, robots, manifest
- `src/components/gateway/` homepage scene, planet renderer, and gateway config
- `src/components/tech/` tech route sections and shared motion helpers
- `src/components/layout/` shared header, footer, and page shell
- `src/content/` route copy and structured content
- `src/lib/` metadata and small utilities
- `public/gateway/` homepage background, astronaut, and planet textures
- `public/profile/` profile imagery
- `public/projects/` project previews
- `public/discover/` discover-route imagery

## Current Docs

- `docs/README.md`
- `docs/features.md`
- `docs/implementation.md`
- `docs/configuration.md`
- `docs/gateway-config.md`
- `docs/run-guide.md`
- `docs/notes.md`

## Commands

```bash
pnpm install
pnpm dev
pnpm lint
pnpm typecheck
pnpm test:unit
pnpm build
pnpm start
```

## Main Files

- `src/app/(gateway)/page.tsx`
- `src/components/gateway/space-gateway-home.tsx`
- `src/components/gateway/gatewayHomeConfig.ts`
- `src/components/gateway/PlanetSphere.tsx`
- `src/components/canvas/SpaceBackgroundAstronaut.tsx`
- `src/app/(content)/tech/page.tsx`
- `src/app/(content)/discover/page.tsx`
- `src/app/(content)/fengshui/page.tsx`

## Gateway Source Of Truth

Homepage scene configuration lives in `src/components/gateway/gatewayHomeConfig.ts`.

That file controls:

- shared background and starfield settings
- portal labels, routes, themes, and effects
- frame size and row spacing
- planet textures, size, hover motion, and alignment
- astronaut asset, placement, idle motion, and warp motion
- selection timing, zoom, and flash behavior

## Notes

- The app uses static export via `next.config.ts`.
- There are currently no environment variables required for local development.
- Canonical contact email is `tommitoan1995@gmail.com`.
