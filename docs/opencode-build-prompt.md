# OpenCode Build Prompt

Use this prompt in OpenCode when you are ready to build the first version of `tommitoan.com`.

```text
Build a new public-first personal brand gateway site in `/home/ngominhtoan/tommi-team/tommiteam/tommitoan.com`.

Context:
- This site is the canonical root domain for `tommitoan.com`
- It is not a CV clone
- `toanngo.cv` remains the recruiter-focused portfolio/resume site
- The new site should route users into a broader personal ecosystem
- Existing donor repos:
  - `/_tommitoan/toanngo.cv/` for stronger visual identity, motion taste, and current personal content quality
  - `/me/` for Next.js route structure, metadata, sitemap, robots, and static-export deployment patterns

Product direction:
- Public-first website
- Homepage presents 3 cinematic gateway panels:
  1. `Portfolio` - external link to `https://toanngo.cv`
  2. `Discover` - internal route into the broader personal world
  3. `Products` - internal route into public apps, tools, and live services
- Do not expose private tools prominently on the homepage
- Keep the site curated and premium, not crowded

Required routes:
- `/`
- `/discover`
- `/products`

Recommended stack:
- Next.js App Router
- TypeScript
- Tailwind
- pnpm
- static-export friendly setup

Design direction:
- Cinematic, atmospheric, engineered, exploratory
- Do not use bland default SaaS styling
- Reuse the strongest mood from `toanngo.cv`, but evolve it into a more portal-like command-deck experience
- Avoid heavy purple bias; use deep midnight or graphite with blue, cyan, and restrained amber accents
- Keep motion meaningful and limited: intro reveal, gateway panel transitions, section reveals
- Must work well on both desktop and mobile
- Support reduced motion

Content direction:
- Create a single source of truth content file for site copy and cards
- Homepage should be short and directional
- `Discover` should feature: who I am now, homelab, self-hosting, selected experiments, content channels
- `Products` should feature: Bazica, blog platform placeholder if needed, public tools, and future products with status labels
- Do not duplicate the full resume timeline from `toanngo.cv`

Implementation expectations:
1. Inspect `/_tommitoan/toanngo.cv/` and `/me/` before coding
2. Read and follow these planning docs before coding:
   - `/home/ngominhtoan/tommi-team/tommiteam/tommitoan.com/docs/business-strategy.md`
   - `/home/ngominhtoan/tommi-team/tommiteam/tommitoan.com/docs/technical-direction.md`
   - `/home/ngominhtoan/tommi-team/tommiteam/tommitoan.com/docs/implementation-plan.md`
   - `/home/ngominhtoan/tommi-team/tommiteam/tommitoan.com/docs/delivery-batches.md`
3. Start with Batch 1 from `delivery-batches.md`, not the whole project at once
4. Reuse local conventions where helpful, but do not clone placeholder pages from `/me/`
5. Create a clean project structure with reusable components
6. Add route metadata, sitemap, and robots support
7. Add docs updates in `/home/ngominhtoan/tommi-team/tommiteam/tommitoan.com/docs/` if architecture decisions change
8. Run build verification when done

Suggested deliverables:
- working homepage with 3-panel gateway
- working `/discover` page
- working `/products` page
- responsive layout
- metadata and SEO basics
- content model ready for future extension

Success criteria:
- The site feels like a premium personal brand gateway
- The distinction between `tommitoan.com` and `toanngo.cv` is clear
- The content feels curated, not duplicated
- Private/internal services are not overexposed
- The first version is shippable and easy to extend
```
