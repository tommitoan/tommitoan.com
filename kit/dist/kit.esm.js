/* tommitoan kit 0.5.0 */
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// kit/src/solar.ts
var STEMS_HAN = "\u7532\u4E59\u4E19\u4E01\u620A\u5DF1\u5E9A\u8F9B\u58EC\u7678";
var BRANCHES_HAN = "\u5B50\u4E11\u5BC5\u536F\u8FB0\u5DF3\u5348\u672A\u7533\u9149\u620C\u4EA5";
var SOLAR_TERMS_VI = [
  "Xu\xE2n Ph\xE2n",
  "Thanh Minh",
  "C\u1ED1c V\u0169",
  "L\u1EADp H\u1EA1",
  "Ti\u1EC3u M\xE3n",
  "Mang Ch\u1EE7ng",
  "H\u1EA1 Ch\xED",
  "Ti\u1EC3u Th\u1EED",
  "\u0110\u1EA1i Th\u1EED",
  "L\u1EADp Thu",
  "X\u1EED Th\u1EED",
  "B\u1EA1ch L\u1ED9",
  "Thu Ph\xE2n",
  "H\xE0n L\u1ED9",
  "S\u01B0\u01A1ng Gi\xE1ng",
  "L\u1EADp \u0110\xF4ng",
  "Ti\u1EC3u Tuy\u1EBFt",
  "\u0110\u1EA1i Tuy\u1EBFt",
  "\u0110\xF4ng Ch\xED",
  "Ti\u1EC3u H\xE0n",
  "\u0110\u1EA1i H\xE0n",
  "L\u1EADp Xu\xE2n",
  "V\u0169 Th\u1EE7y",
  "Kinh Tr\u1EADp"
];
var MONTH_BRANCHES_VI = ["D\u1EA7n", "M\xE3o", "Th\xECn", "T\u1EF5", "Ng\u1ECD", "M\xF9i", "Th\xE2n", "D\u1EADu", "Tu\u1EA5t", "H\u1EE3i", "T\xFD", "S\u1EEDu"];
var MONTH_BRANCHES_HAN = "\u5BC5\u536F\u8FB0\u5DF3\u5348\u672A\u7533\u9149\u620C\u4EA5\u5B50\u4E11";
var LICHUN_LONGITUDE = 315;
function solarLongitude(utcMs) {
  const jd = utcMs / 864e5 + 24405875e-1;
  const n = jd - 2451545;
  const meanLongitude = (280.46 + 0.9856474 * n) % 360;
  const g = (357.528 + 0.9856003 * n) * Math.PI / 180;
  const lambda = meanLongitude + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g);
  return (lambda % 360 + 360) % 360;
}
function solarTerm(longitude) {
  const index = Math.floor((longitude % 360 + 360) % 360 / 15);
  return { index, name: SOLAR_TERMS_VI[index], startsAt: index * 15 };
}
function monthBranch(longitude) {
  const index = Math.floor(((longitude - LICHUN_LONGITUDE) % 360 + 360) % 360 / 30);
  return { index, name: MONTH_BRANCHES_VI[index], han: MONTH_BRANCHES_HAN[index] };
}
function baziYear(date) {
  const longitude = solarLongitude(date.getTime());
  const beforeLichun = date.getUTCMonth() < 2 && longitude >= 270 && longitude < LICHUN_LONGITUDE;
  return date.getUTCFullYear() - (beforeLichun ? 1 : 0);
}
function ganzhiYear(year) {
  const stem = STEMS_HAN[((year - 4) % 10 + 10) % 10];
  const branch = BRANCHES_HAN[((year - 4) % 12 + 12) % 12];
  return { stem, branch, han: stem + branch };
}

// kit/src/shichen.ts
var SHICHEN_VI = ["T\xFD", "S\u1EEDu", "D\u1EA7n", "M\xE3o", "Th\xECn", "T\u1EF5", "Ng\u1ECD", "M\xF9i", "Th\xE2n", "D\u1EADu", "Tu\u1EA5t", "H\u1EE3i"];
function shichen(hours, minutes) {
  const index = Math.floor((hours + 1) % 24 / 2);
  const endHour = (index * 2 + 1) % 24;
  let minutesLeft = (endHour * 60 - (hours * 60 + minutes) + 1440) % 1440;
  if (minutesLeft === 0) minutesLeft = 120;
  return { index, name: SHICHEN_VI[index], han: BRANCHES_HAN[index], minutesLeft };
}

// kit/src/clock.ts
var label = (locale, name, minutesLeft) => locale === "en" ? `Hour of the ${name} \xB7 ${minutesLeft} min left` : `Gi\u1EDD ${name} \xB7 c\xF2n ${minutesLeft} ph\xFAt`;
function mountClock(locale, root = document) {
  const targets = Array.from(root.querySelectorAll("[data-kit-clock]"));
  const parts = targets.map((target) => {
    target.classList.add("kit-clock");
    const han = document.createElement("b");
    han.className = "kit-clock-han";
    han.setAttribute("aria-hidden", "true");
    const text = document.createElement("span");
    target.textContent = "";
    target.append(han, text);
    return { han, text };
  });
  const update = () => {
    const now = /* @__PURE__ */ new Date();
    const current = shichen(now.getHours(), now.getMinutes());
    for (const part of parts) {
      part.han.textContent = current.han;
      part.text.textContent = label(locale, current.name, current.minutesLeft);
    }
  };
  update();
  const timer = parts.length > 0 ? window.setInterval(update, 3e4) : 0;
  return {
    destroy() {
      if (timer) window.clearInterval(timer);
    }
  };
}

// kit/src/env.ts
function resolveTier(signals) {
  if (signals.reducedMotion) return "off";
  if (signals.saveData) return "subtle";
  if (signals.memory !== void 0 && signals.memory <= 2) return "subtle";
  if (signals.cores !== void 0 && signals.cores <= 2) return "subtle";
  return "full";
}
function readEnv(win = window) {
  const nav = win.navigator;
  return {
    reducedMotion: win.matchMedia("(prefers-reduced-motion: reduce)").matches,
    saveData: nav.connection?.saveData === true,
    cores: nav.hardwareConcurrency,
    memory: nav.deviceMemory
  };
}
var detectTier = (win = window) => resolveTier(readEnv(win));
var hasFinePointer = (win = window) => win.matchMedia("(hover: hover) and (pointer: fine)").matches;
function watchReducedMotion(onChange, win = window) {
  const query = win.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

// kit/src/color.ts
var clamp = (x, min, max) => Math.max(min, Math.min(max, x));
var lerp = (a, b, t) => a + (b - a) * t;
var smoothstep = (t) => {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
};
var seg = (p, a, b) => clamp((p - a) / (b - a), 0, 1);
var lerpColor = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
var luminance = (c) => 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2];
var rgbString = (c) => `rgb(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])})`;
var NIGHT = [12, 16, 36];
var PAPER = [243, 234, 215];
var INK = [59, 47, 32];
var MOON = [238, 232, 255];
var MUTED_NIGHT = [167, 159, 196];
var MUTED_DAY = [102, 85, 63];
var DAY_STOPS = [
  [0, NIGHT],
  [0.28, [28, 28, 74]],
  [0.42, [84, 64, 124]],
  [0.5, [226, 140, 120]],
  [0.6, [248, 208, 152]],
  [0.72, PAPER]
];
function skyColor(progress) {
  const p = clamp(progress, 0, 1);
  for (let i = 0; i < DAY_STOPS.length - 1; i++) {
    const [p0, c0] = DAY_STOPS[i];
    const [p1, c1] = DAY_STOPS[i + 1];
    if (p <= p1) return lerpColor(c0, c1, smoothstep(seg(p, p0, p1)));
  }
  return DAY_STOPS[DAY_STOPS.length - 1][1];
}
var textMix = (lum) => smoothstep(seg(lum, 100, 140));
function dayState(progress) {
  const p = clamp(progress, 0, 1);
  const sky = skyColor(p);
  const lum = luminance(sky);
  const mix = textMix(lum);
  return {
    progress: p,
    sky,
    luminance: lum,
    textMix: mix,
    fg: lerpColor(MOON, INK, mix),
    muted: lerpColor(MUTED_NIGHT, MUTED_DAY, mix)
  };
}

// kit/src/cursor.ts
function ringTarget({ interactive, overField, pressed }) {
  if (overField) return { scale: 1, opacity: 0 };
  const base = interactive ? 1.7 : 1;
  return { scale: pressed ? base * 0.8 : base, opacity: interactive ? 1 : 0.75 };
}
function easeStep(current, target, factor, rest = 0.02) {
  const next = current + (target - current) * clamp(factor, 0, 1);
  return Math.abs(target - next) < rest ? target : next;
}
function shouldMountCursor(enabled, tier, finePointer) {
  return enabled && tier === "full" && finePointer;
}
var INTERACTIVE_SELECTOR = 'a[href], button, summary, label, select, [role="button"], [data-kit-magnetic]';
var FIELD_SELECTOR = 'input:not([type="button"]):not([type="submit"]):not([type="checkbox"]):not([type="radio"]):not([type="range"]), textarea, [contenteditable=""], [contenteditable="true"]';
var SPLASH_FRAMES = [
  { transform: "scale(0.2)", opacity: 0.35 },
  { transform: "scale(4.2)", opacity: 0 }
];
var SPLASH_MS = 520;
function mountCursor(tier, finePointer, enabled) {
  if (!shouldMountCursor(enabled, tier, finePointer)) return { destroy: () => void 0 };
  const ring = document.createElement("div");
  ring.className = "kit-cursor-ring";
  ring.setAttribute("aria-hidden", "true");
  document.body.appendChild(ring);
  let goal = { x: 0, y: 0 };
  let shown = { x: 0, y: 0 };
  let look = { scale: 1, opacity: 0 };
  let input = { interactive: false, overField: false, pressed: false };
  let frame = 0;
  let seen = false;
  const draw = () => {
    ring.style.transform = `translate3d(${shown.x.toFixed(1)}px, ${shown.y.toFixed(1)}px, 0) scale(${look.scale.toFixed(3)})`;
    ring.style.opacity = look.opacity.toFixed(2);
  };
  const tick = () => {
    frame = 0;
    const target = ringTarget(input);
    shown = { x: easeStep(shown.x, goal.x, 0.22, 0.2), y: easeStep(shown.y, goal.y, 0.22, 0.2) };
    look = { scale: easeStep(look.scale, target.scale, 0.2), opacity: easeStep(look.opacity, seen ? target.opacity : 0, 0.2, 0.01) };
    draw();
    const moving = shown.x !== goal.x || shown.y !== goal.y || look.scale !== target.scale || look.opacity !== (seen ? target.opacity : 0);
    if (moving) frame = window.requestAnimationFrame(tick);
  };
  const run = () => {
    if (!frame) frame = window.requestAnimationFrame(tick);
  };
  const classify = (target) => {
    const element = target instanceof Element ? target : null;
    input = {
      ...input,
      interactive: Boolean(element?.closest(INTERACTIVE_SELECTOR)),
      overField: Boolean(element?.closest(FIELD_SELECTOR))
    };
  };
  const onMove = (event) => {
    if (event.pointerType !== "mouse") return;
    goal = { x: event.clientX, y: event.clientY };
    if (!seen) {
      seen = true;
      shown = { ...goal };
    }
    classify(event.target);
    run();
  };
  const onDown = (event) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    input = { ...input, pressed: true };
    const splash = document.createElement("div");
    splash.className = "kit-splash";
    splash.setAttribute("aria-hidden", "true");
    splash.style.left = `${event.clientX}px`;
    splash.style.top = `${event.clientY}px`;
    document.body.appendChild(splash);
    const animation = splash.animate(SPLASH_FRAMES, { duration: SPLASH_MS, easing: "cubic-bezier(0.16, 1, 0.3, 1)" });
    const remove = () => splash.remove();
    animation.finished.then(remove, remove);
    run();
  };
  const onUp = () => {
    input = { ...input, pressed: false };
    run();
  };
  const onLeave = () => {
    seen = false;
    run();
  };
  document.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("pointerdown", onDown, { passive: true });
  document.addEventListener("pointerup", onUp, { passive: true });
  document.documentElement.addEventListener("pointerleave", onLeave);
  return {
    destroy() {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      if (frame) window.cancelAnimationFrame(frame);
      ring.remove();
      document.querySelectorAll(".kit-splash").forEach((splash) => splash.remove());
    }
  };
}

// kit/src/drift.ts
var DEFAULT_DRIFT = [-22, -8, -34, -14];
var TILT = [-6, 4, -3, 5];
function parseDrift(value, count) {
  const parsed = (value ?? "").split(",").map((part) => Number.parseFloat(part)).filter((amount) => Number.isFinite(amount));
  const source = parsed.length > 0 ? parsed : [...DEFAULT_DRIFT];
  return Array.from({ length: count }, (_, index) => source[index % source.length] ?? 0);
}
function driftProgress(top, height, viewport) {
  const range = Math.max(1, height + viewport * 0.2);
  return clamp(-top / range, 0, 1);
}
function shouldMountDrift(tier) {
  return tier === "full";
}
function mountDrift(tier, after = Promise.resolve(), root = document) {
  if (!shouldMountDrift(tier)) return { destroy: () => void 0 };
  const cleanups = [];
  for (const host of Array.from(root.querySelectorAll("[data-kit-drift]"))) {
    const cards = Array.from(host.children);
    if (cards.length === 0) continue;
    const amounts = parseDrift(host.getAttribute("data-kit-drift"), cards.length);
    const entrances = [];
    let cancelled = false;
    void after.then(() => {
      if (cancelled) return;
      cards.forEach((card, index) => {
        entrances.push(
          card.animate([{ opacity: 0, transform: `translateY(60px) rotate(${TILT[index % TILT.length]}deg)` }, { opacity: 1, transform: "none" }], {
            duration: 900,
            delay: 150 + index * 120,
            easing: "cubic-bezier(0.22, 1, 0.3, 1)",
            fill: "backwards"
          })
        );
      });
    });
    let frame = 0;
    const update = () => {
      frame = 0;
      const box = host.getBoundingClientRect();
      if (box.height === 0) return;
      const progress = driftProgress(box.top, box.height, window.innerHeight);
      cards.forEach((card, index) => {
        card.style.translate = `0 ${((amounts[index] ?? 0) * progress).toFixed(2)}%`;
      });
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    cleanups.push(() => {
      cancelled = true;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      entrances.forEach((animation) => animation.cancel());
      cards.forEach((card) => {
        card.style.translate = "";
      });
    });
  }
  return { destroy: () => cleanups.forEach((cleanup) => cleanup()) };
}

// kit/src/dust.ts
var DUST_SIZE = 340;
var DUST_STEP = 5;
var PUSH_RADIUS = 90;
function sampleTargets(rgba, size, step, threshold = 140) {
  const targets = [];
  for (let y = 0; y < size; y += step) {
    for (let x = 0; x < size; x += step) {
      if ((rgba[(y * size + x) * 4 + 3] ?? 0) > threshold) targets.push([x, y]);
    }
  }
  return targets;
}
function stepParticle(p, pointer) {
  p.vx += (p.tx - p.x) * 0.022;
  p.vy += (p.ty - p.y) * 0.022;
  if (pointer) {
    const dx = p.x - pointer.x;
    const dy = p.y - pointer.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < PUSH_RADIUS && distance > 0.1) {
      const push = (PUSH_RADIUS - distance) / PUSH_RADIUS;
      p.vx += dx / distance * push * 5;
      p.vy += dy / distance * push * 5;
    }
  }
  p.vx *= 0.86;
  p.vy *= 0.86;
  p.x += p.vx;
  p.y += p.vy;
}
function shouldMountDust(tier) {
  return tier === "full";
}
function mountDust(tier, root = document) {
  if (!shouldMountDust(tier)) return { destroy: () => void 0 };
  const cleanups = [];
  for (const host of Array.from(root.querySelectorAll("[data-kit-dust]"))) {
    const glyph = host.getAttribute("data-kit-dust") ?? "";
    if (!glyph) continue;
    const canvas = document.createElement("canvas");
    canvas.width = DUST_SIZE;
    canvas.height = DUST_SIZE;
    canvas.className = "kit-dust-canvas";
    canvas.setAttribute("aria-hidden", "true");
    const ctx = canvas.getContext("2d");
    if (!ctx) continue;
    host.appendChild(canvas);
    let particles = [];
    let pointer = null;
    let frame = 0;
    let visible = false;
    let disposed = false;
    const color = host.getAttribute("data-kit-dust-color") || "rgba(139, 46, 31, 0.8)";
    const font = getComputedStyle(host).getPropertyValue("--kit-han").trim() || "serif";
    const sample = () => {
      const offscreen = document.createElement("canvas");
      offscreen.width = DUST_SIZE;
      offscreen.height = DUST_SIZE;
      const paint = offscreen.getContext("2d");
      if (!paint) return;
      paint.fillStyle = "#000";
      paint.font = `290px ${font}`;
      paint.textAlign = "center";
      paint.textBaseline = "middle";
      paint.fillText(glyph, DUST_SIZE / 2, DUST_SIZE / 2 + 10);
      const targets = sampleTargets(paint.getImageData(0, 0, DUST_SIZE, DUST_SIZE).data, DUST_SIZE, DUST_STEP);
      particles = targets.map(([tx, ty]) => ({ tx, ty, x: Math.random() * DUST_SIZE, y: Math.random() * DUST_SIZE, vx: 0, vy: 0 }));
    };
    const draw = () => {
      if (!visible || disposed) {
        frame = 0;
        return;
      }
      const box = canvas.getBoundingClientRect();
      const scale = box.width > 0 ? DUST_SIZE / box.width : 1;
      const local = pointer ? { x: (pointer.x - box.left) * scale, y: (pointer.y - box.top) * scale } : null;
      ctx.clearRect(0, 0, DUST_SIZE, DUST_SIZE);
      ctx.fillStyle = color;
      for (const p of particles) {
        stepParticle(p, local);
        ctx.fillRect(p.x, p.y, 2.4, 2.4);
      }
      frame = window.requestAnimationFrame(draw);
    };
    const onMove = (event) => {
      pointer = { x: event.clientX, y: event.clientY };
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    const observer = new IntersectionObserver((entries) => {
      visible = entries[0]?.isIntersecting ?? false;
      if (visible && !frame && particles.length > 0) frame = window.requestAnimationFrame(draw);
    });
    observer.observe(canvas);
    const start = () => {
      if (disposed) return;
      sample();
      if (particles.length === 0) return;
      host.classList.add("kit-dust-on");
      if (visible && !frame) frame = window.requestAnimationFrame(draw);
    };
    if (document.fonts?.load) void document.fonts.load(`290px ${font}`, glyph).then(start, start);
    else start();
    cleanups.push(() => {
      disposed = true;
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
      if (frame) window.cancelAnimationFrame(frame);
      host.classList.remove("kit-dust-on");
      canvas.remove();
    });
  }
  return { destroy: () => cleanups.forEach((cleanup) => cleanup()) };
}

// kit/src/life.ts
var LIFE_FRAME_MS = 2200;
var LIFE_REST_MS = 1800;
function parseLifeFrames(value) {
  const frames = [];
  for (const entry of (value ?? "").split(";")) {
    const cut = entry.indexOf("=");
    if (cut < 0) continue;
    const age = entry.slice(0, cut).trim();
    const src = entry.slice(cut + 1).trim();
    if (age && src) frames.push({ age, src });
  }
  return frames;
}
function nextFrame(index, count) {
  if (count <= 0) return { index: 0, restarted: false };
  const next = index + 1;
  return next >= count ? { index: 0, restarted: true } : { index: next, restarted: false };
}
function shouldMountLife(tier) {
  return tier === "full";
}
function mountLife(tier, after = Promise.resolve(), root = document) {
  if (!shouldMountLife(tier)) return { destroy: () => void 0 };
  const cleanups = [];
  for (const host of Array.from(root.querySelectorAll("[data-kit-life]"))) {
    const first = host.querySelector("img[data-age]");
    const extra = parseLifeFrames(host.getAttribute("data-kit-life-frames"));
    if (!first || extra.length === 0) continue;
    const star = host.querySelector("[data-kit-life-star]");
    const counter = host.querySelector("[data-kit-life-age]");
    const frames = [first];
    const created = [];
    let current = 0;
    let timer = 0;
    let visible = false;
    let started = false;
    let disposed = false;
    const show = (index) => {
      frames.forEach((frame, i) => frame.classList.toggle("is-active", i === index));
      if (counter) counter.textContent = frames[index]?.getAttribute("data-age") ?? "";
    };
    const fall = () => {
      star?.animate(
        [
          { transform: "translate(70px, -150px) scale(0.6)", opacity: 0 },
          { opacity: 1, offset: 0.25 },
          { transform: "translate(0, 0) scale(1)", opacity: 0 }
        ],
        { duration: 1100, easing: "cubic-bezier(0.55, 0, 0.8, 0.4)" }
      );
    };
    const tick = () => {
      timer = 0;
      if (!visible || disposed) return;
      const step = nextFrame(current, frames.length);
      current = step.index;
      show(current);
      if (step.restarted) fall();
      const last = current === frames.length - 1;
      timer = window.setTimeout(tick, last ? LIFE_REST_MS + LIFE_FRAME_MS : LIFE_FRAME_MS);
    };
    const begin = () => {
      if (started || disposed) return;
      started = true;
      host.classList.add("kit-life-playing");
      for (const { age, src } of extra) {
        const image = document.createElement("img");
        image.alt = "";
        image.decoding = "async";
        image.width = first.width || 400;
        image.height = first.height || 600;
        image.setAttribute("data-age", age);
        image.src = src;
        host.insertBefore(image, star);
        frames.push(image);
        created.push(image);
      }
      fall();
      show(0);
      timer = window.setTimeout(tick, LIFE_FRAME_MS);
    };
    const observer = new IntersectionObserver((entries) => {
      visible = entries[0]?.isIntersecting ?? false;
      if (!visible) {
        if (timer) window.clearTimeout(timer);
        timer = 0;
        return;
      }
      if (!started) void after.then(begin);
      else if (!timer) timer = window.setTimeout(tick, LIFE_FRAME_MS);
    });
    observer.observe(host);
    cleanups.push(() => {
      disposed = true;
      observer.disconnect();
      if (timer) window.clearTimeout(timer);
      host.classList.remove("kit-life-playing");
      created.forEach((image) => image.remove());
      first.classList.remove("is-active");
      if (counter) counter.textContent = first.getAttribute("data-age") ?? "";
    });
  }
  return { destroy: () => cleanups.forEach((cleanup) => cleanup()) };
}

// kit/src/magnetic.ts
var SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";
function mountMagnetic(tier, finePointer, root = document) {
  if (tier !== "full" || !finePointer) return { destroy: () => void 0 };
  const cleanups = [];
  for (const element of Array.from(root.querySelectorAll("[data-kit-magnetic]"))) {
    const onMove = (event) => {
      const box = element.getBoundingClientRect();
      const x = (event.clientX - box.left - box.width / 2) * 0.35;
      const y = (event.clientY - box.top - box.height / 2) * 0.35;
      element.getAnimations().forEach((animation) => animation.cancel());
      element.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    };
    const onLeave = () => {
      const from = element.style.transform || "translate(0, 0)";
      element.style.transform = "";
      element.animate([{ transform: from }, { transform: "translate(0, 0)" }], { duration: 700, easing: SPRING });
    };
    element.addEventListener("pointermove", onMove);
    element.addEventListener("pointerleave", onLeave);
    cleanups.push(() => {
      element.removeEventListener("pointermove", onMove);
      element.removeEventListener("pointerleave", onLeave);
      element.style.transform = "";
    });
  }
  return { destroy: () => cleanups.forEach((cleanup) => cleanup()) };
}

// kit/src/navigation.ts
function originOf(url, base) {
  try {
    const parsed = new URL(url, base);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    return parsed.origin.toLowerCase();
  } catch {
    return null;
  }
}
var normalise = (origins) => origins.map((o) => o.replace(/\/+$/, "").toLowerCase());
function shouldCoverNavigation(click) {
  if (click.tier === "off") return false;
  if (click.defaultPrevented) return false;
  if (click.button !== 0 || click.ctrl || click.meta || click.shift || click.alt) return false;
  if (click.download) return false;
  if (click.target && click.target !== "_self") return false;
  let destination;
  let current;
  try {
    destination = new URL(click.href, click.currentHref);
    current = new URL(click.currentHref);
  } catch {
    return false;
  }
  if (destination.protocol !== "http:" && destination.protocol !== "https:") return false;
  if (destination.hash !== "") return false;
  if (destination.origin === current.origin && destination.pathname === current.pathname && destination.search === current.search) return false;
  if (destination.origin.toLowerCase() === current.origin.toLowerCase()) {
    return click.sameOriginPaths === void 0 || click.sameOriginPaths.some((prefix) => pathHasPrefix(destination.pathname, prefix));
  }
  return normalise(click.family).includes(destination.origin.toLowerCase());
}
function pathHasPrefix(pathname, prefix) {
  const base = prefix.replace(/\/+$/, "");
  return pathname === base || pathname === `${base}/` || pathname.startsWith(`${base}/`);
}
function shouldRevealArrival(arrival) {
  if (arrival.tier === "off") return false;
  if (arrival.navType !== "navigate") return false;
  let current;
  try {
    current = new URL(arrival.currentHref);
  } catch {
    return false;
  }
  if (current.hash !== "") return false;
  if (arrival.startedHere) return true;
  const from = originOf(arrival.referrer);
  if (!from || from === current.origin.toLowerCase()) return false;
  return normalise(arrival.family).includes(from);
}
function shouldPlaySeal(navType, tier, revealPlays) {
  if (tier === "off" || revealPlays) return false;
  return navType === "navigate" || navType === "reload";
}

// kit/src/progress.ts
function mountProgress() {
  const bar = document.createElement("div");
  bar.className = "kit-progress";
  bar.setAttribute("aria-hidden", "true");
  document.body.appendChild(bar);
  let frame = 0;
  const update = () => {
    frame = 0;
    const range = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0})`;
  };
  const onScroll = () => {
    if (!frame) frame = window.requestAnimationFrame(update);
  };
  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  return {
    destroy() {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      bar.remove();
    }
  };
}
function mountDots(options) {
  const root = options.root ?? document;
  const sections = Array.from(root.querySelectorAll("[data-kit-section]"));
  if (sections.length < 2) return { destroy: () => void 0 };
  const nav = document.createElement("nav");
  nav.className = "kit-dots";
  nav.setAttribute("aria-label", "Sections");
  const buttons = sections.map((section, index) => {
    const name = section.getAttribute("data-kit-section") || `Section ${index + 1}`;
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("aria-label", name);
    const label2 = document.createElement("span");
    label2.textContent = name;
    button.appendChild(label2);
    button.addEventListener("click", () => {
      if (options.smooth) options.smooth.scrollTo(section, -64);
      else section.scrollIntoView({ behavior: options.tier === "off" ? "auto" : "smooth", block: "start" });
    });
    nav.appendChild(button);
    return button;
  });
  document.body.appendChild(nav);
  const setCurrent = (index) => buttons.forEach((button, i) => i === index ? button.setAttribute("aria-current", "true") : button.removeAttribute("aria-current"));
  let frame = 0;
  const update = () => {
    frame = 0;
    let current = 0;
    sections.forEach((section, index) => {
      if (section.getBoundingClientRect().top < window.innerHeight * 0.45) current = index;
    });
    setCurrent(current);
  };
  const onScroll = () => {
    if (!frame) frame = window.requestAnimationFrame(update);
  };
  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  return {
    destroy() {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      nav.remove();
    }
  };
}

// kit/src/reveal.ts
var EASE_OUT = "cubic-bezier(0.16, 1, 0.3, 1)";
function splitWords(element) {
  const original = element.innerHTML;
  if (!element.hasAttribute("aria-label")) element.setAttribute("aria-label", (element.textContent ?? "").replace(/\s+/g, " ").trim());
  const nodes = Array.from(element.childNodes);
  element.textContent = "";
  const words = [];
  for (const node of nodes) {
    if (node.nodeType !== Node.TEXT_NODE) {
      element.appendChild(node);
      continue;
    }
    for (const piece of (node.textContent ?? "").split(/(\s+)/)) {
      if (piece === "") continue;
      if (piece.trim() === "") {
        element.appendChild(document.createTextNode(piece));
        continue;
      }
      const mask = document.createElement("span");
      mask.className = "kit-word";
      const inner = document.createElement("span");
      inner.setAttribute("aria-hidden", "true");
      inner.textContent = piece;
      mask.appendChild(inner);
      element.appendChild(mask);
      words.push(inner);
    }
  }
  return {
    words,
    restore: () => {
      element.innerHTML = original;
    }
  };
}
function mountReveal(options) {
  const root = options.root ?? document;
  const elements = options.tier === "off" ? [] : Array.from(root.querySelectorAll(options.selector ?? "[data-kit-reveal]"));
  const restores = [];
  const byElement = /* @__PURE__ */ new Map();
  const subtle = options.tier === "subtle";
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        const element = entry.target;
        const words = byElement.get(element) ?? [];
        void (options.after ?? Promise.resolve()).then(() => {
          words.forEach((word, index) => {
            word.animate(subtle ? [{ opacity: 0 }, { opacity: 1 }] : [{ transform: "translateY(115%)" }, { transform: "translateY(0)" }], {
              duration: subtle ? 300 : 800,
              delay: subtle ? 0 : index * 50,
              easing: EASE_OUT,
              fill: "backwards"
            });
          });
          element.setAttribute("data-kit-revealed", "");
        });
      }
    },
    { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
  );
  for (const element of elements) {
    const { words, restore } = splitWords(element);
    restores.push(restore);
    byElement.set(element, words);
    element.setAttribute("data-kit-ready", "");
    observer.observe(element);
  }
  return {
    destroy() {
      observer.disconnect();
      restores.forEach((restore) => restore());
      for (const element of elements) {
        element.removeAttribute("data-kit-ready");
        element.removeAttribute("data-kit-revealed");
      }
    }
  };
}

// node_modules/.pnpm/lenis@1.3.26_react@19.2.0/node_modules/lenis/dist/lenis.mjs
var version = "1.3.26";
function clamp2(min, input, max) {
  return Math.max(min, Math.min(input, max));
}
function lerp2(x, y, t) {
  return (1 - t) * x + t * y;
}
function damp(x, y, lambda, deltaTime) {
  return lerp2(x, y, 1 - Math.exp(-lambda * deltaTime));
}
function modulo(n, d) {
  return (n % d + d) % d;
}
var Animate = class {
  constructor() {
    __publicField(this, "isRunning", false);
    __publicField(this, "value", 0);
    __publicField(this, "from", 0);
    __publicField(this, "to", 0);
    __publicField(this, "currentTime", 0);
    __publicField(this, "lerp");
    __publicField(this, "duration");
    __publicField(this, "easing");
    __publicField(this, "onUpdate");
  }
  /**
  * Advance the animation by the given delta time
  *
  * @param deltaTime - The time in seconds to advance the animation
  */
  advance(deltaTime) {
    if (!this.isRunning) return;
    let completed = false;
    if (this.duration && this.easing) {
      this.currentTime += deltaTime;
      const linearProgress = clamp2(0, this.currentTime / this.duration, 1);
      completed = linearProgress >= 1;
      const easedProgress = completed ? 1 : this.easing(linearProgress);
      this.value = this.from + (this.to - this.from) * easedProgress;
    } else if (this.lerp) {
      this.value = damp(this.value, this.to, this.lerp * 60, deltaTime);
      if (Math.round(this.value) === Math.round(this.to)) {
        this.value = this.to;
        completed = true;
      }
    } else {
      this.value = this.to;
      completed = true;
    }
    if (completed) this.stop();
    this.onUpdate?.(this.value, completed);
  }
  /** Stop the animation */
  stop() {
    this.isRunning = false;
  }
  /**
  * Set up the animation from a starting value to an ending value
  * with optional parameters for lerping, duration, easing, and onUpdate callback
  *
  * @param from - The starting value
  * @param to - The ending value
  * @param options - Options for the animation
  */
  fromTo(from, to, { lerp: lerp3, duration, easing, onStart, onUpdate }) {
    this.from = this.value = from;
    this.to = to;
    this.lerp = lerp3;
    this.duration = duration;
    this.easing = easing;
    this.currentTime = 0;
    this.isRunning = true;
    onStart?.();
    this.onUpdate = onUpdate;
  }
};
function debounce(callback, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = void 0;
      callback.apply(this, args);
    }, delay);
  };
}
var Dimensions = class {
  constructor(wrapper, content, { autoResize = true, debounce: debounceValue = 250 } = {}) {
    __publicField(this, "width", 0);
    __publicField(this, "height", 0);
    __publicField(this, "scrollHeight", 0);
    __publicField(this, "scrollWidth", 0);
    __publicField(this, "debouncedResize");
    __publicField(this, "wrapperResizeObserver");
    __publicField(this, "contentResizeObserver");
    __publicField(this, "resize", () => {
      this.onWrapperResize();
      this.onContentResize();
    });
    __publicField(this, "onWrapperResize", () => {
      if (this.wrapper instanceof Window) {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
      } else {
        this.width = this.wrapper.clientWidth;
        this.height = this.wrapper.clientHeight;
      }
    });
    __publicField(this, "onContentResize", () => {
      if (this.wrapper instanceof Window) {
        this.scrollHeight = this.content.scrollHeight;
        this.scrollWidth = this.content.scrollWidth;
      } else {
        this.scrollHeight = this.wrapper.scrollHeight;
        this.scrollWidth = this.wrapper.scrollWidth;
      }
    });
    this.wrapper = wrapper;
    this.content = content;
    if (autoResize) {
      this.debouncedResize = debounce(this.resize, debounceValue);
      if (this.wrapper instanceof Window) window.addEventListener("resize", this.debouncedResize);
      else {
        this.wrapperResizeObserver = new ResizeObserver(this.debouncedResize);
        this.wrapperResizeObserver.observe(this.wrapper);
      }
      this.contentResizeObserver = new ResizeObserver(this.debouncedResize);
      this.contentResizeObserver.observe(this.content);
    }
    this.resize();
  }
  destroy() {
    this.wrapperResizeObserver?.disconnect();
    this.contentResizeObserver?.disconnect();
    if (this.wrapper === window && this.debouncedResize) window.removeEventListener("resize", this.debouncedResize);
  }
  get limit() {
    return {
      x: this.scrollWidth - this.width,
      y: this.scrollHeight - this.height
    };
  }
};
var Emitter = class {
  constructor() {
    __publicField(this, "events", {});
  }
  /**
  * Emit an event with the given data
  * @param event Event name
  * @param args Data to pass to the event handlers
  */
  emit(event, ...args) {
    const callbacks = this.events[event] || [];
    for (let i = 0, length = callbacks.length; i < length; i++) callbacks[i]?.(...args);
  }
  /**
  * Add a callback to the event
  * @param event Event name
  * @param cb Callback function
  * @returns Unsubscribe function
  */
  on(event, cb) {
    if (this.events[event]) this.events[event].push(cb);
    else this.events[event] = [cb];
    return () => {
      this.events[event] = this.events[event]?.filter((i) => cb !== i);
    };
  }
  /**
  * Remove a callback from the event
  * @param event Event name
  * @param callback Callback function
  */
  off(event, callback) {
    this.events[event] = this.events[event]?.filter((i) => callback !== i);
  }
  /**
  * Remove all event listeners and clean up
  */
  destroy() {
    this.events = {};
  }
};
var LINE_HEIGHT = 100 / 6;
var listenerOptions = { passive: false };
function getDeltaMultiplier(deltaMode, size) {
  if (deltaMode === 1) return LINE_HEIGHT;
  if (deltaMode === 2) return size;
  return 1;
}
var VirtualScroll = class {
  constructor(element, options = {
    wheelMultiplier: 1,
    touchMultiplier: 1
  }) {
    __publicField(this, "touchStart", {
      x: 0,
      y: 0
    });
    __publicField(this, "lastDelta", {
      x: 0,
      y: 0
    });
    __publicField(this, "window", {
      width: 0,
      height: 0
    });
    __publicField(this, "emitter", new Emitter());
    /**
    * Event handler for 'touchstart' event
    *
    * @param event Touch event
    */
    __publicField(this, "onTouchStart", (event) => {
      const { clientX, clientY } = event.targetTouches ? event.targetTouches[0] : event;
      this.touchStart.x = clientX;
      this.touchStart.y = clientY;
      this.lastDelta = {
        x: 0,
        y: 0
      };
      this.emitter.emit("scroll", {
        deltaX: 0,
        deltaY: 0,
        event
      });
    });
    /** Event handler for 'touchmove' event */
    __publicField(this, "onTouchMove", (event) => {
      const { clientX, clientY } = event.targetTouches ? event.targetTouches[0] : event;
      const deltaX = -(clientX - this.touchStart.x) * this.options.touchMultiplier;
      const deltaY = -(clientY - this.touchStart.y) * this.options.touchMultiplier;
      this.touchStart.x = clientX;
      this.touchStart.y = clientY;
      this.lastDelta = {
        x: deltaX,
        y: deltaY
      };
      this.emitter.emit("scroll", {
        deltaX,
        deltaY,
        event
      });
    });
    __publicField(this, "onTouchEnd", (event) => {
      this.emitter.emit("scroll", {
        deltaX: this.lastDelta.x,
        deltaY: this.lastDelta.y,
        event
      });
    });
    /** Event handler for 'wheel' event */
    __publicField(this, "onWheel", (event) => {
      let { deltaX, deltaY, deltaMode } = event;
      const multiplierX = getDeltaMultiplier(deltaMode, this.window.width);
      const multiplierY = getDeltaMultiplier(deltaMode, this.window.height);
      deltaX *= multiplierX;
      deltaY *= multiplierY;
      deltaX *= this.options.wheelMultiplier;
      deltaY *= this.options.wheelMultiplier;
      this.emitter.emit("scroll", {
        deltaX,
        deltaY,
        event
      });
    });
    __publicField(this, "onWindowResize", () => {
      this.window = {
        width: window.innerWidth,
        height: window.innerHeight
      };
    });
    this.element = element;
    this.options = options;
    window.addEventListener("resize", this.onWindowResize);
    this.onWindowResize();
    this.element.addEventListener("wheel", this.onWheel, listenerOptions);
    this.element.addEventListener("touchstart", this.onTouchStart, listenerOptions);
    this.element.addEventListener("touchmove", this.onTouchMove, listenerOptions);
    this.element.addEventListener("touchend", this.onTouchEnd, listenerOptions);
  }
  /**
  * Add an event listener for the given event and callback
  *
  * @param event Event name
  * @param callback Callback function
  */
  on(event, callback) {
    return this.emitter.on(event, callback);
  }
  /** Remove all event listeners and clean up */
  destroy() {
    this.emitter.destroy();
    window.removeEventListener("resize", this.onWindowResize);
    this.element.removeEventListener("wheel", this.onWheel, listenerOptions);
    this.element.removeEventListener("touchstart", this.onTouchStart, listenerOptions);
    this.element.removeEventListener("touchmove", this.onTouchMove, listenerOptions);
    this.element.removeEventListener("touchend", this.onTouchEnd, listenerOptions);
  }
};
var defaultEasing = (t) => Math.min(1, 1.001 - 2 ** (-10 * t));
var Lenis = class {
  constructor({ wrapper = window, content = document.documentElement, eventsTarget = wrapper, smoothWheel = true, syncTouch = false, syncTouchLerp = 0.075, touchInertiaExponent = 1.7, duration, easing, lerp: lerp3 = 0.1, infinite = false, orientation = "vertical", gestureOrientation = orientation === "horizontal" ? "both" : "vertical", touchMultiplier = 1, wheelMultiplier = 1, autoResize = true, prevent, virtualScroll, overscroll = true, autoRaf = false, anchors = false, autoToggle = false, allowNestedScroll = false, __experimental__naiveDimensions = false, naiveDimensions = __experimental__naiveDimensions, stopInertiaOnNavigate = false, respectReducedMotion = true } = {}) {
    __publicField(this, "_isScrolling", false);
    __publicField(this, "_isStopped", false);
    __publicField(this, "_isLocked", false);
    __publicField(this, "_preventNextNativeScrollEvent", false);
    __publicField(this, "_resetVelocityTimeout", null);
    __publicField(this, "_rafId", null);
    __publicField(this, "_isDraggingSelection", false);
    __publicField(this, "reducedMotionMediaQuery", window.matchMedia("(prefers-reduced-motion: reduce)"));
    /**
    * Whether or not the user is touching the screen
    */
    __publicField(this, "isTouching");
    /**
    * Whether or not the device is running iOS
    */
    __publicField(this, "isIos");
    /**
    * The time in ms since the lenis instance was created
    */
    __publicField(this, "time", 0);
    /**
    * User data that will be forwarded through the scroll event
    *
    * @example
    * lenis.scrollTo(100, {
    *   userData: {
    *     foo: 'bar'
    *   }
    * })
    */
    __publicField(this, "userData", {});
    /**
    * The last velocity of the scroll
    */
    __publicField(this, "lastVelocity", 0);
    /**
    * The current velocity of the scroll
    */
    __publicField(this, "velocity", 0);
    /**
    * The direction of the scroll
    */
    __publicField(this, "direction", 0);
    /**
    * The options passed to the lenis instance
    */
    __publicField(this, "options");
    /**
    * The target scroll value
    */
    __publicField(this, "targetScroll");
    /**
    * The animated scroll value
    */
    __publicField(this, "animatedScroll");
    __publicField(this, "animate", new Animate());
    __publicField(this, "emitter", new Emitter());
    __publicField(this, "dimensions");
    __publicField(this, "virtualScroll");
    __publicField(this, "onScrollEnd", (e) => {
      if (!(e instanceof CustomEvent)) {
        if (this.isScrolling === "smooth" || this.isScrolling === false) e.stopPropagation();
      }
    });
    __publicField(this, "dispatchScrollendEvent", () => {
      this.options.wrapper.dispatchEvent(new CustomEvent("scrollend", {
        bubbles: this.options.wrapper === window,
        detail: { lenisScrollEnd: true }
      }));
    });
    __publicField(this, "onTransitionEnd", (event) => {
      if (event.propertyName?.includes("overflow") && event.target === this.rootElement) this.checkOverflow();
    });
    __publicField(this, "onClick", (event) => {
      const linkElementsUrls = event.composedPath().filter((node) => node instanceof HTMLAnchorElement && node.href).map((element) => new URL(element.href));
      const currentUrl = new URL(window.location.href);
      if (this.options.anchors) {
        const anchorElementUrl = linkElementsUrls.find((targetUrl) => currentUrl.host === targetUrl.host && currentUrl.pathname === targetUrl.pathname && targetUrl.hash);
        if (anchorElementUrl) {
          const options = typeof this.options.anchors === "object" && this.options.anchors ? this.options.anchors : void 0;
          const target = decodeURIComponent(anchorElementUrl.hash);
          this.scrollTo(target, options);
          return;
        }
      }
      if (this.options.stopInertiaOnNavigate) {
        if (linkElementsUrls.some((targetUrl) => currentUrl.host === targetUrl.host && currentUrl.pathname !== targetUrl.pathname)) {
          this.reset();
          return;
        }
      }
    });
    __publicField(this, "onPointerDown", (event) => {
      if (event.button === 1) this.reset();
    });
    __publicField(this, "onVirtualScroll", (data) => {
      if (typeof this.options.virtualScroll === "function" && this.options.virtualScroll(data) === false) return;
      const { deltaX, deltaY, event } = data;
      this.emitter.emit("virtual-scroll", {
        deltaX,
        deltaY,
        event
      });
      if (event.ctrlKey) return;
      if (event.lenisStopPropagation) return;
      const isTouch = event.type.includes("touch");
      const isWheel = event.type.includes("wheel");
      if (isTouch && this.isIos) {
        if (event.type === "touchstart") this._isDraggingSelection = this.isTouchOnSelectionHandle(event);
        if (this._isDraggingSelection) {
          if (event.type === "touchend") this._isDraggingSelection = false;
          return;
        }
      }
      this.isTouching = event.type === "touchstart" || event.type === "touchmove";
      const isClickOrTap = deltaX === 0 && deltaY === 0;
      if (this.options.syncTouch && isTouch && event.type === "touchstart" && isClickOrTap && !this.isStopped && !this.isLocked) {
        this.reset();
        return;
      }
      const isUnknownGesture = this.options.gestureOrientation === "vertical" && deltaY === 0 || this.options.gestureOrientation === "horizontal" && deltaX === 0;
      if (isClickOrTap || isUnknownGesture) return;
      let composedPath = event.composedPath();
      composedPath = composedPath.slice(0, composedPath.indexOf(this.rootElement));
      const prevent = this.options.prevent;
      const gestureOrientation = Math.abs(deltaX) >= Math.abs(deltaY) ? "horizontal" : "vertical";
      if (composedPath.find((node) => node instanceof HTMLElement && (typeof prevent === "function" && prevent?.(node) || node.hasAttribute?.("data-lenis-prevent") || gestureOrientation === "vertical" && node.hasAttribute?.("data-lenis-prevent-vertical") || gestureOrientation === "horizontal" && node.hasAttribute?.("data-lenis-prevent-horizontal") || isTouch && node.hasAttribute?.("data-lenis-prevent-touch") || isWheel && node.hasAttribute?.("data-lenis-prevent-wheel") || this.options.allowNestedScroll && this.hasNestedScroll(node, {
        deltaX,
        deltaY
      })))) return;
      if (this.isStopped || this.isLocked) {
        if (event.cancelable) event.preventDefault();
        return;
      }
      if (!(this.options.syncTouch && isTouch || this.options.smoothWheel && isWheel)) {
        this.isScrolling = "native";
        this.animate.stop();
        event.lenisStopPropagation = true;
        return;
      }
      let delta = deltaY;
      if (this.options.gestureOrientation === "both") delta = Math.abs(deltaY) > Math.abs(deltaX) ? deltaY : deltaX;
      else if (this.options.gestureOrientation === "horizontal") delta = deltaX;
      if (!this.options.overscroll || this.options.infinite || this.options.wrapper !== window && this.limit > 0 && (this.animatedScroll > 0 && this.animatedScroll < this.limit || this.animatedScroll === 0 && deltaY > 0 || this.animatedScroll === this.limit && deltaY < 0)) event.lenisStopPropagation = true;
      if (event.cancelable) event.preventDefault();
      const isSyncTouch = isTouch && this.options.syncTouch;
      const hasTouchInertia = isTouch && event.type === "touchend";
      if (hasTouchInertia) delta = Math.sign(delta) * Math.abs(this.velocity) ** this.options.touchInertiaExponent;
      this.scrollTo(this.targetScroll + delta, {
        programmatic: false,
        ...isSyncTouch ? { lerp: hasTouchInertia ? this.options.syncTouchLerp : 1 } : {
          lerp: this.options.lerp,
          duration: this.options.duration,
          easing: this.options.easing
        }
      });
    });
    __publicField(this, "onNativeScroll", () => {
      if (this._resetVelocityTimeout !== null) {
        clearTimeout(this._resetVelocityTimeout);
        this._resetVelocityTimeout = null;
      }
      if (this._preventNextNativeScrollEvent) {
        this._preventNextNativeScrollEvent = false;
        return;
      }
      if (this.isScrolling === false || this.isScrolling === "native") {
        const lastScroll = this.animatedScroll;
        this.animatedScroll = this.targetScroll = this.actualScroll;
        this.lastVelocity = this.velocity;
        this.velocity = this.animatedScroll - lastScroll;
        this.direction = Math.sign(this.animatedScroll - lastScroll);
        if (!this.isStopped) this.isScrolling = "native";
        this.emit();
        if (this.velocity !== 0) this._resetVelocityTimeout = setTimeout(() => {
          this.lastVelocity = this.velocity;
          this.velocity = 0;
          this.isScrolling = false;
          this.emit();
        }, 400);
      }
    });
    /**
    * RequestAnimationFrame for lenis
    *
    * @param time The time in ms from an external clock like `requestAnimationFrame` or Tempus
    */
    __publicField(this, "raf", (time) => {
      const deltaTime = time - (this.time || time);
      this.time = time;
      this.animate.advance(deltaTime * 1e-3);
      if (this.options.autoRaf) this._rafId = requestAnimationFrame(this.raf);
    });
    window.lenisVersion = version;
    if (!window.lenis) window.lenis = {};
    window.lenis.version = version;
    if (orientation === "horizontal") window.lenis.horizontal = true;
    if (syncTouch === true) window.lenis.touch = true;
    this.isIos = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
    if (!wrapper || wrapper === document.documentElement) wrapper = window;
    if (typeof duration === "number" && typeof easing !== "function") easing = defaultEasing;
    else if (typeof easing === "function" && typeof duration !== "number") duration = 1;
    this.options = {
      wrapper,
      content,
      eventsTarget,
      smoothWheel,
      syncTouch,
      syncTouchLerp,
      touchInertiaExponent,
      duration,
      easing,
      lerp: lerp3,
      infinite,
      gestureOrientation,
      orientation,
      touchMultiplier,
      wheelMultiplier,
      autoResize,
      prevent,
      virtualScroll,
      overscroll,
      autoRaf,
      anchors,
      autoToggle,
      allowNestedScroll,
      naiveDimensions,
      stopInertiaOnNavigate,
      respectReducedMotion
    };
    this.dimensions = new Dimensions(wrapper, content, { autoResize });
    this.updateClassName();
    this.targetScroll = this.animatedScroll = this.actualScroll;
    this.options.wrapper.addEventListener("scroll", this.onNativeScroll);
    this.options.wrapper.addEventListener("scrollend", this.onScrollEnd, { capture: true });
    if (this.options.anchors || this.options.stopInertiaOnNavigate) this.options.wrapper.addEventListener("click", this.onClick);
    this.options.wrapper.addEventListener("pointerdown", this.onPointerDown);
    this.virtualScroll = new VirtualScroll(eventsTarget, {
      touchMultiplier,
      wheelMultiplier
    });
    this.virtualScroll.on("scroll", this.onVirtualScroll);
    if (this.options.autoToggle) {
      this.checkOverflow();
      this.rootElement.addEventListener("transitionend", this.onTransitionEnd);
    }
    if (this.options.autoRaf) this._rafId = requestAnimationFrame(this.raf);
  }
  /**
  * Destroy the lenis instance, remove all event listeners and clean up the class name
  */
  destroy() {
    this.emitter.destroy();
    this.options.wrapper.removeEventListener("scroll", this.onNativeScroll);
    this.options.wrapper.removeEventListener("scrollend", this.onScrollEnd, { capture: true });
    this.options.wrapper.removeEventListener("pointerdown", this.onPointerDown);
    if (this.options.anchors || this.options.stopInertiaOnNavigate) this.options.wrapper.removeEventListener("click", this.onClick);
    this.virtualScroll.destroy();
    this.dimensions.destroy();
    this.cleanUpClassName();
    if (this._rafId) cancelAnimationFrame(this._rafId);
  }
  on(event, callback) {
    return this.emitter.on(event, callback);
  }
  off(event, callback) {
    return this.emitter.off(event, callback);
  }
  get overflow() {
    const property = this.isHorizontal ? "overflow-x" : "overflow-y";
    return getComputedStyle(this.rootElement)[property];
  }
  checkOverflow() {
    if (["hidden", "clip"].includes(this.overflow)) this.internalStop();
    else this.internalStart();
  }
  setScroll(scroll) {
    if (this.isHorizontal) this.options.wrapper.scrollTo({
      left: scroll,
      behavior: "instant"
    });
    else this.options.wrapper.scrollTo({
      top: scroll,
      behavior: "instant"
    });
  }
  isTouchOnSelectionHandle(event) {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || selection.rangeCount === 0) return false;
    const touch = event.targetTouches[0] ?? event.changedTouches[0];
    if (!touch) return false;
    const rects = selection.getRangeAt(0).getClientRects();
    if (rects.length === 0) return false;
    const first = rects[0];
    const last = rects[rects.length - 1];
    const HANDLE_RADIUS = 40;
    const nearStart = Math.hypot(touch.clientX - first.left, touch.clientY - first.top) <= HANDLE_RADIUS;
    const nearEnd = Math.hypot(touch.clientX - last.right, touch.clientY - last.bottom) <= HANDLE_RADIUS;
    return nearStart || nearEnd;
  }
  /**
  * Force lenis to recalculate the dimensions
  */
  resize() {
    this.dimensions.resize();
    this.animatedScroll = this.targetScroll = this.actualScroll;
    this.emit();
  }
  emit() {
    this.emitter.emit("scroll", this);
  }
  reset() {
    this.isLocked = false;
    this.isScrolling = false;
    this.animatedScroll = this.targetScroll = this.actualScroll;
    this.lastVelocity = this.velocity = 0;
    this.animate.stop();
  }
  /**
  * Start lenis scroll after it has been stopped
  */
  start() {
    if (!this.isStopped) return;
    if (this.options.autoToggle) {
      this.rootElement.style.removeProperty("overflow");
      return;
    }
    this.internalStart();
  }
  internalStart() {
    if (!this.isStopped) return;
    this.reset();
    this.isStopped = false;
    this.emit();
  }
  /**
  * Stop lenis scroll
  */
  stop() {
    if (this.isStopped) return;
    if (this.options.autoToggle) {
      this.rootElement.style.setProperty("overflow", "clip");
      return;
    }
    this.internalStop();
  }
  internalStop() {
    if (this.isStopped) return;
    this.reset();
    this.isStopped = true;
    this.emit();
  }
  /**
  * Scroll to a target value
  *
  * @param target The target value to scroll to
  * @param options The options for the scroll
  *
  * @example
  * lenis.scrollTo(100, {
  *   offset: 100,
  *   duration: 1,
  *   easing: (t) => 1 - Math.cos((t * Math.PI) / 2),
  *   lerp: 0.1,
  *   onStart: () => {
  *     console.log('onStart')
  *   },
  *   onComplete: () => {
  *     console.log('onComplete')
  *   },
  * })
  */
  scrollTo(_target, { offset = 0, immediate = false, lock = false, programmatic = true, lerp: lerp3 = programmatic ? this.options.lerp : void 0, duration = programmatic ? this.options.duration : void 0, easing = programmatic ? this.options.easing : void 0, onStart, onComplete, force = false, userData } = {}) {
    if (this.prefersReducedMotion) if (programmatic) immediate = true;
    else {
      lerp3 = 1;
      duration = void 0;
      easing = void 0;
    }
    if ((this.isStopped || this.isLocked) && !force) return;
    let target = _target;
    let adjustedOffset = offset;
    if (typeof target === "string" && [
      "top",
      "left",
      "start",
      "#"
    ].includes(target)) target = 0;
    else if (typeof target === "string" && [
      "bottom",
      "right",
      "end"
    ].includes(target)) target = this.limit;
    else {
      let node = null;
      if (typeof target === "string") {
        node = target.startsWith("#") ? document.getElementById(target.slice(1)) : document.querySelector(target);
        if (!node) if (target === "#top") target = 0;
        else console.warn("Lenis: Target not found", target);
      } else if (target instanceof HTMLElement && target?.nodeType) node = target;
      if (node) {
        if (this.options.wrapper !== window) {
          const wrapperRect = this.rootElement.getBoundingClientRect();
          adjustedOffset -= this.isHorizontal ? wrapperRect.left : wrapperRect.top;
        }
        const rect = node.getBoundingClientRect();
        const targetStyle = getComputedStyle(node);
        const scrollMargin = this.isHorizontal ? Number.parseFloat(targetStyle.scrollMarginLeft) : Number.parseFloat(targetStyle.scrollMarginTop);
        const containerStyle = getComputedStyle(this.rootElement);
        const scrollPadding = this.isHorizontal ? Number.parseFloat(containerStyle.scrollPaddingLeft) : Number.parseFloat(containerStyle.scrollPaddingTop);
        target = (this.isHorizontal ? rect.left : rect.top) + this.animatedScroll - (Number.isNaN(scrollMargin) ? 0 : scrollMargin) - (Number.isNaN(scrollPadding) ? 0 : scrollPadding);
      }
    }
    if (typeof target !== "number") return;
    target += adjustedOffset;
    if (this.options.infinite) {
      if (programmatic) {
        this.targetScroll = this.animatedScroll = this.scroll;
        const distance = target - this.animatedScroll;
        if (distance > this.limit / 2) target -= this.limit;
        else if (distance < -this.limit / 2) target += this.limit;
      }
    } else target = clamp2(0, target, this.limit);
    if (target === this.targetScroll) {
      onStart?.(this);
      onComplete?.(this);
      return;
    }
    this.userData = userData ?? {};
    if (immediate) {
      this.animatedScroll = this.targetScroll = target;
      this.setScroll(this.scroll);
      this.reset();
      this.preventNextNativeScrollEvent();
      this.emit();
      onComplete?.(this);
      this.userData = {};
      requestAnimationFrame(() => {
        this.dispatchScrollendEvent();
      });
      return;
    }
    if (!programmatic) this.targetScroll = target;
    if (typeof duration === "number" && typeof easing !== "function") easing = defaultEasing;
    else if (typeof easing === "function" && typeof duration !== "number") duration = 1;
    this.animate.fromTo(this.animatedScroll, target, {
      duration,
      easing,
      lerp: lerp3,
      onStart: () => {
        if (lock) this.isLocked = true;
        this.isScrolling = "smooth";
        onStart?.(this);
      },
      onUpdate: (value, completed) => {
        this.isScrolling = "smooth";
        this.lastVelocity = this.velocity;
        this.velocity = value - this.animatedScroll;
        this.direction = Math.sign(this.velocity);
        this.animatedScroll = value;
        this.setScroll(this.scroll);
        if (programmatic) this.targetScroll = value;
        if (!completed) this.emit();
        if (completed) {
          this.reset();
          this.emit();
          onComplete?.(this);
          this.userData = {};
          requestAnimationFrame(() => {
            this.dispatchScrollendEvent();
          });
          this.preventNextNativeScrollEvent();
        }
      }
    });
  }
  preventNextNativeScrollEvent() {
    this._preventNextNativeScrollEvent = true;
    requestAnimationFrame(() => {
      this._preventNextNativeScrollEvent = false;
    });
  }
  hasNestedScroll(node, { deltaX, deltaY }) {
    const time = Date.now();
    if (!node._lenis) node._lenis = {};
    const cache = node._lenis;
    let hasOverflowX;
    let hasOverflowY;
    let isScrollableX;
    let isScrollableY;
    let hasOverscrollBehaviorX;
    let hasOverscrollBehaviorY;
    let scrollWidth;
    let scrollHeight;
    let clientWidth;
    let clientHeight;
    if (time - (cache.time ?? 0) > 2e3) {
      cache.time = Date.now();
      const computedStyle = window.getComputedStyle(node);
      cache.computedStyle = computedStyle;
      hasOverflowX = [
        "auto",
        "overlay",
        "scroll"
      ].includes(computedStyle.overflowX);
      hasOverflowY = [
        "auto",
        "overlay",
        "scroll"
      ].includes(computedStyle.overflowY);
      hasOverscrollBehaviorX = ["auto"].includes(computedStyle.overscrollBehaviorX);
      hasOverscrollBehaviorY = ["auto"].includes(computedStyle.overscrollBehaviorY);
      cache.hasOverflowX = hasOverflowX;
      cache.hasOverflowY = hasOverflowY;
      if (!(hasOverflowX || hasOverflowY)) return false;
      scrollWidth = node.scrollWidth;
      scrollHeight = node.scrollHeight;
      clientWidth = node.clientWidth;
      clientHeight = node.clientHeight;
      isScrollableX = scrollWidth > clientWidth;
      isScrollableY = scrollHeight > clientHeight;
      cache.isScrollableX = isScrollableX;
      cache.isScrollableY = isScrollableY;
      cache.scrollWidth = scrollWidth;
      cache.scrollHeight = scrollHeight;
      cache.clientWidth = clientWidth;
      cache.clientHeight = clientHeight;
      cache.hasOverscrollBehaviorX = hasOverscrollBehaviorX;
      cache.hasOverscrollBehaviorY = hasOverscrollBehaviorY;
    } else {
      isScrollableX = cache.isScrollableX;
      isScrollableY = cache.isScrollableY;
      hasOverflowX = cache.hasOverflowX;
      hasOverflowY = cache.hasOverflowY;
      scrollWidth = cache.scrollWidth;
      scrollHeight = cache.scrollHeight;
      clientWidth = cache.clientWidth;
      clientHeight = cache.clientHeight;
      hasOverscrollBehaviorX = cache.hasOverscrollBehaviorX;
      hasOverscrollBehaviorY = cache.hasOverscrollBehaviorY;
    }
    if (!(hasOverflowX && isScrollableX || hasOverflowY && isScrollableY)) return false;
    const orientation = Math.abs(deltaX) >= Math.abs(deltaY) ? "horizontal" : "vertical";
    let scroll;
    let maxScroll;
    let delta;
    let hasOverflow;
    let isScrollable;
    let hasOverscrollBehavior;
    if (orientation === "horizontal") {
      scroll = Math.round(node.scrollLeft);
      maxScroll = scrollWidth - clientWidth;
      delta = deltaX;
      hasOverflow = hasOverflowX;
      isScrollable = isScrollableX;
      hasOverscrollBehavior = hasOverscrollBehaviorX;
    } else if (orientation === "vertical") {
      scroll = Math.round(node.scrollTop);
      maxScroll = scrollHeight - clientHeight;
      delta = deltaY;
      hasOverflow = hasOverflowY;
      isScrollable = isScrollableY;
      hasOverscrollBehavior = hasOverscrollBehaviorY;
    } else return false;
    if (!hasOverscrollBehavior && (scroll >= maxScroll || scroll <= 0)) return true;
    return (delta > 0 ? scroll < maxScroll : scroll > 0) && hasOverflow && isScrollable;
  }
  /**
  * The root element on which lenis is instanced
  */
  get rootElement() {
    return this.options.wrapper === window ? document.documentElement : this.options.wrapper;
  }
  /**
  * The limit which is the maximum scroll value
  */
  get limit() {
    if (this.options.naiveDimensions) {
      if (this.isHorizontal) return this.rootElement.scrollWidth - this.rootElement.clientWidth;
      return this.rootElement.scrollHeight - this.rootElement.clientHeight;
    }
    return this.dimensions.limit[this.isHorizontal ? "x" : "y"];
  }
  /**
  * Whether or not the scroll is horizontal
  */
  get isHorizontal() {
    return this.options.orientation === "horizontal";
  }
  /**
  * The actual scroll value
  */
  get actualScroll() {
    const wrapper = this.options.wrapper;
    return this.isHorizontal ? wrapper.scrollX ?? wrapper.scrollLeft : wrapper.scrollY ?? wrapper.scrollTop;
  }
  /**
  * The current scroll value
  */
  get scroll() {
    return this.options.infinite ? modulo(this.animatedScroll, this.limit) : this.animatedScroll;
  }
  /**
  * The progress of the scroll relative to the limit
  */
  get progress() {
    return this.limit === 0 ? 1 : this.scroll / this.limit;
  }
  /**
  * Current scroll state
  */
  get isScrolling() {
    return this._isScrolling;
  }
  set isScrolling(value) {
    if (this._isScrolling !== value) {
      this._isScrolling = value;
      this.updateClassName();
    }
  }
  /**
  * Check if lenis is stopped
  */
  get isStopped() {
    return this._isStopped;
  }
  set isStopped(value) {
    if (this._isStopped !== value) {
      this._isStopped = value;
      this.updateClassName();
    }
  }
  /**
  * Check if lenis is locked
  */
  get isLocked() {
    return this._isLocked;
  }
  set isLocked(value) {
    if (this._isLocked !== value) {
      this._isLocked = value;
      this.updateClassName();
    }
  }
  /**
  * Check if lenis is smooth scrolling
  */
  get isSmooth() {
    return this.isScrolling === "smooth";
  }
  /**
  * Whether the user prefers reduced motion and lenis is honoring it (see `respectReducedMotion` option)
  */
  get prefersReducedMotion() {
    return this.options.respectReducedMotion && this.reducedMotionMediaQuery.matches;
  }
  /**
  * The class name applied to the wrapper element
  */
  get className() {
    let className = "lenis";
    if (this.options.autoToggle) className += " lenis-autoToggle";
    if (this.isStopped) className += " lenis-stopped";
    if (this.isLocked) className += " lenis-locked";
    if (this.isScrolling) className += " lenis-scrolling";
    if (this.isScrolling === "smooth") className += " lenis-smooth";
    return className;
  }
  updateClassName() {
    this.cleanUpClassName();
    this.className.split(" ").forEach((className) => {
      this.rootElement.classList.add(className);
    });
  }
  cleanUpClassName() {
    for (const className of Array.from(this.rootElement.classList)) if (className === "lenis" || className.startsWith("lenis-")) this.rootElement.classList.remove(className);
  }
};

// kit/src/scroll.ts
function createSmoothScroll(win = window) {
  const lenis = new Lenis({ lerp: 0.09 });
  let frame = 0;
  const loop = (time) => {
    lenis.raf(time);
    frame = win.requestAnimationFrame(loop);
  };
  frame = win.requestAnimationFrame(loop);
  return {
    lenis,
    stop: () => lenis.stop(),
    start: () => lenis.start(),
    scrollTo: (target, offset = 0) => lenis.scrollTo(target, { offset, duration: 1.2 }),
    destroy: () => {
      win.cancelAnimationFrame(frame);
      lenis.destroy();
    }
  };
}
var MODAL_SELECTOR = 'dialog[open], [aria-modal="true"]';
function watchModals(onChange, doc = document) {
  let open = doc.querySelector(MODAL_SELECTOR) !== null;
  const check = () => {
    const now = doc.querySelector(MODAL_SELECTOR) !== null;
    if (now !== open) {
      open = now;
      onChange(open);
    }
  };
  const observer = new MutationObserver(check);
  observer.observe(doc.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ["open", "aria-modal"] });
  if (open) onChange(true);
  return () => observer.disconnect();
}

// kit/src/seal.ts
var EASE = "cubic-bezier(0.65, 0, 0.35, 1)";
var SPRING2 = "cubic-bezier(0.34, 1.56, 0.64, 1)";
var HARD_TIMEOUT_MS = 4e3;
var settle = (animation) => animation.finished.then(() => void 0, () => void 0);
function playSeal(options) {
  const overlay = document.createElement("div");
  overlay.className = "kit-seal";
  overlay.setAttribute("aria-hidden", "true");
  const inner = document.createElement("div");
  const mark = document.createElement("div");
  mark.className = "kit-seal-mark";
  mark.textContent = options.glyph ?? "\u547D";
  const tag = document.createElement("div");
  tag.className = "kit-seal-tag";
  tag.textContent = options.tagline ?? "";
  inner.append(mark, tag);
  overlay.append(inner);
  document.body.appendChild(overlay);
  let finished = false;
  let resolveLifting = () => void 0;
  let resolveDone = () => void 0;
  const lifting = new Promise((resolve) => resolveLifting = resolve);
  const done = new Promise((resolve) => resolveDone = resolve);
  const finish = () => {
    if (finished) return;
    finished = true;
    overlay.remove();
    resolveLifting();
    resolveDone();
  };
  window.setTimeout(finish, HARD_TIMEOUT_MS);
  const subtle = options.tier === "subtle";
  void (async () => {
    if (!subtle) {
      await Promise.all([
        settle(mark.animate([{ opacity: 0, transform: "scale(2.8) rotate(-16deg)" }, { opacity: 1, transform: "scale(1) rotate(-6deg)" }], { duration: 450, easing: SPRING2, fill: "forwards" })),
        settle(tag.animate([{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "none" }], { duration: 400, delay: 300, easing: EASE, fill: "backwards" }))
      ]);
    }
    await new Promise((resolve) => window.setTimeout(resolve, subtle ? 200 : 450));
    resolveLifting();
    await settle(overlay.animate([{ clipPath: "inset(0 0 0 0)" }, { clipPath: "inset(0 0 100% 0)" }], { duration: subtle ? 400 : 750, easing: EASE, fill: "forwards" }));
    finish();
  })();
  return { lifting, done };
}

// kit/src/theme.ts
var THEME_ATTRIBUTE = "data-kit-theme";
function resolveTheme(value) {
  return value === "night" ? "night" : "paper";
}
function applyTheme(theme, root = document.documentElement) {
  const before = root.getAttribute(THEME_ATTRIBUTE);
  if (theme === "night") root.setAttribute(THEME_ATTRIBUTE, "night");
  else root.removeAttribute(THEME_ATTRIBUTE);
  return () => {
    if (before === null) root.removeAttribute(THEME_ATTRIBUTE);
    else root.setAttribute(THEME_ATTRIBUTE, before);
  };
}

// kit/src/transition.ts
var EASE2 = "cubic-bezier(0.65, 0, 0.35, 1)";
var FLAG_KEY = "kit:cover";
var FLAG_MAX_AGE_MS = 1e4;
var FALLBACK_NAVIGATE_MS = 1500;
function safeStorage() {
  try {
    return window.sessionStorage;
  } catch {
    return void 0;
  }
}
var settle2 = (animation) => animation.finished.then(() => void 0, () => void 0);
function createTransitions(options) {
  const storage = options.storage ?? safeStorage();
  const count = window.innerWidth < 520 ? 8 : 12;
  const overlay = document.createElement("div");
  overlay.className = "kit-slats";
  overlay.setAttribute("aria-hidden", "true");
  overlay.hidden = true;
  const slats = Array.from({ length: count }, () => document.createElement("i"));
  overlay.append(...slats);
  document.body.appendChild(overlay);
  const delayFor = (index, fromCentre) => {
    const distance = Math.abs(index - (count - 1) / 2) / ((count - 1) / 2);
    return (fromCentre ? distance : 1 - distance) * 140;
  };
  const run = (direction) => {
    overlay.hidden = false;
    overlay.classList.add("is-covering");
    const animations = slats.map((slat, index) => {
      slat.style.transformOrigin = direction === "cover" ? "50% 100%" : "50% 0%";
      const keyframes = direction === "cover" ? [{ transform: "scaleY(0)" }, { transform: "scaleY(1)" }] : [{ transform: "scaleY(1)" }, { transform: "scaleY(0)" }];
      return slat.animate(keyframes, { duration: 480, delay: delayFor(index, direction === "cover"), easing: EASE2, fill: "forwards" });
    });
    return Promise.all(animations.map(settle2)).then(() => {
      if (direction === "reveal") reset();
    });
  };
  const reset = () => {
    slats.forEach((slat) => {
      slat.getAnimations().forEach((animation) => animation.cancel());
      slat.style.transform = "";
    });
    overlay.classList.remove("is-covering");
    overlay.hidden = true;
  };
  const showCovered = () => {
    overlay.hidden = false;
    overlay.classList.add("is-covering");
    slats.forEach((slat) => {
      slat.style.transform = "scaleY(1)";
    });
  };
  const onClick = (event) => {
    const anchor = event.target?.closest?.("a[href]");
    if (!anchor) return;
    const info = {
      href: anchor.href,
      currentHref: window.location.href,
      family: options.family,
      sameOriginPaths: options.sameOriginPaths,
      tier: options.tier,
      button: event.button,
      ctrl: event.ctrlKey,
      meta: event.metaKey,
      shift: event.shiftKey,
      alt: event.altKey,
      target: anchor.getAttribute("target"),
      download: anchor.hasAttribute("download"),
      defaultPrevented: event.defaultPrevented
    };
    if (!shouldCoverNavigation(info)) return;
    event.preventDefault();
    try {
      storage?.setItem(FLAG_KEY, String(Date.now()));
    } catch {
    }
    let navigated = false;
    const go = () => {
      if (navigated) return;
      navigated = true;
      window.location.assign(anchor.href);
    };
    void run("cover").then(go);
    window.setTimeout(go, FALLBACK_NAVIGATE_MS);
  };
  const onPageShow = (event) => {
    if (event.persisted) reset();
  };
  document.addEventListener("click", onClick, true);
  window.addEventListener("pageshow", onPageShow);
  const startedHere = () => {
    try {
      const stored = Number(storage?.getItem(FLAG_KEY));
      storage?.removeItem(FLAG_KEY);
      return Number.isFinite(stored) && stored > 0 && Date.now() - stored < FLAG_MAX_AGE_MS;
    } catch {
      return false;
    }
  };
  return {
    cover: () => run("cover"),
    reveal: () => run("reveal"),
    showCovered,
    prepareArrival() {
      const navType = performance.getEntriesByType("navigation")[0]?.type ?? "navigate";
      const plays = shouldRevealArrival({
        referrer: document.referrer,
        currentHref: window.location.href,
        family: options.family,
        navType,
        tier: options.tier,
        startedHere: startedHere()
      });
      if (plays) showCovered();
      return {
        plays,
        run: async () => {
          if (!plays) return;
          await new Promise((resolve) => window.requestAnimationFrame(() => resolve()));
          await run("reveal");
        }
      };
    },
    destroy() {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("pageshow", onPageShow);
      reset();
      overlay.remove();
    }
  };
}

// kit/src/version.ts
var KIT_VERSION = "0.5.0";

// kit/src/wash.ts
function mountWash(tier) {
  if (tier !== "full") return { destroy: () => void 0 };
  const layer = document.createElement("div");
  layer.className = "kit-wash-layer";
  layer.setAttribute("aria-hidden", "true");
  const blobs = [0, 1, 2].map(() => {
    const blob = document.createElement("div");
    blob.className = "kit-wash";
    layer.appendChild(blob);
    return blob;
  });
  document.body.prepend(layer);
  const travel = [-260, 200, -180];
  let frame = 0;
  const update = () => {
    frame = 0;
    const range = document.documentElement.scrollHeight - window.innerHeight;
    const progress = range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0;
    blobs.forEach((blob, index) => {
      blob.style.transform = `translate3d(0, ${(progress * travel[index]).toFixed(1)}px, 0)`;
    });
  };
  const onScroll = () => {
    if (!frame) frame = window.requestAnimationFrame(update);
  };
  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  return {
    destroy() {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      layer.remove();
    }
  };
}

// kit/src/keyframes.ts
function blendFrames(age, ages, hold = [0.38, 0.62]) {
  const last = ages.length - 1;
  if (last < 0) throw new Error("blendFrames needs at least one keyframe age");
  if (age <= ages[0]) return { from: 0, to: 0, t: 0 };
  if (age >= ages[last]) return { from: last, to: last, t: 0 };
  let i = 0;
  for (let k = 0; k < last; k++) if (age >= ages[k]) i = k;
  const raw = (age - ages[i]) / (ages[i + 1] - ages[i]);
  return { from: i, to: i + 1, t: smoothstep(seg(raw, hold[0], hold[1])) };
}

// kit/src/day-cycle.ts
function createDayCycle(options = {}) {
  const root = options.root ?? document.documentElement;
  const paintBody = options.paintBody ?? true;
  const bodyBefore = document.body.style.background;
  return {
    render(progress) {
      const state = dayState(progress);
      root.style.setProperty("--kit-sky", rgbString(state.sky));
      root.style.setProperty("--kit-fg", rgbString(state.fg));
      root.style.setProperty("--kit-fg-muted", rgbString(state.muted));
      if (paintBody) document.body.style.background = rgbString(state.sky);
      return state;
    },
    destroy() {
      root.style.removeProperty("--kit-sky");
      root.style.removeProperty("--kit-fg");
      root.style.removeProperty("--kit-fg-muted");
      if (paintBody) document.body.style.background = bodyBefore;
    }
  };
}

// kit/src/index.ts
function init(options = {}) {
  const tier = options.tier ?? detectTier();
  const finePointer = hasFinePointer();
  const restoreTheme = applyTheme(resolveTheme(options.theme));
  const on = (name) => options.effects?.[name] !== false;
  const family = [window.location.origin, ...options.family ?? []];
  const cleanups = [restoreTheme];
  const track = (mounted) => {
    if (mounted) cleanups.push(() => mounted.destroy());
  };
  const navType = performance.getEntriesByType("navigation")[0]?.type ?? "navigate";
  const transitions = tier !== "off" && on("transition") ? createTransitions({ family, tier, sameOriginPaths: options.transitionPaths }) : null;
  if (transitions) cleanups.push(() => transitions.destroy());
  const arrival = transitions?.prepareArrival() ?? null;
  const seal = !arrival?.plays && on("seal") && shouldPlaySeal(navType, tier, false) ? playSeal({ tier, glyph: options.seal?.glyph, tagline: options.seal?.tagline }) : null;
  document.documentElement.classList.remove("kit-pending");
  let ready = Promise.resolve();
  if (seal) ready = seal.lifting;
  else if (arrival?.plays) ready = arrival.run();
  let smooth = null;
  if (on("smooth") && tier === "full" && finePointer) {
    smooth = createSmoothScroll();
    const engine = smooth;
    cleanups.push(() => engine.destroy());
    cleanups.push(watchModals((open) => open ? engine.stop() : engine.start()));
  }
  if (on("wash")) track(mountWash(tier));
  if (on("reveal")) track(mountReveal({ tier, after: ready }));
  if (on("clock")) track(mountClock(options.locale ?? "vi"));
  if (on("progress")) track(mountProgress());
  let dots = null;
  const mountSectionDots = () => {
    dots?.destroy();
    dots = on("dots") ? mountDots({ tier, smooth: smooth ?? void 0 }) : null;
  };
  mountSectionDots();
  cleanups.push(() => dots?.destroy());
  if (on("magnetic")) track(mountMagnetic(tier, finePointer));
  if (on("dust")) track(mountDust(tier));
  if (on("drift")) track(mountDrift(tier, ready));
  if (on("life")) track(mountLife(tier, ready));
  track(mountCursor(tier, finePointer, options.effects?.cursor === true));
  let destroyed = false;
  const destroy = () => {
    if (destroyed) return;
    destroyed = true;
    stopWatching();
    cleanups.reverse().forEach((cleanup) => cleanup());
  };
  const stopWatching = watchReducedMotion(() => {
    if (detectTier() === "off") destroy();
  });
  const refresh = () => {
    if (!destroyed) mountSectionDots();
  };
  return { version: KIT_VERSION, tier, ready, smooth, transitions, refresh, destroy };
}
export {
  baziYear,
  blendFrames,
  clamp,
  createDayCycle,
  createSmoothScroll,
  createTransitions,
  dayState,
  detectTier,
  ganzhiYear,
  init,
  lerp,
  monthBranch,
  playSeal,
  resolveTheme,
  resolveTier,
  seg,
  shichen,
  skyColor,
  smoothstep,
  solarLongitude,
  solarTerm,
  splitWords,
  KIT_VERSION as version
};
