# Development Guide

## Setup

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Useful commands

```bash
pnpm dev
pnpm lint
pnpm typecheck
pnpm build
```

## Everyday workflow

1. Start `pnpm dev`
2. Open the route you want to change
3. Edit the matching content file, component, or CSS
4. Save and review the result
5. Run `pnpm lint` and `pnpm typecheck`

## What to edit for common tasks

### Change homepage window labels or route targets

Edit `src/content/gateway-content.ts`.

### Change homepage scene visuals

Edit:

- `src/components/gateway/space-gateway-home.tsx`
- `src/components/gateway/space-window.tsx`
- `src/app/globals.css`

### Change Tech route copy

Edit `src/content/tech-content.ts`.

### Change Discover route copy

Edit `src/content/site-content.ts`.

### Change Fengshui route copy

Edit `src/app/(content)/fengshui/page.tsx` or move more text into a dedicated content file later.

### Change SEO metadata

Edit:

- `src/app/layout.tsx`
- `src/lib/metadata.ts`

### Change images

Put new images in `public/`.

## Good habits for this project

- keep route text in content files when possible
- keep visual tuning in components and CSS
- check both fullscreen homepage and long-scroll routes
- test both desktop and mobile

## Current homepage source of truth

For the homepage gateway, treat `src/content/gateway-content.ts` as the source of truth for route intent and labels.
