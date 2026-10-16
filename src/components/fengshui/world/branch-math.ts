/** The branch that pairs with `branch` as a six harmony (lục hợp): Tý with Sửu, Dần with Hợi, Mão with Tuất, and so on. */
export const liuHe = (branch: number): number => (1 - branch + 12) % 12;

/** The branch opposite `branch` on the ring of twelve, its six clash (lục xung): Tý and Ngọ, Sửu and Mùi, and so on. */
export const liuChong = (branch: number): number => (branch + 6) % 12;

/**
 * Index in the kit's list of 24 solar terms (0 is Xuân Phân) of the term that opens the Ba-zi month of a branch:
 * Dần opens at Lập Xuân, Mão at Kinh Trập, and every branch after it two terms later.
 */
export const monthTermIndex = (branch: number): number => (21 + 2 * ((branch - 2 + 12) % 12)) % 24;

/** Three recent years of the branch in the sixty-year cycle (1996 was a Tý year), in Ba-zi years that begin at Lichun. */
export const yearsOf = (branch: number): [number, number, number] => [1996 + branch, 2008 + branch, 2020 + branch];

/** Position, in percent of a square, of branch `branch` on a ring with Tý at the top and the branches running clockwise. */
export function ringPercent(branch: number, radius: number): { left: number; top: number } {
  const angle = (branch / 12) * Math.PI * 2 - Math.PI / 2;
  return { left: 50 + radius * Math.cos(angle), top: 50 + radius * Math.sin(angle) };
}

/** The element of each three-harmony frame (tam hợp), by `branch % 4`: Thân Tý Thìn is Water, Tỵ Dậu Sửu Metal, Dần Ngọ Tuất Fire, Hợi Mão Mùi Wood. */
const TRIAD_ELEMENTS = ["water", "metal", "fire", "wood"] as const;

/** The other two branches of the three-harmony frame (tam hợp) that `branch` belongs to, and the frame's element. */
export function sanHe(branch: number): { others: [number, number]; element: (typeof TRIAD_ELEMENTS)[number] } {
  const group = branch % 4;
  const members = [group, group + 4, group + 8];
  const others = members.filter((member) => member !== branch) as [number, number];
  return { others, element: TRIAD_ELEMENTS[group]! };
}
