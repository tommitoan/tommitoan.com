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
  Layered galaxy-style starfield used by the homepage only.

## `debug`

- `showFrames`
- `showPlanets`
- `showAstronaut`
- `showLabels`
- `showPortalEffects`

Use these flags in `src/components/gateway/gatewayHomeConfig.ts` when you want to inspect the gateway background and stars without the foreground UI.

Recommended isolation setup:

```ts
debug: {
  showFrames: false,
  showPlanets: false,
  showAstronaut: false,
  showLabels: false,
  showPortalEffects: false,
}
```

### `stars.gateway`

- `radius`
  Shared radius for gateway star placement.
- `layers`
  Array of star layers for depth and color variation.
- `performance.maxDpr`
  Maximum DPR used by the gateway star canvas.
- `performance.mobileScale`
  Count scale applied on smaller screens.
- `performance.reducedMotionDisableTwinkle`
  Disables twinkle when reduced motion is enabled.
- `distribution.diagonalBias`
  How strongly gateway stars prefer the diagonal nebula sweep.
- `distribution.diagonalWidth`
  Width of the preferred diagonal band.
- `distribution.diagonalOffset`
  Vertical offset for the diagonal band.
- `distribution.secondaryDiagonalBias`
  Lower-strength secondary band for a less uniform galaxy spread.
- `distribution.secondaryDiagonalWidth`
  Width of the secondary band.
- `distribution.secondaryDiagonalOffset`
  Vertical offset for the secondary band.

Each gateway star layer supports:

- `id`
- `count`
- `sizeMin`
- `sizeMax`
- `opacityMin`
- `opacityMax`
- `palette`
- `rotationX`
- `rotationY`
- `haloScale`
- `haloOpacity`
- `parallaxStrength`
- `twinkle.enabled`
- `twinkle.fraction`
- `twinkle.speedMin`
- `twinkle.speedMax`
- `twinkle.amplitudeMin`
- `twinkle.amplitudeMax`

The current gateway setup uses 4 layers:

- `far` for tiny dim stars
- `mid` for brighter stars with subtle twinkle
- `accent` for rare larger stars with stronger twinkle
- `hero` for very rare larger shimmer stars that push the scene closer to the reference sky

Use `haloScale` and `haloOpacity` on rare layers like `hero` to add a soft glow pass behind the main star points.

Use `parallaxStrength` on selected gateway layers to add slight mouse-driven depth. The current setup applies it only to `accent` and `hero` stars.

Use `distribution.*` to subtly align gateway star density with the nebula band in the background image. The secondary band helps the sky feel more organic and less like a single stripe.

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

Effects are data-driven in `portals[].effects`, so homepage visuals can be changed without adding new `if` branches in `space-gateway-home.tsx`.

## Aurora Wind Config

Each `aurora` effect can define `windConfig`:

- `density`
  How many wind bands are rendered.
- `speed`
  Phase speed multiplier for the animation.
- `thickness`
  Global thickness multiplier. Lower values make the wind thinner.
- `palette`
  Array of color bands. Each band supports:
  - `hue`
  - `saturation`
  - `alpha`
  - `thickness`
  - `lightness`

The Feng Shui portal now uses a green wind palette configured directly in `src/components/gateway/gatewayHomeConfig.ts`.

Example:

```ts
windConfig: {
  density: 12,
  speed: 0.42,
  thickness: 0.52,
  palette: [
    { hue: 104, saturation: 58, alpha: 0.52, thickness: 10, lightness: 70 },
    { hue: 126, saturation: 80, alpha: 0.66, thickness: 9, lightness: 84 },
    { hue: 156, saturation: 68, alpha: 0.58, thickness: 8, lightness: 81 },
  ],
}
```

To make the Feng Shui wind denser, increase `density`.

To make it thinner, reduce `thickness` or lower each palette band's `thickness`.

To change color, edit the `palette` hues and lightness values.

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
