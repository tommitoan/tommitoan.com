/* Inline this in <head> before the page paints. It adds html.kit-pending, which paints a paper cover until
   kit.init() mounts the seal or the reveal (and removes itself after 4 seconds even if the script never loads).
   It skips reduced motion and back/forward navigation, which never show an opening screen. */
(function () {
  try {
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
