# Project Overview

## Purpose

`tommitoan.com` is Toan Ngo's public personal website.

It has three jobs:

- give a memorable first impression
- route visitors to the right place quickly
- keep homepage content easy to edit without digging through many components

## Current routes

### `/`

Interactive sticker scene.

- center hero sticker opens the CV site
- surrounding stickers open short note cards
- decorative stickers add visual personality

Main files:

- `src/app/page.tsx`
- `src/components/home/hero-sticker.tsx`
- `src/content/home-scene.ts`

### `/discover`

Narrative route for background, homelab, experiments, and channels.

Main files:

- `src/app/discover/page.tsx`
- `src/content/site-content.ts`

### `/products`

Public product showcase and product lane overview.

Main files:

- `src/app/products/page.tsx`
- `src/content/site-content.ts`

## Where content lives

### `src/content/site-content.ts`

Use this for:

- metadata
- navigation
- discover page copy
- products page copy
- shared site text

### `src/content/home-scene.ts`

Use this for homepage scene editing:

- `heroStickerConfig` - center sticker size, link, and wrapper position
- `decorStickers` - non-clickable decorative stickers
- `interactiveStickers` - clickable character stickers and positions
- `homeNotes` - popup note content for each clickable sticker

## Asset locations

- sticker images: `public/sticker/`
- social preview: `public/social-card.svg`
- icon: `public/icon.svg`

## Rendering and deployment model

- framework: Next.js App Router
- output: static export
- config: `next.config.ts`
- output folder after build: `out/`

## Fast edit guide

- change homepage sticker position: `src/content/home-scene.ts`
- change homepage sticker animation behavior: `src/components/home/hero-sticker.tsx`
- change Discover or Products copy: `src/content/site-content.ts`
- change page metadata: `src/lib/metadata.ts` or `src/app/layout.tsx`
