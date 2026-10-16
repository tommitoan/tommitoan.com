/** Returns `raw` as a plain http or https origin without a trailing slash, or `fallback` when it is not one. */
export function normaliseOrigin(raw: string | undefined, fallback: string): string {
  const value = raw?.trim();
  if (!value) return fallback;
  try {
    const url = new URL(value);
    const plain = (url.protocol === "http:" || url.protocol === "https:") && url.host !== "" && !url.username && !url.password && (url.pathname === "/" || url.pathname === "") && !url.search && !url.hash;
    return plain ? `${url.protocol}//${url.host}` : fallback;
  } catch {
    return fallback;
  }
}

/**
 * The origin of the Ba-zi site (bazica-web). A staging build points it at the staging site with NEXT_PUBLIC_BAZI_ORIGIN;
 * the kit uses it for the cover animation and the arrival reveal between the two sites.
 */
export const BAZI_ORIGIN = normaliseOrigin(process.env.NEXT_PUBLIC_BAZI_ORIGIN, "https://bazi.tommitoan.com");
