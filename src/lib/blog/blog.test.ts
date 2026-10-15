import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { FrontMatterError, parseFrontMatter } from "./front-matter";
import { countWords, readingMinutes, renderMarkdown } from "./markdown";
import { formatPostDate } from "./format";
import { groupEntries, postPath, summaryFor, toSummaryEntry, translationOf, versionFor, PostError } from "./entries";
import { parsePostFile } from "./posts";
import { loadPosts } from "./load";

const post = (extra = "", body = "Hello **world**.") => `---\ntitle: A title\ndate: 2026-10-15\ndescription: A short description\n${extra}---\n\n${body}\n`;

describe("parseFrontMatter", () => {
  it("reads key: value lines and the body", () => {
    const { data, body } = parseFrontMatter('---\ntitle: "Quoted: yes"\ndate: 2026-10-15\n# a comment\n\n---\n\nText\n');
    expect(data).toEqual({ title: "Quoted: yes", date: "2026-10-15" });
    expect(body).toBe("Text\n");
  });

  it("accepts Windows line endings and a byte-order mark", () => {
    expect(parseFrontMatter("﻿---\r\ntitle: T\r\n---\r\nBody").data.title).toBe("T");
  });

  it("keeps colons inside a value", () => {
    expect(parseFrontMatter("---\ndescription: one: two\n---\nx").data.description).toBe("one: two");
  });

  it.each([
    ["no opening fence", "title: x\n---\n"],
    ["no closing fence", "---\ntitle: x\n"],
    ["a line without a colon", "---\njust text\n---\n"],
    ["a bad key", "---\n1bad: x\n---\n"],
    ["a repeated key", "---\ntitle: a\ntitle: b\n---\n"],
  ])("rejects %s", (_name, raw) => {
    expect(() => parseFrontMatter(raw)).toThrow(FrontMatterError);
  });
});

describe("renderMarkdown", () => {
  it("renders headings, emphasis and lists", () => {
    const html = renderMarkdown("## Title\n\nSome *text* and **bold**.\n\n- one\n- two\n");
    expect(html).toContain("<h2>Title</h2>");
    expect(html).toContain("<em>text</em>");
    expect(html).toContain("<li>one</li>");
  });

  it("shows raw HTML as text instead of running it", () => {
    const html = renderMarkdown('<script>alert(1)</script>\n\nBefore <img src=x onerror=alert(1)> after');
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("<img src=x");
    expect(html).toContain("&lt;script&gt;");
  });

  it("drops unsafe link targets but keeps the text, and marks external links", () => {
    const html = renderMarkdown("[bad](javascript:alert(1)) and [good](https://example.com) and [here](/fengshui/) ");
    expect(html).not.toContain("javascript:");
    expect(html).toContain("bad");
    expect(html).toContain('<a href="https://example.com" rel="noopener noreferrer">good</a>');
    expect(html).toContain('<a href="/fengshui/">here</a>');
  });

  it("escapes the alt text and refuses unsafe image sources", () => {
    expect(renderMarkdown("![a \"quote\"](javascript:x)")).not.toContain("<img");
    expect(renderMarkdown('![a "quote"](/x.png)')).toContain('alt="a &quot;quote&quot;"');
  });
});

describe("words and reading time", () => {
  it("counts words with letters or digits, in any script", () => {
    expect(countWords("Một hai ba — 4 five ---")).toBe(5);
  });

  it("never reports less than one minute", () => {
    expect(readingMinutes(10)).toBe(1);
    expect(readingMinutes(1000)).toBe(5);
  });
});

describe("parsePostFile", () => {
  it("builds a post from a file", () => {
    const parsed = parsePostFile("welcome.vi.md", post());
    expect(parsed).toMatchObject({ slug: "welcome", lang: "vi", title: "A title", date: "2026-10-15", description: "A short description", minutes: 1 });
    expect(parsed?.html).toContain("<strong>world</strong>");
  });

  it("leaves out a draft", () => {
    expect(parsePostFile("later.en.md", post("draft: true\n"))).toBeNull();
  });

  it.each([
    ["a file name without a language", "welcome.md", post()],
    ["a slug with capitals", "Welcome.vi.md", post()],
    ["a missing title", "a.vi.md", "---\ndate: 2026-10-15\ndescription: d\n---\ntext"],
    ["a missing description", "a.vi.md", "---\ntitle: t\ndate: 2026-10-15\n---\ntext"],
    ["an impossible date", "a.vi.md", post().replace("2026-10-15", "2026-02-31")],
    ["a date in another form", "a.vi.md", post().replace("2026-10-15", "15/10/2026")],
    ["an empty body", "a.vi.md", post("", "")],
    ["broken front matter", "a.vi.md", "no front matter"],
  ])("stops the build for %s", (_name, file, raw) => {
    expect(() => parsePostFile(file, raw)).toThrow(PostError);
  });

  it("names the file in the error", () => {
    expect(() => parsePostFile("broken.vi.md", "no front matter")).toThrow(/broken\.vi\.md/);
  });
});

describe("entries", () => {
  const make = (file: string, date: string) => parsePostFile(file, post().replace("2026-10-15", date))!;
  const posts = [make("old.vi.md", "2026-01-01"), make("new.vi.md", "2026-10-15"), make("new.en.md", "2026-10-16"), make("same-day.vi.md", "2026-10-15")];

  it("groups versions by slug and sorts newest first, ties by slug", () => {
    const entries = groupEntries(posts);
    expect(entries.map((entry) => entry.slug)).toEqual(["new", "same-day", "old"]);
    expect(entries[0].date).toBe("2026-10-16");
    expect(Object.keys(entries[0].versions).sort()).toEqual(["en", "vi"]);
  });

  it("refuses the same post twice", () => {
    expect(() => groupEntries([...posts, make("old.vi.md", "2026-01-02")])).toThrow(/twice/);
  });

  it("shows a post in the visitor's language when it exists and falls back to the other one", () => {
    const entries = groupEntries(posts);
    expect(versionFor(entries[0], "en").lang).toBe("en");
    expect(versionFor(entries[2], "en").lang).toBe("vi");
  });

  it("finds the translation of a post, if any", () => {
    const entries = groupEntries(posts);
    expect(translationOf(entries[0], entries[0].versions.vi!)?.lang).toBe("en");
    expect(translationOf(entries[2], entries[2].versions.vi!)).toBeNull();
  });

  it("builds the address of a post", () => {
    expect(postPath({ lang: "en", slug: "welcome" })).toBe("/fengshui/blog/en/welcome/");
  });
});

describe("loadPosts", () => {
  it("reads every post of a folder, skipping drafts and other files", () => {
    const directory = mkdtempSync(path.join(tmpdir(), "blog-"));
    writeFileSync(path.join(directory, "a.vi.md"), post());
    writeFileSync(path.join(directory, "b.en.md"), post("draft: true\n"));
    writeFileSync(path.join(directory, "notes.txt"), "not a post");
    expect(loadPosts(directory).map((p) => `${p.slug}.${p.lang}`)).toEqual(["a.vi"]);
  });

  it("stops with the file name when a post is malformed", () => {
    const directory = mkdtempSync(path.join(tmpdir(), "blog-"));
    writeFileSync(path.join(directory, "bad.vi.md"), "nothing");
    expect(() => loadPosts(directory)).toThrow(/bad\.vi\.md/);
  });
});

describe("summaries for the browser", () => {
  const make = (file: string) => parsePostFile(file, post())!;

  it("drops the HTML but keeps what a list needs", () => {
    const [entry] = groupEntries([make("a.vi.md"), make("a.en.md")]);
    const summary = toSummaryEntry(entry);
    expect(JSON.stringify(summary)).not.toContain("<strong>");
    expect(summary.versions.vi).toMatchObject({ slug: "a", lang: "vi", title: "A title", minutes: 1 });
    expect(Object.keys(summary.versions).sort()).toEqual(["en", "vi"]);
  });

  it("falls back to the other language when a version is missing", () => {
    const [entry] = groupEntries([make("only.vi.md")]);
    expect(summaryFor(toSummaryEntry(entry), "en").lang).toBe("vi");
    expect(summaryFor(toSummaryEntry(entry), "vi").lang).toBe("vi");
  });
});

describe("formatPostDate", () => {
  it("writes a long date in the post's language, whatever the machine's zone", () => {
    expect(formatPostDate("2026-10-15", "en")).toBe("15 October 2026");
    expect(formatPostDate("2026-10-15", "vi")).toMatch(/15.*10.*2026/);
  });
});
