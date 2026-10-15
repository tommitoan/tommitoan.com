import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostNotice } from "@/components/fengshui/blog/PostNotice";
import { blogContent } from "@/content/fengshui-blog";
import { formatPostDate } from "@/lib/blog/format";
import { findPost, loadPosts } from "@/lib/blog/load";
import { BLOG_LANGUAGES, postPath, translationOf, type BlogLanguage } from "@/lib/blog/entries";
import { createMetadata } from "@/lib/metadata";
import { siteContent } from "@/content/site-content";

type Params = { lang: string; slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return loadPosts().map((post) => ({ lang: post.lang, slug: post.slug }));
}

const isLanguage = (value: string): value is BlogLanguage => (BLOG_LANGUAGES as readonly string[]).includes(value);

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const found = isLanguage(lang) ? findPost(lang, slug) : undefined;
  if (!found) return {};
  const { entry, post } = found;
  // hreflang only when both versions exist; the canonical address is the post's own.
  const languages = Object.fromEntries(BLOG_LANGUAGES.filter((code) => entry.versions[code]).map((code) => [code, postPath(entry.versions[code]!)]));
  return createMetadata({
    title: post.title,
    description: post.description,
    path: postPath(post),
    article: { publishedTime: post.date },
    ...(Object.keys(languages).length > 1 ? { languages } : {}),
  });
}

export default async function PostPage({ params }: { params: Promise<Params> }) {
  const { lang, slug } = await params;
  const found = isLanguage(lang) ? findPost(lang, slug) : undefined;
  if (!found) notFound();
  const { entry, post } = found;
  const copy = blogContent[post.lang].post;
  const other = translationOf(entry, post);
  const ld = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    inLanguage: post.lang,
    url: `${siteContent.siteMeta.domain}${postPath(post)}`,
    author: { "@type": "Person", name: "Toan Ngo", url: siteContent.siteMeta.domain },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <section className="fs-hero fs-hero-compact">
        <div className="fs-wrap fs-narrow" lang={post.lang}>
          <Link href="/fengshui/blog/" className="fs-back">
            {copy.back}
          </Link>
          <p className="fs-post-meta fs-post-meta-hero">
            <time dateTime={post.date}>{formatPostDate(post.date, post.lang)}</time> · {copy.minutes(post.minutes)}
          </p>
          <h1 className="fs-hero-title" data-kit-reveal>
            {post.title}
          </h1>
          <p className="fs-hero-copy fs-post-lead">{post.description}</p>
        </div>
      </section>
      <article className="fs-band fs-band-paper" lang={post.lang} data-kit-section={post.title}>
        <div className="fs-wrap fs-narrow">
          <PostNotice lang={post.lang} translation={other ? { href: postPath(other), lang: other.lang } : null} />
          <div className="fs-prose" dangerouslySetInnerHTML={{ __html: post.html }} />
        </div>
      </article>
    </>
  );
}
