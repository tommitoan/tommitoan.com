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

1. Start `pnpm dev`.
2. Open the homepage.
3. Edit the file you care about.
4. Save the file and check the browser.
5. Run `pnpm lint` and `pnpm typecheck` before finishing.

## What to edit for common tasks

### Change homepage sticker positions

Edit `src/content/home-scene.ts`.

### Change homepage popup text

Edit `homeNotes` inside `src/content/home-scene.ts`.

### Change Discover or Products content

Edit `src/content/site-content.ts`.

### Change SEO metadata

Edit:

- `src/app/layout.tsx`
- `src/lib/metadata.ts`

### Change images

Put new image assets in `public/`.

## Good habit for frontend changes

- move one sticker at a time
- refresh often and compare before/after
- test both desktop and mobile sizes
- avoid editing layout classes directly inside many components when one config file can control them

## Current homepage layout source of truth

For homepage sticker placement, treat `src/content/home-scene.ts` as the single source of truth.
