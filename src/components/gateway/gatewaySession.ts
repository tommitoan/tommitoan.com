/**
 * Whether the home page has already opened once in this browser tab. The loading ring belongs to the first opening: when the
 * visitor comes back from another route the page builds its scene again but skips the ring, and its windows simply rise in.
 */

export const GATEWAY_SEEN_KEY = "tommi:gateway-seen";

type ReadStore = Pick<Storage, "getItem">;
type WriteStore = Pick<Storage, "setItem">;

export function hasSeenGateway(store: ReadStore | null = tabStorage()): boolean {
  try {
    return store?.getItem(GATEWAY_SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

export function markGatewaySeen(store: WriteStore | null = tabStorage()): void {
  try {
    store?.setItem(GATEWAY_SEEN_KEY, "1");
  } catch {
    // Blocked storage: the ring simply shows on every visit.
  }
}

function tabStorage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.sessionStorage;
  } catch {
    return null;
  }
}

/** Nothing to listen to: the answer is read once per mount. */
export function subscribeNever(): () => void {
  return () => {};
}
