# Site Architecture

## Product goal

Build a public-first gateway that feels like entering a curated personal ecosystem instead of landing on a normal portfolio.

## Core experience

The homepage opens with 3 cinematic panels acting like portals:

1. `Portfolio`
2. `Discover`
3. `Products`

Expected behavior:

- `Portfolio` sends users to `https://toanngo.cv`
- `Discover` transitions deeper into the `tommitoan.com` story
- `Products` opens the public apps and tools hub

## Route map

### `/`

Purpose:

- establish identity quickly
- present the 3-way choice
- create a memorable first impression

Sections:

- brand intro
- 3-panel gateway
- short supporting line about what each path means

### `/discover`

Purpose:

- tell the broader personal story
- show what exists beyond the resume

Suggested sections:

- who I am now
- homelab and self-hosting overview
- what I run
- current experiments and playgrounds
- content channels
- selected showcase cards

### `/products`

Purpose:

- gather public-facing tools and active products

Suggested sections:

- featured products
- public tools
- upcoming products
- access notes for invite-only or limited tools

### Optional future routes

- `/now` - current focus, current builds, recent updates
- `/stack` - hardware, software, workflow, and homelab stack
- `/lab` - experiments and side projects
- `/blog` - writing platform when ready

## Primary user flows

### Recruiter flow

- land on `/`
- choose `Portfolio`
- jump to `toanngo.cv`

### Technical peer flow

- land on `/`
- choose `Discover`
- explore homelab, systems, content, experiments

### Product user flow

- land on `/`
- choose `Products`
- open Bazica or another live tool

## Information architecture principles

- homepage should route, not explain everything
- `Discover` is narrative and identity-driven
- `Products` is utility-driven
- CV content should stay mostly on `toanngo.cv`
- avoid duplicate long-form resume content on `tommitoan.com`

## SEO structure

- `tommitoan.com` targets brand, ecosystem, and discovery intent
- `toanngo.cv` targets name + resume + software engineer intent
- each route should have distinct metadata and social preview content

## Technical recommendation

Use a multi-page static-export capable framework for phase 1.

Recommended:

- Next.js static export in the new project

Reason:

- clean route structure for `/discover` and `/products`
- built-in metadata, sitemap, and robots support
- good donor patterns already exist in `/me/`

## Source material to reuse

- brand and visual tone from `/_tommitoan/toanngo.cv/`
- SEO and site scaffolding ideas from `/me/`
