import { describe, expect, it } from "vitest";
import { maskDmy, parseDmy } from "./date-input";

describe("date mask", () => {
  it("adds the slashes as digits are typed", () => {
    expect(maskDmy("2")).toBe("2");
    expect(maskDmy("29")).toBe("29");
    expect(maskDmy("291")).toBe("29/1");
    expect(maskDmy("29121995")).toBe("29/12/1995");
  });

  it("drops anything that is not a digit and anything past eight digits", () => {
    expect(maskDmy("29/12/1995")).toBe("29/12/1995");
    expect(maskDmy("29-12-1995")).toBe("29/12/1995");
    expect(maskDmy("2912199599")).toBe("29/12/1995");
    expect(maskDmy("ab")).toBe("");
    expect(maskDmy("")).toBe("");
  });

  it("lets a deleted slash go: backspacing 29/ gives 29 and then 2", () => {
    expect(maskDmy("29/")).toBe("29");
    expect(maskDmy("2")).toBe("2");
  });
});

describe("date reader", () => {
  it("reads a real date", () => {
    expect(parseDmy("29/12/1995")).toEqual({ year: 1995, month: 12, day: 29 });
    expect(parseDmy(" 01/01/2000 ")).toEqual({ year: 2000, month: 1, day: 1 });
  });

  it("knows the length of each month and leap years", () => {
    expect(parseDmy("29/02/2000")).not.toBeNull();
    expect(parseDmy("29/02/1900")).toBeNull();
    expect(parseDmy("29/02/2023")).toBeNull();
    expect(parseDmy("31/04/2024")).toBeNull();
    expect(parseDmy("31/12/2024")).not.toBeNull();
  });

  it("refuses wrong shapes and out-of-range values", () => {
    for (const text of ["", "1/1/2000", "29-12-1995", "1995/12/29", "00/12/1995", "10/13/1995", "10/00/1995", "10/10/1899", "10/10/2101", "29/12/95"]) expect(parseDmy(text)).toBeNull();
  });
});
