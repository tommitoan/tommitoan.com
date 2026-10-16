import { describe, expect, it } from "vitest";
import { INK_NIGHT, NIGHT, PAPER } from "@kit/color";
import { SOLAR_TERMS_VI } from "@kit/solar";
import { arcPath, dayForLongitude, dayIndexOf, daysInYear, daysPerSecond, dialDay, dialState, isMonthOpener, JIE_INDEXES, longitudeAt, radialLabel, ringPoint, SOLAR_TERMS_HAN } from "./dial-math";
import { marqueeAdvance, marqueeSkew, sixtyCycle, smoothVelocity } from "./marquee-math";
import { ageAtWalk, bezier, easeToward, FRAME_AGES, LIFE_SPAN, luckMarkX, LUCK_PILLARS, pinProgress, sceneFrame, sceneGeometry, starCurve } from "./scene-math";
import { ringRotation, storyStep, storyView } from "./story-math";

const g = sceneGeometry(1200, 760);

describe("birth scene frame", () => {
  it("starts at night with the star in the sky and nobody on the ground", () => {
    const f = sceneFrame(0, g);
    expect(f.day.sky).toEqual(NIGHT);
    expect(f.star.point).toEqual(starCurve(g)[0]);
    expect(f.star.alpha).toBe(1);
    expect(f.figureVisible).toBe(0);
    expect(f.age).toBe(0);
    expect(f.blend).toEqual({ from: 0, to: 0, t: 0 });
    expect(f.texts.first).toBe(1);
    expect(f.sun.opacity).toBe(0);
    expect(f.marksReached.every((reached) => !reached)).toBe(true);
  });

  it("ends on paper with the elder at the end of the road", () => {
    const f = sceneFrame(1, g);
    expect(f.day.sky).toEqual(PAPER);
    expect(f.age).toBe(LIFE_SPAN);
    expect(f.figureX).toBeCloseTo(g.endX, 5);
    expect(f.blend).toEqual({ from: FRAME_AGES.length - 1, to: FRAME_AGES.length - 1, t: 0 });
    expect(f.texts.third).toBe(1);
    expect(f.texts.first).toBe(0);
    expect(f.nebulaOpacity).toBe(0);
    expect(f.inkWashOpacity).toBeCloseTo(0.16, 5);
    expect(f.marksReached.every(Boolean)).toBe(true);
  });

  it("ends on deep ink, not paper, in the dark look, and has no ink wash", () => {
    const f = sceneFrame(1, g, "dark");
    expect(f.day.sky).toEqual(INK_NIGHT);
    expect(f.day.textMix).toBe(0);
    expect(f.inkWashOpacity).toBe(0);
    expect(f.figureX).toBeCloseTo(g.endX, 5);
    // the beginning is the same night in both looks
    expect(sceneFrame(0, g, "dark").day.sky).toEqual(NIGHT);
    // the light look is the default and is unchanged
    expect(sceneFrame(1, g).day.sky).toEqual(PAPER);
    expect(sceneFrame(1, g, "light").inkWashOpacity).toBeCloseTo(0.16, 5);
  });

  it("the star lands where the figure starts, then melts into the newborn", () => {
    const landing = sceneFrame(0.44, g).star.point;
    expect(landing.x).toBeCloseTo(g.startX, 3);
    expect(landing.y).toBeCloseTo(g.groundY - 80, 3);
    expect(sceneFrame(0.53, g).star.alpha).toBe(0);
    expect(sceneFrame(0.46, g).figureVisible).toBe(0);
    expect(sceneFrame(0.56, g).figureVisible).toBe(1);
    expect(sceneFrame(0.5, g).star.halo).toBeGreaterThan(0);
  });

  it("clamps progress outside 0..1", () => {
    expect(sceneFrame(-3, g).progress).toBe(0);
    expect(sceneFrame(9, g).progress).toBe(1);
  });

  it("age and position only ever grow with progress, and the figure stays at the start until the walk begins", () => {
    let age = -1;
    let x = -1;
    for (let p = 0; p <= 1.0001; p += 0.01) {
      const f = sceneFrame(p, g);
      expect(f.age).toBeGreaterThanOrEqual(age);
      expect(f.figureX).toBeGreaterThanOrEqual(x - 1e-9);
      age = f.age;
      x = f.figureX;
    }
    expect(sceneFrame(0.62, g).age).toBe(0);
    expect(sceneFrame(0.62, g).figureX).toBeCloseTo(g.startX, 5);
  });

  it("the three captions do not overlap", () => {
    for (let p = 0; p <= 1.0001; p += 0.01) {
      const { first, second, third } = sceneFrame(p, g).texts;
      expect(Math.min(first, second)).toBeLessThan(0.5);
      expect(Math.min(second, third)).toBeLessThan(0.5);
      expect(Math.min(first, third)).toBeLessThan(0.5);
    }
  });

  it("luck pillar ticks light up as the figure reaches them", () => {
    const early = sceneFrame(0.7, g);
    const late = sceneFrame(0.95, g);
    const reached = (f: ReturnType<typeof sceneFrame>) => f.marksReached.filter(Boolean).length;
    expect(reached(late)).toBeGreaterThan(reached(early));
    expect(luckMarkX(g, LUCK_PILLARS[0].from)).toBeGreaterThan(g.startX);
    expect(luckMarkX(g, LIFE_SPAN)).toBeCloseTo(g.endX, 5);
  });

  it("bezier hits its end points and stays between them in x", () => {
    const curve = starCurve(g);
    expect(bezier(curve, 0)).toEqual(curve[0]);
    expect(bezier(curve, 1)).toEqual(curve[3]);
    expect(bezier(curve, -1)).toEqual(curve[0]);
  });
});

describe("pinned scroll helpers", () => {
  it("progress runs from 0 to 1 across the pinned range", () => {
    expect(pinProgress(500, 3000, 800)).toBe(0);
    expect(pinProgress(0, 3000, 800)).toBe(0);
    expect(pinProgress(-1100, 3000, 800)).toBeCloseTo(0.5, 6);
    expect(pinProgress(-2200, 3000, 800)).toBe(1);
    expect(pinProgress(-9000, 3000, 800)).toBe(1);
    expect(pinProgress(-10, 500, 800)).toBe(0);
  });

  it("easing approaches the target and snaps when close", () => {
    const first = easeToward(0, 1);
    expect(first).toBeGreaterThan(0);
    expect(first).toBeLessThan(1);
    expect(easeToward(0.9998, 1)).toBe(1);
    let v = 0;
    for (let i = 0; i < 200; i++) v = easeToward(v, 1);
    expect(v).toBe(1);
  });

  it("the story picks one of four steps and rotates the ring", () => {
    expect(storyStep(0, 4)).toBe(0);
    expect(storyStep(0.24, 4)).toBe(0);
    expect(storyStep(0.26, 4)).toBe(1);
    expect(storyStep(0.5, 4)).toBe(2);
    expect(storyStep(0.99, 4)).toBe(3);
    expect(storyStep(1, 4)).toBe(3);
    expect(storyStep(-1, 4)).toBe(0);
    expect(storyStep(0.5, 0)).toBe(0);
    expect(ringRotation(1)).toBe(270);
    expect(ringRotation(2)).toBe(270);
    expect(ringRotation(-1)).toBe(0);
  });
});

describe("solar-terms dial", () => {
  it("reads the term, month and year for 14 October 2026", () => {
    const s = dialState(2026, dayIndexOf(2026, 10, 14));
    expect(s.term).toEqual({ index: 13, name: "Hàn Lộ", han: "寒露" });
    expect(s.month.name).toBe("Tuất");
    expect(s.baziYear).toBe(2026);
    expect(s.pillar.han).toBe("丙午");
    expect(s.beforeLichun).toBe(false);
    expect(s.calendar).toEqual({ month: 10, day: 14 });
    expect(s.longitude).toBeGreaterThan(200);
    expect(s.longitude).toBeLessThan(202);
  });

  it("the year pillar is still last year's before Lichun", () => {
    const january = dialState(2026, dayIndexOf(2026, 1, 11));
    expect(january.baziYear).toBe(2025);
    expect(january.pillar.han).toBe("乙巳");
    expect(january.beforeLichun).toBe(true);
    expect(dialState(2026, dayIndexOf(2026, 2, 3)).beforeLichun).toBe(true);
    expect(dialState(2026, dayIndexOf(2026, 2, 4)).beforeLichun).toBe(false);
  });

  it("handles leap years and clamps the day index", () => {
    expect(daysInYear(2024)).toBe(366);
    expect(daysInYear(2026)).toBe(365);
    expect(daysInYear(2000)).toBe(366);
    expect(daysInYear(2100)).toBe(365);
    expect(dialState(2026, -5).dayIndex).toBe(0);
    expect(dialState(2026, 999).dayIndex).toBe(364);
    expect(dayIndexOf(2024, 12, 31)).toBe(365);
  });

  it("the ring has 24 Han names matching the Vietnamese ones and the 12 month-opening terms", () => {
    expect(SOLAR_TERMS_HAN).toHaveLength(24);
    expect(SOLAR_TERMS_VI).toHaveLength(24);
    expect(JIE_INDEXES.map((i) => SOLAR_TERMS_VI[i])).toEqual(["Lập Xuân", "Kinh Trập", "Thanh Minh", "Lập Hạ", "Mang Chủng", "Tiểu Thử", "Lập Thu", "Bạch Lộ", "Hàn Lộ", "Lập Đông", "Đại Tuyết", "Tiểu Hàn"]);
    expect(SOLAR_TERMS_HAN[21]).toBe("立春");
  });

  it("places longitudes on the ring counter-clockwise from the right", () => {
    const c = { x: 100, y: 100 };
    expect(ringPoint(0, 50, c)).toEqual({ x: 150, y: 100 });
    const top = ringPoint(90, 50, c);
    expect(top.x).toBeCloseTo(100, 6);
    expect(top.y).toBeCloseTo(50, 6);
    const left = ringPoint(180, 50, c);
    expect(left.x).toBeCloseTo(50, 6);
  });
});

describe("marquee", () => {
  it("lists sixty distinct pairs from Jia Zi to Gui Hai", () => {
    const cycle = sixtyCycle();
    expect(cycle).toHaveLength(60);
    expect(new Set(cycle).size).toBe(60);
    expect(cycle[0]).toBe("甲子");
    expect(cycle[59]).toBe("癸亥");
  });

  it("loops inside (-half, 0] in both directions", () => {
    let left = 0;
    let right = -100;
    for (let i = 0; i < 5000; i++) {
      left = marqueeAdvance(left, 1000, -1, 16, 0, false);
      right = marqueeAdvance(right, 1000, 1, 16, 0, false);
      expect(left).toBeLessThanOrEqual(0);
      expect(left).toBeGreaterThan(-1000);
      expect(right).toBeLessThanOrEqual(0);
      expect(right).toBeGreaterThan(-1000);
    }
    expect(marqueeAdvance(-10, 1000, -1, 16, 0, false)).toBeLessThan(-10);
    expect(marqueeAdvance(-500, 0, 1, 16, 0, true)).toBe(0);
  });

  it("scrolling speeds it up only on the full tier", () => {
    const calm = marqueeAdvance(-500, 1000, -1, 16, 0, true);
    const fast = marqueeAdvance(-500, 1000, -1, 16, 30, true);
    const subtle = marqueeAdvance(-500, 1000, -1, 16, 30, false);
    expect(fast).toBeLessThan(calm);
    expect(subtle).toBeCloseTo(marqueeAdvance(-500, 1000, -1, 16, 0, false), 9);
  });

  it("the slant follows the scroll speed, opposite per row, clamped, and is off outside the full tier", () => {
    expect(marqueeSkew(10, -1, true)).toBeGreaterThan(0);
    expect(marqueeSkew(10, 1, true)).toBeLessThan(0);
    expect(marqueeSkew(1000, -1, true)).toBe(14);
    expect(marqueeSkew(-1000, -1, true)).toBe(-14);
    expect(marqueeSkew(10, -1, false)).toBe(0);
    expect(smoothVelocity(0, 100)).toBeCloseTo(12, 6);
  });
});

describe("pinned solar-terms dial", () => {
  it("takes the Sun once round the year as the section scrolls", () => {
    expect(dialDay(0, 2026)).toBe(0);
    expect(dialDay(1, 2026)).toBe(364);
    expect(dialDay(1, 2028)).toBe(365);
    expect(dialDay(0.5, 2026)).toBe(182);
    expect(dialDay(-3, 2026)).toBe(0);
    expect(dialDay(9, 2026)).toBe(364);
  });

  it("passes every one of the 24 terms between the first and the last day", () => {
    const seen = new Set<number>();
    for (let day = 0; day < daysInYear(2026); day++) seen.add(dialState(2026, day).term.index);
    expect(seen.size).toBe(24);
  });

  it("draws the travelled arc counter-clockwise and picks the long way past half a turn", () => {
    const centre = { x: 160, y: 160 };
    expect(arcPath(10, 10.1, 100, centre)).toBe("");
    const quarter = arcPath(0, 90, 100, centre);
    expect(quarter).toBe("M 260.0 160.0 A 100 100 0 0 0 160.0 60.0");
    expect(arcPath(0, 270, 100, centre)).toContain("0 1 0");
    expect(arcPath(350, 20, 100, centre)).toContain("0 0 0");
    expect(arcPath(0, 360, 100, centre)).toBe("");
    expect(arcPath(0, 359.95, 100, centre)).toContain("0 1 0");
  });
});

describe("solar term roles and ring labels", () => {
  it("marks exactly twelve terms as opening a month, Lập Xuân first", () => {
    expect([...Array(24).keys()].filter(isMonthOpener)).toHaveLength(12);
    expect(isMonthOpener(21)).toBe(true);
    expect(isMonthOpener(0)).toBe(false);
  });

  it("turns each label along its radius and flips the ones on the left so they are not upside down", () => {
    const centre = { x: 0, y: 0 };
    expect(radialLabel(0, 100, centre)).toMatchObject({ rotation: -0, anchor: "start" });
    expect(radialLabel(45, 100, centre)).toMatchObject({ rotation: -45, anchor: "start" });
    expect(radialLabel(180, 100, centre)).toMatchObject({ rotation: 0, anchor: "end" });
    expect(radialLabel(225, 100, centre)).toMatchObject({ rotation: -45, anchor: "end" });
    expect(radialLabel(270, 100, centre).anchor).toBe("start");
    expect(radialLabel(90, 100, centre).anchor).toBe("start");
  });

  it("never lets a label end up upside down", () => {
    for (let k = 0; k < 24; k++) {
      const { rotation } = radialLabel(k * 15, 100, { x: 0, y: 0 });
      const normalised = ((rotation % 360) + 540) % 360 - 180;
      expect(Math.abs(normalised)).toBeLessThanOrEqual(90 + 1e-9);
    }
  });
});

describe("story timeline", () => {
  it("tells one step per fifth and holds the last step while the finished chart shows", () => {
    expect(storyView(0).step).toBe(0);
    expect(storyView(0.19).step).toBe(0);
    expect(storyView(0.21).step).toBe(1);
    expect(storyView(0.41).step).toBe(2);
    expect(storyView(0.61).step).toBe(3);
    expect(storyView(0.95).step).toBe(3);
    expect(storyView(1).step).toBe(3);
  });

  it("brings in one pillar card just before each step ends, all four before the section lets go", () => {
    expect(storyView(0).cards).toBe(0);
    expect(storyView(0.14).cards).toBe(0);
    expect(storyView(0.16).cards).toBe(1);
    expect(storyView(0.34).cards).toBe(1);
    expect(storyView(0.36).cards).toBe(2);
    expect(storyView(0.56).cards).toBe(3);
    expect(storyView(0.76).cards).toBe(4);
    expect(storyView(1).cards).toBe(4);
  });

  it("clamps progress outside 0 to 1", () => {
    expect(storyView(-2)).toEqual({ step: 0, cards: 0 });
    expect(storyView(5)).toEqual({ step: 3, cards: 4 });
  });
});

describe("dial that plays and follows the pointer", () => {
  it("runs at about three seconds a solar term", () => {
    expect(24 * 3 * daysPerSecond(2026)).toBeCloseTo(365, 6);
    expect(24 * 3 * daysPerSecond(2028)).toBeCloseTo(366, 6);
  });

  it("reads the longitude of a point on the ring, the opposite of ringPoint", () => {
    const centre = { x: 230, y: 230 };
    for (const longitude of [0, 15, 90, 179, 180, 270, 315, 359]) {
      const back = longitudeAt(ringPoint(longitude, 100, centre), centre);
      expect(Math.abs(((back - longitude + 540) % 360) - 180)).toBeLessThan(1e-6);
    }
  });

  it("finds the day on which the Sun is at a longitude", () => {
    // The Sun is at 0 degrees at the March equinox, about 20 March, and at 90 degrees at the June solstice, about 21 June.
    expect(Math.abs(dayForLongitude(2026, 0) - dayIndexOf(2026, 3, 20))).toBeLessThanOrEqual(1);
    expect(Math.abs(dayForLongitude(2026, 90) - dayIndexOf(2026, 6, 21))).toBeLessThanOrEqual(1);
    expect(Math.abs(dayForLongitude(2026, 315) - dayIndexOf(2026, 2, 4))).toBeLessThanOrEqual(1);
    expect(dialState(2026, dayForLongitude(2026, 200)).longitude).toBeGreaterThan(190);
  });

  it("gives a day for every longitude, even across 0 and 360", () => {
    for (let longitude = 0; longitude < 360; longitude += 7.5) {
      const day = dayForLongitude(2026, longitude);
      expect(day).toBeGreaterThanOrEqual(0);
      expect(day).toBeLessThan(365);
    }
  });
});

describe("age along the walk", () => {
  it("starts at 0, ends at the life span and never goes back", () => {
    expect(ageAtWalk(0)).toBe(0);
    expect(ageAtWalk(1)).toBe(LIFE_SPAN);
    let previous = -1;
    for (let step = 0; step <= 200; step += 1) {
      const age = ageAtWalk(step / 200);
      expect(age).toBeGreaterThanOrEqual(previous);
      previous = age;
    }
  });

  it("reaches each frame age at its stop, with the crawling child getting a real share", () => {
    expect(ageAtWalk(0.1)).toBe(1);
    expect(ageAtWalk(0.26)).toBe(12);
    expect(ageAtWalk(0.67)).toBe(45);
    expect(ageAtWalk(0.96)).toBe(80);
    // more than a tenth of the walk happens before the child is one year old: the crawling frame is not a blink
    expect(ageAtWalk(0.05)).toBeCloseTo(0.5, 5);
  });

  it("keeps the frame ages sorted", () => {
    expect([...FRAME_AGES]).toEqual([...FRAME_AGES].sort((a, b) => a - b));
  });
});
