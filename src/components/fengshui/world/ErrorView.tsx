"use client";

import Link from "next/link";
import { useFengShuiLanguage } from "@/components/fengshui/FengShuiLanguage";
import { errorContent } from "@/content/fengshui-errors";

type Props = { kind: "notFound" } | { kind: "error"; onRetry: () => void };

/** A short night page for a missing address or a failed render: what happened and where to go next. */
export function ErrorView(props: Props) {
  const language = useFengShuiLanguage();
  const copy = errorContent[language];
  const text = props.kind === "notFound" ? copy.notFound : copy.error;
  return (
    <section className="fs-hero fs-hero-compact fs-error">
      <div className="fs-wrap fs-narrow">
        <span className="fs-eyebrow">{text.eyebrow}</span>
        <h1 className="fs-hero-title">{text.title}</h1>
        <p className="fs-hero-copy">{text.text}</p>
        <div className="fs-actions">
          {props.kind === "error" ? (
            <button type="button" className="fs-btn" onClick={props.onRetry}>
              {copy.error.retry}
            </button>
          ) : null}
          <Link href="/" className={props.kind === "error" ? "fs-btn fs-btn-ghost" : "fs-btn"} prefetch={false}>
            {props.kind === "notFound" ? copy.notFound.home : copy.error.home}
          </Link>
          {props.kind === "notFound" ? (
            <>
              <Link href="/fengshui/" className="fs-btn fs-btn-ghost">
                {copy.notFound.world}
              </Link>
              <Link href="/fengshui/blog/" className="fs-btn fs-btn-ghost">
                {copy.notFound.blog}
              </Link>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
