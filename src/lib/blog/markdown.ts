import { Marked } from "marked";

const escapeHtml = (text: string): string =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const SAFE_LINK = /^(https?:\/\/|mailto:|\/|#)/i;

const marked = new Marked({
  gfm: true,
  breaks: false,
  renderer: {
    // Posts are written in the repository, but raw HTML in them is shown as text, never run.
    html({ text }) {
      return escapeHtml(text);
    },
    link({ href, title, tokens }) {
      const inner = this.parser.parseInline(tokens);
      if (!SAFE_LINK.test(href)) return inner;
      const external = /^https?:\/\//i.test(href);
      const attrs = `${title ? ` title="${escapeHtml(title)}"` : ""}${external ? ' rel="noopener noreferrer"' : ""}`;
      return `<a href="${escapeHtml(href)}"${attrs}>${inner}</a>`;
    },
    image({ href, title, text }) {
      if (!SAFE_LINK.test(href)) return escapeHtml(text);
      return `<img src="${escapeHtml(href)}" alt="${escapeHtml(text)}"${title ? ` title="${escapeHtml(title)}"` : ""} loading="lazy">`;
    },
  },
});

/** Renders Markdown to HTML. Raw HTML is escaped and only http, https, mailto, relative and fragment links survive. */
export function renderMarkdown(source: string): string {
  return marked.parse(source, { async: false });
}

/** Words in the Markdown source, for a reading-time estimate. */
export function countWords(source: string): number {
  return source.split(/\s+/).filter((word) => /[\p{L}\p{N}]/u.test(word)).length;
}

export const readingMinutes = (words: number, wordsPerMinute = 200): number => Math.max(1, Math.round(words / wordsPerMinute));
