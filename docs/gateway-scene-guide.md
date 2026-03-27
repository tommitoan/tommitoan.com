# Gateway Scene Guide

## Goal

This guide shows how to edit the homepage astronaut gateway without hunting through too many files.

## Main files

- `src/content/gateway-content.ts` - window titles, descriptions, and destination routes
- `src/components/gateway/space-gateway-home.tsx` - astronaut, jump effect, and scene composition
- `src/components/gateway/space-window.tsx` - each portal window
- `src/app/globals.css` - neon portal, planet, and astronaut styling

## What to edit for common tasks

### Change where a window goes

Edit `href` in `src/content/gateway-content.ts`.

Example:

```ts
{
  id: "tech",
  href: "/tech",
}
```

### Change the text on a window

Edit these fields in `src/content/gateway-content.ts`:

- `title`
- `eyebrow`
- `description`
- `detail`

### Change the astronaut text bubble

Edit the text logic in `src/components/gateway/space-gateway-home.tsx`.

Current astronaut assets:


### Change astronaut size or position

Edit these CSS classes in `src/app/globals.css`:

- `.space-astronaut`
- `.space-astronaut-to-tech`
- `.space-astronaut-to-discover`
- `.space-astronaut-to-fengshui`
- `.space-astronaut-image`

### Change the jump effect

Edit:

- `AnimatePresence` block in `src/components/gateway/space-gateway-home.tsx`
- `.space-jump-overlay-*`
- `.space-jump-core`

### Change planet look and window glow

Edit these CSS classes in `src/app/globals.css`:

- `.space-window-tech`
- `.space-window-discover`
- `.space-window-fengshui`
- `.space-planet-tech`
- `.space-planet-discover`
- `.space-planet-fengshui`

## Safe workflow for beginners

1. Run `pnpm dev`
2. Open the homepage
3. Change one thing only
4. Save and refresh
5. Check desktop and mobile
6. Run `pnpm lint` and `pnpm typecheck`

## Good rule

Keep route labels and links in `src/content/gateway-content.ts`.

Keep visual behavior in components and CSS.

That split makes the homepage easier to maintain later.
