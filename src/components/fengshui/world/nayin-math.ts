/** The Nạp Âm entry (0 to 29) a place of the sixty-pair cycle belongs to: two pairs in a row share one. */
export const nayinOfPair = (cycleIndex: number): number => Math.floor(cycleIndex / 2);

/** The two cycle places (0 to 59) an entry covers. */
export const pairsOfNayin = (entry: number): [number, number] => [entry * 2, entry * 2 + 1];
