"use client";

import { useEffect, useRef, useState } from "react";

const SECTIONS = [
  { id: "intro",      label: "Intro"      },
  { id: "about",      label: "Overview"   },
  { id: "skills",     label: "Skills"     },
  { id: "experience", label: "Journey"    },
  { id: "education",  label: "Credentials"},
  { id: "projects",   label: "Projects"   },
  { id: "contact",    label: "Contact"    },
];

export function TechTableOfContents() {
  const [active, setActive] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const headings = SECTIONS.map(({ id }) => document.getElementById(id)).filter(Boolean) as HTMLElement[];

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );

    headings.forEach((el) => observerRef.current!.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <nav
      aria-label="Page sections"
      className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-1 xl:flex 2xl:right-8"
    >
      {SECTIONS.map(({ id, label }) => {
        const isActive = active === id;
        return (
          <a
            key={id}
            href={`#${id}`}
            title={label}
            className="group flex items-center gap-2"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <span
              className={`text-[11px] font-medium tracking-wide transition-all duration-200 ${
                isActive
                  ? "translate-x-0 opacity-100 text-violet-300"
                  : "translate-x-2 opacity-0 text-slate-400 group-hover:translate-x-0 group-hover:opacity-100"
              }`}
            >
              {label}
            </span>
            <span
              className={`block h-0.5 rounded-full transition-all duration-200 ${
                isActive
                  ? "w-5 bg-violet-400"
                  : "w-2.5 bg-slate-600 group-hover:w-4 group-hover:bg-slate-400"
              }`}
            />
          </a>
        );
      })}
    </nav>
  );
}
