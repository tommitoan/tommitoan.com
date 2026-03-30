# Gateway Scene Guide

## Goal

This guide shows how to edit the homepage astronaut gateway without hunting through too many files.

## Main files

- `src/content/space-gateway-content.ts` - window titles, descriptions, destination routes, and planet materials
- `src/components/gateway/space-gateway-home.tsx` - homepage scene composition
- `src/components/gateway/gatewaySceneConfig.ts` - portal window size, row scale, planet size, planet anchor, and fengshui effect knobs
- `src/components/canvas/spaceBackgroundConfig.ts` - astronaut size, position, idle movement, warp movement, and glow knobs
- `src/components/canvas/SpaceBackgroundAstronaut.tsx` - astronaut renderer that consumes the config

## What to edit for common tasks

### Change where a window goes

Edit `href` in `src/content/space-gateway-content.ts`.

Example:

```ts
{
  id: "tech",
  href: "/tech",
}
```

### Change the text on a window

Edit these fields in `src/content/space-gateway-content.ts`:

- `label`
- `description`

### Change portal window size for all 3 windows

Edit `gatewaySceneConfig.frame` in `src/components/gateway/gatewaySceneConfig.ts`.

- `width` controls the portal width
- `height` controls the portal height
- `radiusRem` controls corner roundness

`mobileRem` is the small-screen size.

`desktopRem` is the max size.

`viewport` is the middle responsive value used by `clamp(...)`.

### Change the size of the whole 3-window row

Edit `gatewaySceneConfig.row` in `src/components/gateway/gatewaySceneConfig.ts`.

- `scale` shrinks or enlarges the whole window row
- `gapMobileRem` and `gapDesktopRem` control spacing between windows
- `heightMobileRem`, `heightViewport`, and `heightDesktopRem` control the row height

### Change a planet's size or position inside a window

Edit `gatewaySceneConfig.planets.<portal>` in `src/components/gateway/gatewaySceneConfig.ts`.

The planet is positioned inside the shared `gatewaySceneConfig.planetStage` area, not the full card.

That is important because the bottom of the card is reserved visually for the title panel.

If a planet feels centered in code but still looks off in the frame, adjust `planetStage` first, then the per-planet anchor.

Each planet has:

- `size` for responsive width and height
- `anchor.horizontal`: `left`, `center`, or `right`
- `anchor.vertical`: `top`, `center`, or `bottom`
- `anchor.offsetXPercent` to nudge left or right
- `anchor.offsetYPercent` to nudge up or down
- `hoverLiftPx` to control how much the planet rises on hover

Shared stage controls:

- `planetStage.topPercent` moves the whole planet stage down from the top
- `planetStage.heightPercent` controls how much of the card is treated as the planet area

Example:

```ts
fengshui: {
  size: { mobileRem: 6.5, viewport: 10.5, desktopRem: 8.5 },
  anchor: { horizontal: "center", vertical: "top", offsetXPercent: 0, offsetYPercent: 26 },
  hoverLiftPx: 20,
}
```

To align a planet to the middle, use `horizontal: "center"`.

To align it near the top, use `vertical: "top"` and adjust `offsetYPercent`.

To move it right or left, keep `horizontal: "center"` and change `offsetXPercent`.

### Change the astronaut text bubble

Edit the text logic in `src/components/gateway/space-gateway-home.tsx`.

Current astronaut assets:


### Change fengshui wind and leaves

Edit `gatewaySceneConfig.effects` in `src/components/gateway/gatewaySceneConfig.ts`.

- `fengshuiWind.density` changes how many wind bands are shown
- `fengshuiWind.speed` changes how fast the wind moves
- `fengshuiWind.thickness` changes how heavy or light the wind looks
- `fengshuiLeaves` controls leaf count and size

### Change astronaut size or position

Edit `spaceBackgroundConfig.astronaut` in `src/components/canvas/spaceBackgroundConfig.ts`.

- `sprite.width` and `sprite.height` control the astronaut artwork size
- `placement.x`, `placement.y`, and `placement.z` control the base position
- `placement.scale` controls the overall astronaut scale

### Change astronaut movement or stop the idle drifting

Edit `spaceBackgroundConfig.astronaut.idle`.

- `enabled: false` freezes the idle floating and tilt motion
- `floatAmplitudeY` and `floatSpeed` control the whole-body drift
- `poseBobAmplitudeY` and `poseBobSpeed` control the internal body bob
- `poseTiltAmplitudeZ` and `poseTiltSpeedZ` control side sway
- `poseTiltAmplitudeX` and `poseTiltSpeedX` control forward/back tilt

### Change astronaut warp movement after clicking a portal

Edit `spaceBackgroundConfig.astronaut.warp`.

- `targetOffsetX` controls how far left or right it moves toward a portal
- `endY` controls how high it flies
- `endZ` controls how far away from camera it flies
- `endScale` controls how small it gets
- `spinSpeedZ` and `spinSpeedX` control spin speed
- `progressDamping` controls how quickly the warp starts

### Change the jump effect

Edit:

- `AnimatePresence` block in `src/components/gateway/space-gateway-home.tsx`
- selected portal zoom values in `space-gateway-home.tsx`

### Change planet look and window glow

Edit `src/content/space-gateway-content.ts` for textures, glow colors, and planet material options.

- `colorTheme`
- `glowColor`
- `borderColor`
- `planet.diffuse`
- `planet.normal`
- `planet.specular`
- `planet.clouds`
- `planet.crystalBall`

## Safe workflow for beginners

1. Run `pnpm dev`
2. Open the homepage
3. Change one thing only
4. Save and refresh
5. Check desktop and mobile
6. Run `pnpm lint` and `pnpm typecheck`

## Good rule

Keep route labels and links in `src/content/space-gateway-content.ts`.

Keep frame size, planet position, and astronaut motion in the config files.

That split makes the homepage easier to maintain later.
