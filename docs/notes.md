# Notes

## Current Cleanup Decisions

- removed `public/papercraft-world/`
- removed the old `components/home` branch and related dead content
- removed stale planning docs instead of archiving them
- canonical contact email is `tommitoan1995@gmail.com`

## Naming Conventions

- display label: `Feng Shui`
- route slug and internal id: `fengshui`
- homepage assets live under `public/gateway/`
- profile assets live under `public/profile/`
- project previews live under `public/projects/`

## Remaining Refactor Opportunities

- split `src/app/globals.css` into smaller files by route or concern
- further break down `src/components/gateway/PlanetSphere.tsx`
- add more unit tests around config-driven rendering choices
- unify any future shared visual tokens into a dedicated design token module
