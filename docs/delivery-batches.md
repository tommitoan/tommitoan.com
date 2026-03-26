# Delivery Batches

## Purpose

This plan breaks implementation into small OpenCode-friendly batches so each build session can stay focused and avoid bloated context.

## Batch rules

- complete one batch at a time
- keep each batch independently reviewable
- do not combine major design, content, and deployment work in one session
- after each batch, update docs if the architecture changed

## Batch 1 - Foundation

### Goal

Create the app skeleton and shared foundations.

### Scope

- scaffold Next.js project
- configure `pnpm`
- set static export behavior
- add route skeletons for `/`, `/discover`, `/products`
- create base layout, metadata, sitemap, robots
- create typed content source
- create initial design tokens and global styles

### Output

- app boots locally
- routes compile
- content model exists
- metadata base points to `https://tommitoan.com`

### Stop point

No polished page design yet. Just the stable foundation.

## Batch 2 - Homepage Gateway

### Goal

Build the core identity and 3-panel portal experience.

### Scope

- homepage hero
- 3 gateway panels
- `Portfolio` external link
- `Discover` and `Products` internal navigation
- motion, hover, focus, and reduced-motion behavior
- mobile adaptation for the panel system

### Output

- homepage feels distinctive and shippable on its own

### Stop point

No deep `Discover` or `Products` sections yet.

## Batch 3 - Discover

### Goal

Build the narrative page behind the gateway.

### Scope

- intro and current identity
- homelab overview
- self-hosting story
- selected experiments and playgrounds
- social/content channel section

### Output

- `Discover` feels personal, technical, and alive

### Stop point

Do not add blog engine or large article system.

## Batch 4 - Products

### Goal

Build the public product hub.

### Scope

- product card system
- status badges
- Bazica featured card
- placeholders for future products where appropriate
- clear public/private boundary in product copy

### Output

- `Products` can support current and future tools cleanly

### Stop point

Do not wire private or sensitive internal tools into public navigation.

## Batch 5 - Polish and SEO

### Goal

Make the site launch-ready.

### Scope

- route metadata refinement
- OG image strategy or placeholders
- favicon and social assets
- responsive polish
- accessibility pass
- performance pass

### Output

- launch-ready frontend build

## Batch 6 - Deployment and rollout

### Goal

Prepare for production launch.

### Scope

- build verification
- deployment choice finalization
- domain checklist
- CI baseline if needed
- deployment docs update

### Output

- site is ready to publish

## Suggested OpenCode session flow

### Session A

- Batch 1 only

### Session B

- Batch 2 only

### Session C

- Batch 3 only

### Session D

- Batch 4 only

### Session E

- Batch 5 and Batch 6 if the app is already stable

## Handoff note for future sessions

At the start of each implementation session, reference:

- `docs/README.md`
- `docs/business-strategy.md`
- `docs/technical-direction.md`
- `docs/implementation-plan.md`
- this file
