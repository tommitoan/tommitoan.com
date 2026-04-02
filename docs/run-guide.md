# Run Guide

## Requirements

- Node.js 20+
- pnpm 10+

## Local Development

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Quality Checks

```bash
pnpm lint
pnpm typecheck
pnpm test:unit
pnpm build
```

## Preview Static Export

```bash
pnpm build
pnpm start
```

`pnpm start` serves the generated `out/` directory on port `3000`.

## Recommended Workflow

1. Run `pnpm dev`.
2. Make a small change.
3. Verify `/`, `/tech`, `/discover`, and `/fengshui`.
4. Run the quality checks.
