"use client";

import Link from "next/link";
import { useFengShuiLanguage } from "@/components/fengshui/FengShuiLanguage";
import { blogContent } from "@/content/fengshui-blog";
import { formatPostDate } from "@/lib/blog/format";
import { postPath, summaryFor, type SummaryEntry } from "@/lib/blog/entries";
import { PageHero } from "./PageHero";
import { PreviewZone } from "./PreviewZone";

type Props = { entries: SummaryEntry[] };

/** The list of posts, newest first: one row per post, in the visitor's language when it exists. */
export function BlogListView({ entries }: Props) {
  const language = useFengShuiLanguage();
  const copy = blogContent[language];
  return (
    <>
      <PageHero eyebrow={copy.list.eyebrow} title={copy.list.title} description={copy.list.description} />
      <section className="fs-band fs-band-paper" data-kit-section={`${blogContent.vi.list.eyebrow} / ${blogContent.en.list.eyebrow}`}>
        <div className="fs-wrap fs-narrow">
          {entries.length === 0 ? (
            <p className="fs-copy">{copy.list.empty}</p>
          ) : (
            <PreviewZone>
              <ol className="fs-posts">
                {entries.map((entry) => {
                  const post = summaryFor(entry, language);
                  const otherLanguageOnly = entry.versions[language] === undefined;
                  return (
                    <li key={entry.slug} className="fs-post-item" data-preview data-preview-text={post.description} data-preview-lang={post.lang}>
                      <Link href={postPath(post)} lang={post.lang} hrefLang={post.lang} className="fs-post-link">
                        <span className="fs-post-date">{formatPostDate(post.date, post.lang)}</span>
                        <strong className="fs-post-title">{post.title}</strong>
                        <span className="fs-post-meta">
                          {copy.list.readingMinutes(post.minutes)}
                          {otherLanguageOnly ? <span className="fs-badge">{copy.list.onlyIn(copy.post.languageName[post.lang])}</span> : null}
                        </span>
                        <span className="fs-post-desc">{post.description}</span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </PreviewZone>
          )}
        </div>
      </section>
    </>
  );
}
