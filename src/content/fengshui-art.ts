/** The wide pictures at the head of the bands of the Feng Shui page: public/fengshui/art/<name>.webp, 16:9 and without any text.
 * They are made with the Codex CLI in the bazica-web task `bazica-site-art` (PROMPTS_SET_3.md) and cut by its ingest_art_images.py, which writes
 * the size the file really has; fengshui-art.test.ts compares these numbers with the files, so they cannot drift. The pictures decorate bands
 * whose headings say everything, so they have no alt text.
 */
export type FengShuiArt = { src: string; width: number; height: number };

export const FENGSHUI_ART = {
  basics: { src: "/fengshui/art/co-so.webp", width: 960, height: 539 },
  why: { src: "/fengshui/art/ly-do.webp", width: 1024, height: 575 },
  roadmap: { src: "/fengshui/art/lo-trinh.webp", width: 1024, height: 575 },
  principles: { src: "/fengshui/art/nguyen-tac.webp", width: 896, height: 503 },
  begin: { src: "/fengshui/art/bat-dau.webp", width: 896, height: 503 },
} as const satisfies Record<string, FengShuiArt>;
