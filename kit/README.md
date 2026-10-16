# Shared kit

Tokens and global effects shared by [tommitoan.com](https://tommitoan.com) and `bazi.tommitoan.com` (the `bazica-web` repository), so the two sites look and move as one. It is framework-free TypeScript built to plain JavaScript and CSS. It contains no business logic and nothing private.

## What it contains

| Module | What it does |
|---|---|
| `env.ts` | Motion tier: `full`, `subtle` or `off` (reduced motion, weak device, data saver) and pointer detection |
| `color.ts`, `day-cycle.ts` | The day cycle: sky colour from night to paper for a progress value, and text colours that stay readable on it |
| `solar.ts`, `shichen.ts` | Real Sun position, solar terms, Ba-zi month branch and year, and the current double-hour |
| `keyframes.ts` | Which two keyframes to show for an age and how much to crossfade (for the growth scene) |
| `navigation.ts`, `transition.ts` | Bamboo-slat page transition, also across the two sites; the rules are pure and tested |
| `seal.ts` | Opening screen on every fresh load (hard timeout 4 s) |
| `reveal.ts`, `wash.ts`, `clock.ts`, `progress.ts`, `magnetic.ts`, `scroll.ts` | Heading reveal, ink-wash background, hour clock, progress bar and section dots, magnetic buttons, smooth scroll that pauses while a dialog is open |
| `kit.css` | `--kit-*` tokens and the styles of the effects |
| `boot.js` | Tiny inline snippet that prevents a flash before the seal or the reveal mounts |

## Using it

**Page markup (opt-in hooks):** `data-kit-reveal` on headings, `data-kit-section="Label"` on sections (progress dots), `data-kit-clock` on an empty element, `data-kit-magnetic` on buttons.

**Without a bundler (the Go site):** load `kit.css`, inline `kit-boot.js` in `<head>`, load `kit.iife.js`, then `TommiKit.init({ family: ["https://tommitoan.com"] })`. Reference the files with `?v=<VERSION>`: the Go site caches `/static/*` for 24 hours.

**With a bundler (Next.js):** `import { init } from "../../kit/src"` in a client effect, and import `kit.css` once. Splitting headings changes the DOM React owns; apply `data-kit-reveal` only to elements that React does not re-render.

**Options:** `init({ family, tier, locale, seal, effects })`. `family` lists the sister origins for the cross-site transition. `effects` turns single effects off (`{ wash: false }`). The returned object has `ready` (resolves when the seal or the reveal starts lifting), `tier`, `smooth` and `destroy()`.

**Rules the kit follows**

- Reduced motion turns every animation off and leaves the text readable.
- The transition skips links with a `#` fragment (share links), reloads, back and forward, modified clicks and new tabs, and unrelated origins.
- Arrival after the cover, or after a click on the sister site, plays the reveal (decided from `document.referrer`); a normal visit plays the seal.
- No network access, no `eval`, no inline styles needed on the page; the Go tests check the script for CDN addresses.
- The ink-wash layer needs the page canvas to paint its own background (set it on `html`, or on `body` when `html` has none).

## Build, test, sync

```bash
pnpm kit:build      # kit/dist: kit.iife.js, kit.esm.js, kit.css, kit-boot.js, VERSION, manifest.json
pnpm test:unit      # vitest, includes kit/src/kit.test.ts
pnpm kit:sync       # copies the built files into ../bazica-web/static/kit
node scripts/sync-kit.mjs --check   # exit 1 when the Go site is out of date
```

The commands are the same on macOS, Ubuntu and Fedora. `kit/dist` is committed on purpose; bump `KIT_VERSION` in `src/version.ts` for every change that reaches it. The Go repository checks the copied files against `manifest.json` in its tests.

## Trying it by hand

Two copies of the demo on different ports test the hop between origins (the same on all three systems):

```bash
cd kit
python3 -m http.server 4173 --bind 127.0.0.1 &
python3 -m http.server 4174 --bind 127.0.0.1 &
# open http://127.0.0.1:4173/demo/ and use the "Sang site anh em" link
```

Stop them with `kill %1 %2` in the same shell.
