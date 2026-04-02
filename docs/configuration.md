# Configuration

## Runtime

There are currently no required environment variables.

## Build Configuration

- `next.config.ts`
  - `output: "export"`
  - `trailingSlash: true`
  - `reactStrictMode: true`
  - `images.unoptimized: true`

## Metadata

- `src/app/layout.tsx` defines global metadata, Open Graph, Twitter, icons, and JSON-LD
- `src/lib/metadata.ts` builds per-route metadata
- `src/app/sitemap.ts`, `src/app/robots.ts`, and `src/app/manifest.ts` define static SEO outputs

## Content Configuration

- `src/content/site-content.ts`
- `src/content/portfolio.ts`
- `src/content/fengshui-content.ts`

## Gateway Configuration

Homepage scene settings live in `src/components/gateway/gatewayHomeConfig.ts`.

That file is the source of truth for:

- background asset and overlay gradients
- starfield variants
- route transition timing
- frame and row dimensions
- astronaut asset and motion
- portal labels, links, themes, effects, and planet settings

## Testing And Quality

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test:unit`
- `pnpm build`
