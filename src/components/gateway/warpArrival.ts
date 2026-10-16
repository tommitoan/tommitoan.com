/**
 * The gateway sends a visitor into a world with the warp (the astronaut is pulled in, a flash, then a client-side route
 * change). A page that opens like that must not also play the opening seal, which belongs to a fresh page load. The gateway
 * leaves a short-lived note in session storage; the world reads and clears it when it starts.
 */

export const WARP_ARRIVAL_KEY = "tommi:warp-arrival";
/** How long the note counts: the warp takes about two seconds, and a note this old belongs to an abandoned try. */
export const WARP_ARRIVAL_MAX_AGE_MS = 15_000;

type Store = Pick<Storage, "getItem" | "setItem" | "removeItem">;

/** The path as the router writes it, without a trailing slash (the static export serves both). */
const normalise = (path: string): string => (path.length > 1 ? path.replace(/\/+$/, "") : path);

export function markWarpArrival(path: string, store: Store | null = safeStorage(), now: number = Date.now()): void {
  try {
    store?.setItem(WARP_ARRIVAL_KEY, JSON.stringify({ path: normalise(path), at: now }));
  } catch {
    /* storage can be blocked; the world then plays its seal after the warp, which is harmless */
  }
}

/** True once when the visitor came through the warp to `path`. The note is always cleared. */
export function consumeWarpArrival(path: string, store: Store | null = safeStorage(), now: number = Date.now()): boolean {
  if (!store) return false;
  try {
    const raw = store.getItem(WARP_ARRIVAL_KEY);
    store.removeItem(WARP_ARRIVAL_KEY);
    if (!raw) return false;
    const note = JSON.parse(raw) as { path?: unknown; at?: unknown };
    return note.path === normalise(path) && typeof note.at === "number" && now - note.at >= 0 && now - note.at <= WARP_ARRIVAL_MAX_AGE_MS;
  } catch {
    return false;
  }
}

function safeStorage(): Store | null {
  try {
    return typeof window === "undefined" ? null : window.sessionStorage;
  } catch {
    return null;
  }
}
