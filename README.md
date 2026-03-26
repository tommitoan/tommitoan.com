# tommitoan.com

Personal website for Toan Ngo, built with Next.js as a static-exported portfolio and product gateway.

## What is in this repo

- `/` is a sticker-based interactive landing page.
- `/discover` explains the wider story: homelab, experiments, and channels.
- `/products` lists public-facing tools and product directions.
- `src/content/site-content.ts` holds most text and route content.
- `src/content/home-scene.ts` holds homepage sticker positions, note content, and sticker asset config.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript 5
- Tailwind CSS v4
- Framer Motion
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

- `src/app/page.tsx` - homepage scene renderer
- `src/components/home/hero-sticker.tsx` - center sticker animation and CV link
- `src/content/home-scene.ts` - editable sticker layout config
- `src/content/site-content.ts` - typed content for the rest of the site
- `src/app/discover/page.tsx` - Discover route
- `src/app/products/page.tsx` - Products route
- `next.config.ts` - static export config

## Adjust sticker positions

If a sticker looks too high, too low, too far left, or too far right, edit `src/content/home-scene.ts`.

Example:

```ts
{
  id: "backend",
  className:
    "absolute top-[25%] right-[8%] z-10 group drop-shadow-lg transition-transform duration-300 hover:scale-110 hover:-rotate-3",
}
```

Useful class changes:

- move up: lower `top-[25%]` to something like `top-[20%]`
- move down: increase `top-[25%]` to `top-[30%]`
- move left: increase `right-[8%]` or lower `left-[45%]`
- move right: lower `right-[8%]` or increase `left-[45%]`
- resize: change `width` and `height`

More beginner-friendly guidance is in `docs/sticker-positioning-guide.md`.

## Docs

- `docs/README.md` - docs index
- `docs/project-overview.md` - current project map
- `docs/development-guide.md` - run, build, and edit workflow
- `docs/sticker-positioning-guide.md` - how to move homepage stickers safely

Legacy planning docs are still kept in `docs/` for reference.
