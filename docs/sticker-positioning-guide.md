# Sticker Positioning Guide

## Goal

This guide shows how to move each homepage sticker without touching a lot of React code.

The main file is:

- `src/content/home-scene.ts`

## What you will edit

There are three important config sections:

### `heroStickerConfig`

Controls the big center sticker.

### `decorStickers`

Controls decorative stickers like game, feng shui, plane, and movie.

### `interactiveStickers`

Controls clickable stickers like backend, infra, about, open source, and contact.

Each sticker has values like this:

```ts
{
  id: "backend",
  src: "/sticker/working_1_focus.png",
  width: 260,
  height: 390,
  className:
    "absolute top-[25%] right-[8%] z-10 group drop-shadow-lg transition-transform duration-300 hover:scale-110 hover:-rotate-3",
}
```

## How `className` works

The important position classes are usually these:

- `absolute` - lets the sticker float on the page
- `top-[25%]` - distance from the top
- `bottom-[15%]` - distance from the bottom
- `left-[10%]` - distance from the left
- `right-[8%]` - distance from the right

## Quick movement cheatsheet

### Move up

Decrease the `top` value.

Example:

```ts
top-[25%] -> top-[20%]
```

### Move down

Increase the `top` value.

Example:

```ts
top-[25%] -> top-[30%]
```

### Move left

- if the sticker uses `left`, make the number smaller
- if the sticker uses `right`, make the number bigger

Examples:

```ts
left-[25%] -> left-[20%]
right-[8%] -> right-[12%]
```

### Move right

- if the sticker uses `left`, make the number bigger
- if the sticker uses `right`, make the number smaller

Examples:

```ts
left-[25%] -> left-[30%]
right-[8%] -> right-[4%]
```

### Make sticker bigger or smaller

Edit `width` and `height`.

Example:

```ts
width: 260 -> width: 300
height: 390 -> height: 450
```

## Recommended beginner workflow

1. Run `pnpm dev`.
2. Open the homepage.
3. Pick one sticker.
4. Change only one number.
5. Save.
6. Check the result.
7. Repeat until it feels right.

## Suggested starting points

If stickers overlap too much, adjust in this order:

1. hero sticker
2. backend and infra stickers
3. about sticker
4. ship and contact stickers
5. decorative stickers last

## Safe rule

Do not hardcode new sticker positions directly inside `src/app/page.tsx`.

Keep sticker layout changes inside `src/content/home-scene.ts` so everything stays easy to find later.
