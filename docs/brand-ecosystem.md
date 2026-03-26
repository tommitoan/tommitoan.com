# Brand Ecosystem

## Goal

Define a clean ecosystem so every domain has one job.

## Canonical structure

- `tommitoan.com` - primary brand gateway
- `toanngo.cv` - CV, resume, recruiter-facing professional profile
- `*.tommitoan.space` - tools, self-hosted services, internal utilities, experiments
- future `blog.tommitoan.com` or `lab.tommitoan.com` - optional content/product satellites if the main site becomes too dense

## Role of each property

### `tommitoan.com`

This is the main front door.

It should answer:

- who is Tommi Toan
- what does he build
- what can visitors explore
- which public products are live
- where should different audiences go next

Primary audiences:

- recruiters
- peers in engineering
- potential collaborators
- friends and general visitors
- users discovering public tools or experiments

### `toanngo.cv`

This remains the sharper professional profile.

It should stay focused on:

- experience
- skills
- certifications
- projects as evidence
- resume download
- contact information

This property should not become the main ecosystem hub.

### `*.tommitoan.space`

This layer is for services, tools, homelab surfaces, and selected experiments.

Observed examples from current infra include:

- `mytools.tommitoan.space`
- `memos.tommitoan.space`
- `notes.tommitoan.space`
- `files.tommitoan.space`
- `identity.tommitoan.space`

Not every service here should be promoted publicly.

## Public vs private boundary

### Public-safe to feature

- Bazica
- blog platform when ready
- homelab architecture showcase
- selected playgrounds and demos
- content channels like YouTube, TikTok, Facebook
- carefully chosen public tools

### Public-safe with caution

- company-adjacent tools only if there is no policy or privacy risk
- self-hosted services only if they are intentionally public and presentable

### Keep off the public homepage

- personal dashboards
- admin surfaces
- file managers
- internal notes and memos
- observability and infrastructure endpoints
- anything that feels unfinished, sensitive, or only useful to you

## Naming recommendation

For the 3 gateway panels:

- `Portfolio`
- `Discover`
- `Products`

Why `Products` over `Services`:

- `Services` sounds like consulting or freelance offerings
- your third area is closer to live tools, apps, and experiments
- `Products` is clearer for public visitors

If you later want to sell engineering help, add a separate section or page named `Work With Me`.

## Brand statement

Suggested positioning:

`tommitoan.com` is the public gateway to Toan Ngo's work across software engineering, cloud infrastructure, self-hosting, creative experiments, and personal tools.

## Non-goals for phase 1

- no private dashboard experience
- no login-dependent homepage
- no attempt to expose every running service
- no bloated all-in-one portal
