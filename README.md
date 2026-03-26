# tommitoan.com

Public-first personal brand gateway for Toan Ngo.

This project is the canonical entry point for the `tommitoan` ecosystem:

- `tommitoan.com` - brand gateway
- `toanngo.cv` - recruiter-focused CV and resume site
- `*.tommitoan.space` - selected tools, products, and self-hosted services

The planning documents for this project live in `docs/`.

## Stack

- Next.js 16 App Router
- TypeScript 5
- Tailwind CSS v4
- Framer Motion
- pnpm

## Current status

Batch 1 foundation is scaffolded:

- static-export setup is in place
- routes exist for `/`, `/discover`, and `/products`
- metadata, sitemap, and robots are wired
- typed site content lives in `src/content/site-content.ts`

Batch 2 homepage gateway is now implemented:

- cinematic 3-panel homepage experience is live
- `Portfolio`, `Discover`, and `Products` each have distinct route cues
- responsive behavior and reduced-motion-safe transitions are in place

Batch 3 discover route is now implemented:

- `/discover` now tells the broader narrative behind the brand
- homelab architecture is featured with a diagram and deployment flow
- self-hosted service layers, experiments, and social channels are mapped

Batch 4 products route is now implemented:

- `/products` now has a featured product hero for Bazica
- supporting product cards, status logic, and product lanes are mapped
- the public/private product boundary is made explicit in the page content

Batch 5 launch polish is now implemented:

- social preview metadata now points to `public/social-card.svg`
- canonical metadata, manifest, and richer route metadata are wired
- skip link, keyboard focus states, and active navigation state are in place

Homepage redesign pass is now in progress:

- `/` now follows a stronger command-deck composition instead of the earlier card stack
- the homepage hero includes a system-stage visual and routing-focused CTA layer
- gateway panels now have differentiated hierarchy, tone, and destination identity

## Local development

```bash
pnpm install
pnpm dev
pnpm lint
pnpm typecheck
pnpm build
```

## Docs

- `docs/README.md`
- `docs/business-strategy.md`
- `docs/brand-ecosystem.md`
- `docs/site-architecture.md`
- `docs/content-strategy.md`
- `docs/design-direction.md`
- `docs/technical-direction.md`
- `docs/implementation-plan.md`
- `docs/delivery-batches.md`
- `docs/deployment-strategy.md`
- `docs/opencode-build-prompt.md`
