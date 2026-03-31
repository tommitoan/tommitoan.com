# Gateway Config

Homepage gateway configuration lives in `src/components/gateway/gatewayHomeConfig.ts`.

## Top-Level Sections

## `spaceTheme`

- `background.imageSrc`
  Base background image for the homepage and content routes.
- `background.overlayImage`
  Shared color and atmosphere overlay.
- `background.vignetteImage`
  Dark edge vignette used on the homepage.
- `stars.content`
  Starfield used by scrollable routes.
- `stars.gateway`
  Denser starfield used by the homepage.

## `transitions`

- `routeDelayMs`
  Delay before navigation after clicking a portal.
- `reducedMotionRouteDelayMs`
  Faster navigation delay when reduced motion is enabled.
- `zoomDurationSeconds`
  Portal zoom animation duration.
- `zoomScale`
  Selected-portal scale amount.
- `zoomOffsetXByPortal`
  Horizontal camera move for each portal.
- `zoomOffsetY`
  Vertical camera move during selection.
- `flashDelaySeconds`
  Delay before the white flash overlay appears.
- `flashDurationSeconds`
  Flash overlay duration.

## `row`

- `scale`
- `gapMobileRem`
- `gapDesktopRem`
- `heightMobileRem`
- `heightViewport`
- `heightDesktopRem`

Controls the 3-portal strip as a whole.

## `frame`

- `width`
- `height`
- `radiusRem`

Controls the outer portal card size and rounding.

## `planetStage`

- `topPercent`
- `heightPercent`

Defines the inner area reserved for the 3D planet.

## `astronaut`

- `assetSrc`
- `camera.position`
- `camera.fov`
- `sprite.width`
- `sprite.height`
- `placement.x`
- `placement.y`
- `placement.z`
- `placement.scale`
- `idle.*`
- `warp.*`

These settings control astronaut size, position, idle drift, and portal-warp behavior.

## `portals`

Each portal entry controls one homepage destination.

### Common fields

- `id`
- `label`
- `href`
- `description`
- `theme.hoverGradientClass`
- `theme.glowColor`
- `theme.borderColorClass`
- `effects`

### `planet`

- `size.mobileRem`
- `size.viewport`
- `size.desktopRem`
- `anchor.horizontal`
- `anchor.vertical`
- `anchor.offsetXPercent`
- `anchor.offsetYPercent`
- `hoverLiftPx`
- `frameHeightScale`
- texture and material fields consumed by `PlanetSphere`

## Effect Kinds

- `matrixRain`
- `aurora`
- `leaves`

Effects are data-driven in `portals[].effects`, so homepage visuals can be changed without adding new `if` branches in `space-gateway-home.tsx`.

## Asset Paths

- background: `public/gateway/backgrounds/space-bg.png`
- astronaut: `public/gateway/characters/astronaut.png`
- planet textures: `public/gateway/textures/planets/`
- pedestal textures: `public/gateway/textures/pedestals/`

## Safe Edit Workflow

1. Update one config section at a time.
2. Check the homepage on desktop and mobile.
3. Run `pnpm lint`.
4. Run `pnpm typecheck`.
5. Run `pnpm test:unit`.
6. Run `pnpm build`.
