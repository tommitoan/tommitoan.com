import { describe, expect, it } from "vitest";
import { groupEntries, parsePostFile } from "./posts";
import { blogSitemap } from "./sitemap";

const raw = (date: string) => `---\ntitle: T\ndate: ${date}\ndescription: D\n---\nBody text`;
const make = (file: string, date: string) => parsePostFile(file, raw(date))!;
const BASE = "https://tommitoan.com";

describe("blogSitemap", () => {
  it("lists the blog first, dated by its newest post", () => {
    const rows = blogSitemap(groupEntries([make("a.vi.md", "2026-01-01"), make("b.vi.md", "2026-10-15")]), BASE);
    expect(rows[0].url).toBe(`${BASE}/fengshui/blog/`);
    expect(rows[0].lastModified).toEqual(new Date("2026-10-15T00:00:00Z"));
  });

  it("gives every version its own row and names the other language when there is one", () => {
    const rows = blogSitemap(groupEntries([make("w.vi.md", "2026-10-15"), make("w.en.md", "2026-10-15"), make("solo.vi.md", "2026-10-14")]), BASE);
    const byUrl = new Map(rows.map((row) => [row.url, row]));
    expect(byUrl.get(`${BASE}/fengshui/blog/en/w/`)?.alternates?.languages).toEqual({
      vi: `${BASE}/fengshui/blog/vi/w/`,
      en: `${BASE}/fengshui/blog/en/w/`,
    });
    expect(byUrl.get(`${BASE}/fengshui/blog/vi/solo/`)?.alternates).toBeUndefined();
    expect(rows).toHaveLength(4);
  });

  it("still lists the blog page when there are no posts", () => {
    const rows = blogSitemap([], BASE);
    expect(rows).toHaveLength(1);
    expect(rows[0].lastModified).toBeUndefined();
  });
});
