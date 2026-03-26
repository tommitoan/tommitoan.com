"use client";

import { useState } from "react";
import Image from "next/image";
import { HeroSticker } from "@/components/home/hero-sticker";
import { decorStickers, homeNotes, interactiveStickers, type HomeNoteKey } from "@/content/home-scene";

type NoteType = HomeNoteKey | null;

export default function HomePage() {
  const [activeNote, setActiveNote] = useState<NoteType>(null);

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#faf8f5] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px]">
      <h1 className="absolute top-8 left-12 z-0 font-[var(--font-display)] text-5xl font-bold text-neutral-800 opacity-90 md:text-7xl">
        Tommi Toan
        <span className="mt-4 block font-[var(--font-body)] text-xl font-normal uppercase tracking-widest text-neutral-500 md:text-2xl">
          Software Engineer
        </span>
      </h1>

      <HeroSticker />

      <div className="pointer-events-none absolute inset-0 z-0 select-none opacity-80">
        {decorStickers.map((sticker) => (
          <Image
            key={sticker.id}
            src={sticker.src}
            alt={sticker.alt}
            width={sticker.width}
            height={sticker.height}
            className={sticker.className}
          />
        ))}
      </div>

      {interactiveStickers.map((sticker) => (
        <button
          key={sticker.id}
          onClick={() => setActiveNote(sticker.note)}
          className={sticker.className}
          aria-label={homeNotes[sticker.note].label}
        >
          <Image
            src={sticker.src}
            alt={sticker.alt}
            width={sticker.width}
            height={sticker.height}
            priority
            className="object-contain"
          />
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded border bg-white/90 px-3 py-1 text-sm font-medium opacity-0 shadow-sm transition-opacity duration-300 group-hover:opacity-100">
            {sticker.tooltip}
          </div>
        </button>
      ))}

      {activeNote && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/10 p-6 backdrop-blur-sm transition-all duration-300">
          <div
            className="animate-in fade-in zoom-in relative w-full max-w-sm rotate-1 rounded-sm bg-[#fffae6] p-8 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.3)] duration-200 transform-gpu md:p-10"
            style={{
              boxShadow: "2px 4px 12px rgba(0,0,0,0.1), inset 0 0 100px rgba(0,0,0,0.01)",
              border: "1px solid rgba(0,0,0,0.05)",
            }}
          >
            <button
              onClick={() => setActiveNote(null)}
              className="absolute top-3 right-4 text-xl font-bold text-neutral-400 transition-colors hover:text-neutral-800"
              aria-label="Close note"
            >
              ×
            </button>

            <div className="font-[var(--font-display)] text-neutral-800">
              <h2 className="mb-4 border-b border-dashed border-neutral-300 pb-2 text-2xl font-bold tracking-tight">
                {homeNotes[activeNote].title}
              </h2>
              <div className="font-[var(--font-body)] text-lg leading-relaxed whitespace-pre-line">
                {homeNotes[activeNote].content}
              </div>
            </div>

            <div className="absolute top-[-15px] left-1/2 h-8 w-24 -translate-x-1/2 -rotate-2 border border-neutral-200/50 bg-white/60 shadow-sm mix-blend-overlay backdrop-blur-sm" />
          </div>

          <div className="absolute inset-0 -z-10" onClick={() => setActiveNote(null)} />
        </div>
      )}
    </div>
  );
}
