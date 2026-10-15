# tommitoan.com

Personal website for Toan Ngo, built as a static Next.js space gateway with three routes: `Tech`, `Discover`, and `Feng Shui`.

<div align="center">
  <img alt="Demo" src="./public/screenshot.png" />
</div>

<h3 align="center">
  <a href="https://tommitoan.com/" target="_blank">Live Demo</a>
</h3>

## Routes

- `/` — gateway homepage with 3 interactive 3D portals
- `/tech` — engineering profile and CV route (7 sections: Hero, About, Skills, Experience, Education, Projects, Contact)
- `/discover` — homelab, experiments, and public channels (coming soon)
- `/fengshui` — the Feng Shui world: the scroll story of a chart, Bazica and Ba-zi basics
- `/fengshui/blog/` and `/fengshui/blog/<lang>/<slug>/` — the blog (see Blog)
- `/fengshui/about/` — the About page

## Tech Stack

- **Framework**: Next.js (App Router, static export)
- **Styling**: Tailwind CSS v4 via `@tailwindcss/postcss`
- **3D**: React Three Fiber + Three.js (planet rendering)
- **Animation**: Framer Motion
- **Fonts**: Space Grotesk (display), Instrument Sans (body)

## Repo Structure

```
src/
  app/              route entry points, layouts, metadata, sitemap, robots, manifest
  components/
    canvas/         WebGL astronaut scene
    gateway/        homepage scene, planet renderer, loading screen, gateway config
    layout/         shared header, footer, page shell
    tech/           tech route sections and shared motion helpers
  content/          route copy and structured content (portfolio.ts, site-content.ts, etc.)
  lib/              metadata helper and utilities
public/
  gateway/          homepage backgrounds, astronaut, planet textures
  profile/          profile imagery
  projects/         project previews
  skills/           skill icon images
  announcement/     coming-soon imagery
```

## Commands

```bash
pnpm install
pnpm dev        # dev server at http://localhost:3000
pnpm lint       # ESLint
pnpm typecheck  # TypeScript strict check
pnpm build      # static export to out/
pnpm start      # serve the out/ directory
```

## Architecture Notes

### z-index scale

All gateway z-index values are defined as CSS custom properties in `src/app/globals.css`:

| Token | Value | Layer |
|-------|-------|-------|
| `--z-background` | 0 | space background image |
| `--z-overlay` | 1 | color/vignette overlay |
| `--z-stars` | 2 | star canvas |
| `--z-content` | 3 | main content wrapper |
| `--z-portal` | 50 | portal frame cards |
| `--z-astronaut` | 60 | astronaut WebGL canvas |
| `--z-flash` | 100 | route transition flash |
| `--z-loading` | 140 | loading screen |

### Gateway source of truth

Homepage scene configuration lives in `src/components/gateway/gatewayHomeConfig.ts`. That file controls:
- shared background and starfield settings
- portal labels, routes, themes, and effects
- frame size and row spacing
- planet textures, size, hover motion, and alignment
- astronaut asset, placement, idle motion, and warp motion
- selection timing, zoom, and flash behavior

### Content source of truth

| File | Controls |
|------|---------|
| `src/content/portfolio.ts` | All tech page copy (hero, skills, experience, education, projects) |
| `src/content/site-content.ts` | Navigation, site meta, footer, discover copy |
| `src/content/fengshui-content.ts` | Feng Shui content (prepared for future use) |

### Page backgrounds

- The `(content)` layout provides a shared space background + overlay for `/tech`, `/discover`, `/fengshui`.
- The `/tech` page adds its own `tech-bg.png` fixed background and a custom star canvas config — these override the layout background intentionally.
- The gateway (`/`) manages its own full-screen background independently.

## Blog

Posts are Markdown files in `content/blog/`, read at build time (a static export has no server). The blog is at `/fengshui/blog/`, a post at `/fengshui/blog/<lang>/<slug>/`, and the About page at `/fengshui/about/`.

- **File name:** `<slug>.<lang>.md`, where the slug is lowercase letters, digits and single hyphens and the language is `vi` or `en`. A post written in both languages uses the same slug twice (`welcome.vi.md`, `welcome.en.md`); the two versions then link to each other and name each other with `hreflang`.
- **Front matter** (between two `---` lines, one `key: value` per line): `title`, `date` (a real date as `YYYY-MM-DD`) and `description` are required; `draft: true` keeps the post out of the build.
- **Body:** Markdown. Raw HTML is shown as text and only `http`, `https`, `mailto`, relative and `#` links are kept.
- **A mistake stops the build** with the file name and the reason (bad name, missing key, impossible date, empty text, a post given twice), so nothing broken goes live.
- The list shows one row per slug, newest first, in the visitor's language when that version exists and in the other language, with a label, when it does not.
- The page text of the blog and About is in `src/content/fengshui-blog.ts` (Vietnamese and English).
- `NEXT_PUBLIC_BAZI_ORIGIN` (build time, default `https://bazi.tommitoan.com`) points the links and the kit at another Ba-zi site, for example a staging one. It must be a plain `http` or `https` origin; anything else is ignored. The Go site's matching setting is `PUBLIC_SITE_URL`.

## Performance, caching and error pages

- **Budgets:** `pnpm build && pnpm check:budgets` adds up the gzip size of the scripts and styles each page names and fails when a page is over its budget (the world home 290 KB of scripts, blog, post and About pages 235 KB, the 404 page 200 KB, the gateway 520 KB, Tech and Discover 280 KB), and when an icon, a character frame or a gateway image grows past its limit. The numbers are in `scripts/check-budgets.mjs`, about 10% over what was measured; raise one only with a reason.
- **Prefetch:** the world header does not prefetch `/`, `/tech` and `/discover` (`HEAVY_ROUTES` in `WorldHeader.tsx`), because Next would otherwise download the gateway's 3D bundle on every Feng Shui page.
- **Client bundle:** the Markdown renderer runs at build time only. `src/lib/blog/entries.ts` is the client-safe part; a test fails if a client component imports `posts.ts`, `markdown.ts` or `load.ts`.
- **nginx** (`nginx.conf.template`): gzip for text, the site's own `404.html` (in the look of the Feng Shui world), `/_next/static/` kept for a year as immutable, images and fonts for a week, pages and their payloads always revalidated. To try the real configuration (the commands are the same on macOS, Ubuntu and Fedora):

```bash
docker build -t tommitoan-web .
```

```bash
docker run --rm -p 8080:8080 tommitoan-web
```

  Then open `http://localhost:8080/fengshui/` and a missing address such as `http://localhost:8080/fengshui/nope/`; stop it with Ctrl+C.
- **Errors:** a page of the Feng Shui world that throws while rendering shows `src/app/(fengshui)/error.tsx` inside the header and footer, with a retry button; the 404 page is `src/app/not-found.tsx`.
- **Skip link:** every page of the world starts with a skip link to `#fs-main`.
- **Pointer ring trial (effect 20):** off by default. To try it: `NEXT_PUBLIC_KIT_CURSOR=1 pnpm dev`, open `/fengshui/` with a mouse. The real cursor stays; a ring follows it, grows over links and buttons, and an ink splash marks a click.

## Docs

- `docs/features.md`
- `docs/implementation.md`
- `docs/configuration.md`
- `docs/gateway-config.md`
- `docs/run-guide.md`
- `docs/notes.md`

## Notes

- The app uses static export via `next.config.ts` (`output: "export"`).
- No environment variables are required for local development. `NEXT_PUBLIC_BAZI_ORIGIN` is optional (see Blog).
- Canonical contact email: `tommitoan1995@gmail.com`.
