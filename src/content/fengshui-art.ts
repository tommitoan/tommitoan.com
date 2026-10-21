/** The wide pictures at the head of the bands of the Feng Shui page: public/fengshui/art/<name>.webp, 16:9, painted without any text and cut to size
 * before they are put here. The width and height below are those of the files; fengshui-art.test.ts compares them with the real headers, so they
 * cannot drift. The pictures decorate bands whose headings say everything, so they have no alt text.
 */
export type FengShuiArt = { src: string; width: number; height: number };

export const FENGSHUI_ART = {
  basics: { src: "/fengshui/art/co-so.webp", width: 960, height: 539 },
  why: { src: "/fengshui/art/ly-do.webp", width: 1024, height: 575 },
  roadmap: { src: "/fengshui/art/lo-trinh.webp", width: 1024, height: 575 },
  principles: { src: "/fengshui/art/nguyen-tac.webp", width: 896, height: 503 },
  begin: { src: "/fengshui/art/bat-dau.webp", width: 896, height: 503 },
} as const satisfies Record<string, FengShuiArt>;
