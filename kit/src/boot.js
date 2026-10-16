/* Inline this in <head> before the page paints. It does two things.
   First it sets data-theme on <html> (the visitor's saved choice under "tommitoan-theme", else the system setting,
   else dark), so the dark look is there from the first frame.
   Then it adds html.kit-pending, which paints a cover until kit.init() mounts the seal or the reveal (and removes
   itself after 4 seconds even if the script never loads). It skips reduced motion and back/forward navigation,
   which never show an opening screen. */
(function () {
  try {
    var saved = null;
    try {
      saved = localStorage.getItem("tommitoan-theme");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      /* storage is blocked: the system setting decides */
    }
    var light = matchMedia("(prefers-color-scheme: light)").matches;
    document.documentElement.setAttribute("data-theme", saved === "light" || saved === "dark" ? saved : light ? "light" : "dark");
    var navigation = performance.getEntriesByType("navigation")[0];
    var type = navigation ? navigation.type : "navigate";
    if (type === "back_forward") return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.documentElement.classList.add("kit-pending");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    /* nothing to guard against: the page simply opens without the cover */
  }
})();
