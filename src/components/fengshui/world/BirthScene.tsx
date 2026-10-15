"use client";

import { useEffect, useRef } from "react";
import { clamp, lerp, rgbString } from "@kit/color";
import { createDayCycle } from "@kit/day-cycle";
import { useFengShuiWorldCopy } from "@/components/fengshui/FengShuiLanguage";
import { elementColor } from "./elements";
import { drawGuidingStar, drawStarfield, makeStars } from "./scene-canvas";
import { easeToward, FRAME_AGES, LUCK_PILLARS, luckMarkX, pinProgress, SAMPLE_PILLARS, sceneFrame, sceneGeometry, starCurve, type SceneGeometry } from "./scene-math";
import { ScrollCue } from "./ScrollCue";
import { StaticLife } from "./StaticLife";
import { useWorldMode } from "./use-world-mode";

const frameSrc = (age: number): string => `/fengshui/char/age-${String(age).padStart(2, "0")}.webp`;

/** The scene that goes from night to paper while a star falls and becomes a person who grows old. */
export function BirthScene() {
  return useWorldMode() === "scroll" ? <ScrollScene /> : <StaticLife />;
}

function ScrollScene() {
  const copy = useFengShuiWorldCopy().scene;
  const wrapperRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const skyRef = useRef<HTMLCanvasElement>(null);
  const hazeRef = useRef<HTMLDivElement>(null);
  const inkRef = useRef<HTMLImageElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const sunRef = useRef<HTMLDivElement>(null);
  const baseRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const figureARef = useRef<HTMLImageElement>(null);
  const figureBRef = useRef<HTMLImageElement>(null);
  const starLabelRef = useRef<HTMLSpanElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<Array<HTMLDivElement | null>>([]);
  const sealRefs = useRef<Array<HTMLDivElement | null>>([]);
  const markRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const stage = stageRef.current;
    const canvas = skyRef.current;
    const haze = hazeRef.current;
    const ink = inkRef.current;
    const vignette = vignetteRef.current;
    const glow = glowRef.current;
    const sun = sunRef.current;
    const base = baseRef.current;
    const trail = trailRef.current;
    const shadow = shadowRef.current;
    const figureA = figureARef.current;
    const figureB = figureBRef.current;
    const starLabel = starLabelRef.current;
    const cue = cueRef.current;
    const ctx = canvas?.getContext("2d");
    if (!wrapper || !stage || !canvas || !ctx || !haze || !ink || !vignette || !glow || !sun || !base || !trail || !shadow || !figureA || !figureB || !starLabel || !cue) return;

    const dayCycle = createDayCycle({ paintBody: false, root: wrapper });
    const stars = makeStars(340);
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    let geometry: SceneGeometry = sceneGeometry(stage.clientWidth, stage.clientHeight);
    let curve = starCurve(geometry);
    let current = 0;
    let frameHandle = 0;
    let active = false;
    let preloaded = false;

    const setFrame = (element: HTMLImageElement, age: number) => {
      if (element.dataset.age === String(age)) return;
      element.dataset.age = String(age);
      element.src = frameSrc(age);
    };

    const preload = () => {
      if (preloaded) return;
      preloaded = true;
      for (const age of FRAME_AGES) {
        const image = new Image();
        image.decoding = "async";
        image.src = frameSrc(age);
      }
    };

    const paint = (progress: number, time: number) => {
      const frame = sceneFrame(progress, geometry);
      dayCycle.render(progress);

      haze.style.opacity = String(frame.nebulaOpacity);
      ink.style.opacity = String(frame.inkWashOpacity);
      vignette.style.opacity = String(frame.vignette);
      glow.style.opacity = String(frame.glow);

      ctx.clearRect(0, 0, geometry.width, geometry.height);
      drawStarfield(ctx, geometry.width, geometry.height, stars, time, frame.starfieldAlpha);
      drawGuidingStar(ctx, frame, curve, curve[3], 1 + 0.12 * Math.sin(time / 200));
      starLabel.style.transform = `translate(${frame.star.point.x + 16}px, ${frame.star.point.y - 12}px)`;
      starLabel.style.opacity = String(frame.star.labelOpacity);

      sun.style.width = `${frame.sun.size}px`;
      sun.style.height = `${frame.sun.size}px`;
      sun.style.top = `${frame.sun.top}px`;
      sun.style.background = rgbString(frame.sun.color);
      sun.style.opacity = String(frame.sun.opacity);
      sun.style.boxShadow = `0 0 90px 30px rgba(246,208,120,${frame.sun.glowAlpha.toFixed(2)})`;

      const [first, second, third] = textRefs.current;
      if (first) {
        first.style.opacity = String(frame.texts.first);
        first.style.transform = `translateY(${(-14 * (1 - frame.texts.first)).toFixed(1)}px)`;
      }
      // The cue leaves with the first line: once the star starts to fall the visitor has found out how to scroll.
      cue.style.opacity = String(frame.texts.first);
      if (second) second.style.opacity = String(frame.texts.second);
      if (third) third.style.opacity = String(frame.texts.third);
      frame.sealOpacity.forEach((opacity, index) => {
        const seal = sealRefs.current[index];
        if (!seal) return;
        seal.style.opacity = String(opacity);
        seal.style.transform = `translateY(${(14 * (1 - opacity)).toFixed(1)}px)`;
      });

      const figureHeight = clamp(geometry.height * 0.46, 240, 380);
      const scale = lerp(0.6, 1, frame.figureVisible) * (1 + 0.035 * Math.sin(Math.PI * frame.blend.t));
      const height = figureHeight * scale;
      const width = (height * 2) / 3;
      const bob = -Math.abs(Math.sin(frame.figureX / 15)) * 2.5 * clamp((frame.age - 1.5) / 3, 0, 1);
      const left = frame.figureX - width / 2;
      const top = geometry.groundY + 6 - height + bob;
      setFrame(figureA, FRAME_AGES[frame.blend.from]);
      setFrame(figureB, FRAME_AGES[frame.blend.to]);
      for (const [element, opacity] of [[figureA, 1 - frame.blend.t], [figureB, frame.blend.t]] as const) {
        element.style.width = `${width}px`;
        element.style.height = `${height}px`;
        element.style.transform = `translate(${left}px, ${top}px)`;
        element.style.opacity = String(frame.figureVisible * opacity);
      }
      shadow.style.width = `${width * 0.55}px`;
      shadow.style.transform = `translate(${frame.figureX - width * 0.275}px, ${geometry.groundY - 4}px)`;
      shadow.style.opacity = String(0.16 * frame.figureVisible);

      base.style.transform = `translate(${geometry.startX - 30}px, ${geometry.groundY}px)`;
      base.style.width = `${geometry.endX - geometry.startX + 60}px`;
      base.style.opacity = String(0.7 * frame.figureVisible);
      trail.style.transform = `translate(${geometry.startX}px, ${geometry.groundY}px)`;
      trail.style.width = `${Math.max(0, frame.figureX - geometry.startX)}px`;
      trail.style.opacity = String(frame.trailVisible);
      LUCK_PILLARS.forEach((pillar, index) => {
        const mark = markRefs.current[index];
        if (!mark) return;
        mark.style.transform = `translate(${luckMarkX(geometry, pillar.from)}px, ${geometry.groundY - 6}px)`;
        mark.style.opacity = String((frame.marksReached[index] ? 1 : 0) * frame.figureVisible);
      });
    };

    const resize = () => {
      const width = stage.clientWidth;
      const height = stage.clientHeight;
      geometry = sceneGeometry(width, height);
      curve = starCurve(geometry);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      paint(current, performance.now());
    };

    const frameLoop = (time: number) => {
      if (!active) {
        frameHandle = 0;
        return;
      }
      const box = wrapper.getBoundingClientRect();
      current = easeToward(current, pinProgress(box.top, box.height, window.innerHeight));
      paint(current, time);
      frameHandle = window.requestAnimationFrame(frameLoop);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        active = entries[0]?.isIntersecting ?? false;
        if (active) {
          preload();
          if (!frameHandle) frameHandle = window.requestAnimationFrame(frameLoop);
          return;
        }
        // Out of view: leave the scene in its first or last state, depending on which side the visitor is.
        current = wrapper.getBoundingClientRect().top < 0 ? 1 : 0;
        paint(current, performance.now());
      },
      { rootMargin: "100% 0px" },
    );
    observer.observe(wrapper);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(stage);
    resize();

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      if (frameHandle) window.cancelAnimationFrame(frameHandle);
      dayCycle.destroy();
    };
  }, []);

  return (
    <section ref={wrapperRef} className="fs-scene" data-kit-section="Cảnh sinh ra / Birth" aria-label={copy.label}>
      <div ref={stageRef} className="fs-scene-stage" role="img" aria-label={copy.label}>
        <div ref={hazeRef} className="fs-scene-haze" aria-hidden="true" />
        {/* eslint-disable-next-line @next/next/no-img-element -- decorative layers painted by the scroll loop */}
        <img ref={inkRef} className="fs-scene-nebula fs-scene-ink" src="/fengshui/nebula.webp" alt="" aria-hidden="true" />
        <div ref={vignetteRef} className="fs-scene-vignette" />
        <div ref={glowRef} className="fs-scene-glow" />
        <canvas ref={skyRef} className="fs-scene-sky" aria-hidden="true" />
        <div ref={sunRef} className="fs-scene-sun" />
        <div ref={baseRef} className="fs-scene-base" />
        <div ref={trailRef} className="fs-scene-trail" />
        {LUCK_PILLARS.map((pillar, index) => (
          <div
            key={pillar.han}
            ref={(element) => {
              markRefs.current[index] = element;
            }}
            className="fs-scene-mark"
          >
            <i />
            <span>
              {pillar.from}–{pillar.to} {copy.ageUnit}
            </span>
            <b className="fs-han">{pillar.han}</b>
          </div>
        ))}
        <div ref={shadowRef} className="fs-scene-shadow" />
        {/* eslint-disable-next-line @next/next/no-img-element -- frames are swapped by the scroll loop */}
        <img ref={figureARef} className="fs-scene-figure" alt="" aria-hidden="true" />
        {/* eslint-disable-next-line @next/next/no-img-element -- frames are swapped by the scroll loop */}
        <img ref={figureBRef} className="fs-scene-figure" alt="" aria-hidden="true" />
        <div className="fs-scene-seals">
          {SAMPLE_PILLARS.map((han, index) => {
            const [stem, branch] = han.split("");
            return (
              <div
                key={han}
                ref={(element) => {
                  sealRefs.current[index] = element;
                }}
                className="fs-scene-seal"
              >
                <small>{copy.pillarLabels[index]}</small>
                <b className="fs-han">
                  <span style={{ color: elementColor(stem) }}>{stem}</span>
                  <span style={{ color: elementColor(branch) }}>{branch}</span>
                </b>
              </div>
            );
          })}
        </div>
        <div
          ref={(element) => {
            textRefs.current[0] = element;
          }}
          className="fs-scene-text fs-scene-text-first"
        >
          <p>{copy.first}</p>
        </div>
        <div ref={cueRef} className="fs-scene-cue">
          <ScrollCue />
        </div>
        <div
          ref={(element) => {
            textRefs.current[1] = element;
          }}
          className="fs-scene-text"
        >
          <p>{copy.second}</p>
          <small>{copy.secondSmall}</small>
        </div>
        <div
          ref={(element) => {
            textRefs.current[2] = element;
          }}
          className="fs-scene-text"
        >
          <p>{copy.third}</p>
          <small>{copy.thirdSmall}</small>
        </div>
        <span ref={starLabelRef} className="fs-scene-starlabel">
          {copy.starLabel}
        </span>
      </div>
    </section>
  );
}
