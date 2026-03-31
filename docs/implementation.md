# Implementation

## App Structure

- `src/app/(gateway)/` homepage-only branch
- `src/app/(content)/` shared branch for scrollable content routes
- `src/app/layout.tsx` global metadata and fonts
- `src/app/(content)/layout.tsx` shared route shell and space background

## Content Ownership

- `src/components/gateway/gatewayHomeConfig.ts`
  Controls homepage scene configuration and portal data.
- `src/content/portfolio.ts`
  Controls the `Tech` route.
- `src/content/site-content.ts`
  Controls shared metadata, navigation, footer, and the `Discover` route.
- `src/content/fengshui-content.ts`
  Controls the `Feng Shui` route.

## Gateway Implementation

- `src/components/gateway/space-gateway-home.tsx`
  Composes the homepage scene and route transition behavior.
- `src/components/gateway/PlanetSphere.tsx`
  Renders the 3D planet and optional overlays/material variants.
- `src/components/canvas/SpaceBackgroundAstronaut.tsx`
  Renders the astronaut sprite and movement.
- `src/components/tech/StarsBackground.tsx`
  Renders the shared starfield used by the homepage and content layout.

## Shared Layout

- `src/components/layout/site-header.tsx`
- `src/components/layout/site-footer.tsx`
- `src/components/layout/page-shell.tsx`

## Public Assets

- `public/gateway/` homepage-only assets
- `public/profile/` profile assets
- `public/projects/` project previews
- `public/discover/` discover-route assets

## Build Model

- `next.config.ts` uses `output: "export"`
- build output goes to `out/`
- `pnpm start` serves `out/` for local preview
