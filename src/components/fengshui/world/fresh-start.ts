/**
 * The journey starts from its first frame on every visit: a reload, or a click on the gateway's route, must not drop the
 * visitor in the middle of it where the browser last left them. The browser's own scroll restoration is turned off for as
 * long as the world is open, and the page goes to the top.
 */

/** Runs in the page's head, before the browser restores a scroll position on a reload. */
export const FRESH_START_SNIPPET = 'try{history.scrollRestoration="manual"}catch(e){}';

type ScrollTarget = Pick<Window, "scrollTo">;
type HistoryLike = { scrollRestoration: ScrollRestoration };

/** Starts the world at the top; the returned function gives the browser its scroll restoration back. */
export function startFresh(win: ScrollTarget, history: HistoryLike): () => void {
  let previous: ScrollRestoration = "auto";
  try {
    previous = history.scrollRestoration;
    history.scrollRestoration = "manual";
  } catch {
    // Browsers without the property keep restoring; the jump to the top below still applies.
  }
  win.scrollTo({ top: 0, left: 0, behavior: "instant" });
  return () => {
    try {
      history.scrollRestoration = previous;
    } catch {
      // Nothing to give back.
    }
  };
}
