"use client";

import Link from "next/link";
import { useFengShuiLanguage } from "@/components/fengshui/FengShuiLanguage";
import { blogContent } from "@/content/fengshui-blog";
import { PageHero } from "./PageHero";
import { ScrollFill } from "./ScrollFill";

/** The About page: who I am, what I do, the Feng Shui side and where to find me. */
export function AboutView() {
  const language = useFengShuiLanguage();
  const copy = blogContent[language].about;
  return (
    <>
      <PageHero eyebrow={copy.eyebrow} title={copy.title} description={copy.description} />
      <section className="fs-band fs-band-paper" data-kit-section={`${blogContent.vi.about.eyebrow} / ${blogContent.en.about.eyebrow}`}>
        <div className="fs-wrap fs-narrow">
          <ScrollFill text={copy.lead} className="fs-lead fs-about-lead" />
        </div>
        <div className="fs-wrap">
          <h2 className="fs-title fs-about-title">{copy.doTitle}</h2>
          <div className="fs-grid fs-grid-3">
            {copy.doItems.map((item) => (
              <article key={item.title} className="fs-panel fs-card">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="fs-band fs-band-paper fs-band-alt" data-kit-section={`${blogContent.vi.about.fengshuiTitle} / ${blogContent.en.about.fengshuiTitle}`}>
        <div className="fs-wrap fs-narrow">
          <h2 className="fs-title fs-about-title">{copy.fengshuiTitle}</h2>
          {copy.fengshuiText.map((paragraph) => (
            <ScrollFill key={paragraph} text={paragraph} className="fs-lead" />
          ))}
          <Link href="/fengshui/" className="fs-link">
            {copy.fengshuiCta} →
          </Link>
        </div>
      </section>
      <section className="fs-band fs-band-paper" data-kit-section={`${blogContent.vi.about.findTitle} / ${blogContent.en.about.findTitle}`}>
        <div className="fs-wrap fs-narrow">
          <h2 className="fs-title fs-about-title">{copy.findTitle}</h2>
          <p className="fs-copy">{copy.findText}</p>
          <ul className="fs-channels">
            {copy.channels.map((channel) => (
              <li key={channel.name}>
                <a href={channel.href} rel="noopener noreferrer">
                  <strong>{channel.name}</strong>
                  <span>{channel.blurb}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
