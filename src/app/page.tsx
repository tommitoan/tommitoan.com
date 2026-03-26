"use client";

import { useState } from "react";
import Image from "next/image";
import { HeroSticker } from "@/components/home/hero-sticker";
import { siteContent } from "@/content/site-content";

type NoteType = "backend" | "infra" | "about" | "oss" | "contact" | null;

export default function HomePage() {
  const [activeNote, setActiveNote] = useState<NoteType>(null);

  const notesData: Record<NonNullable<NoteType>, { title: string; content: string; label: string }> = {
    backend: {
      title: "Backend Engineer",
      content: "I design and build robust backend systems primarily in Go. Focusing on service boundaries, API contracts, and clean delivery flows.",
      label: "Click to read about Backend"
    },
    infra: {
      title: "Homelab & Infra",
      content: "My personal proving ground: a 3-node k3s cluster, Argo CD sync flows, and an observability stack (Grafana/Loki/Jaeger).",
      label: "Click to read about Infrastructure"
    },
    about: {
      title: "Who am I?",
      content: "I'm Toan Ngo. I enjoy building practical and durable systems—stuff that runs well and stays easy to operate over time.",
      label: "Click to read About Me"
    },
    oss: {
      title: "Open Source",
      content: "I build public products like Bazica, an open-source Go library and live demo for Ba-zi charts. It's my public playground.",
      label: "Click to read about Open Source"
    },
    contact: {
      title: "Get in touch",
      content: "Email: toan.ngo.contact@gmail.com\\nLocation: Vietnam\\nFind me on GitHub (@tommitoan) and LinkedIn.",
      label: "Click for Contact info"
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#faf8f5] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px]">

      {/* Title / Header */}
      <h1 className="absolute top-8 left-12 font-[var(--font-display)] text-5xl md:text-7xl font-bold text-neutral-800 opacity-90 z-0">
        Tommi Toan
        <span className="block text-xl md:text-2xl mt-4 font-normal text-neutral-500 font-[var(--font-body)] tracking-widest uppercase">
          Software Engineer
        </span>
      </h1>

      {/* Hero Sticker - Center */}
      <HeroSticker />

      {/* Decor Items (non-interactive) */}
      <div className="pointer-events-none absolute inset-0 z-0 select-none opacity-80">
        <Image src="/sticker/decor_game.png" alt="Game" width={200} height={200} className="absolute top-[10%] right-[15%] rotate-12 drop-shadow-md" />
        <Image src="/sticker/decor_fengshui.png" alt="Feng Shui" width={180} height={180} className="absolute bottom-[20%] left-[8%] -rotate-6 drop-shadow-md" />
        <Image src="/sticker/plane.png" alt="Plane" width={220} height={220} className="absolute top-[20%] left-[25%] -rotate-[15deg] drop-shadow-md" />
        <Image src="/sticker/decor_movie.png" alt="Movie" width={160} height={160} className="absolute bottom-[10%] right-[30%] rotate-3 drop-shadow-md transition-transform" />
      </div>

      {/* Interactive Characters */}
      {/* Backend - top right corner */}
      <button
        onClick={() => setActiveNote("backend")}
        className="absolute top-[25%] right-[8%] hover:scale-110 hover:-rotate-3 transition-transform duration-300 drop-shadow-lg z-10 group"
        aria-label={notesData.backend.label}
      >
        <Image src="/sticker/working_1_focus.png" alt="Backend" width={260} height={390} priority className="object-contain" />
        <div className="opacity-0 group-hover:opacity-100 absolute -bottom-10 left-1/2 -translate-x-1/2 transition-opacity duration-300 whitespace-nowrap bg-white/90 px-3 py-1 rounded shadow-sm text-sm border font-medium">Backend Info</div>
      </button>

      {/* Infra - center right */}
      <button
        onClick={() => setActiveNote("infra")}
        className="absolute top-[60%] right-[15%] hover:scale-110 hover:rotate-3 transition-transform duration-300 drop-shadow-lg z-10 group"
        aria-label={notesData.infra.label}
      >
        <Image src="/sticker/working_2_friendly.png" alt="Infra" width={280} height={420} priority className="object-contain" />
        <div className="opacity-0 group-hover:opacity-100 absolute -bottom-10 left-1/2 -translate-x-1/2 transition-opacity duration-300 whitespace-nowrap bg-white/90 px-3 py-1 rounded shadow-sm text-sm border font-medium">Infra & Homelab</div>
      </button>

      {/* Standing - center left */}
      <button
        onClick={() => setActiveNote("about")}
        className="absolute top-[50%] left-[10%] hover:scale-110 hover:-rotate-2 transition-transform duration-300 drop-shadow-lg z-10 group"
        aria-label={notesData.about.label}
      >
        <Image src="/sticker/standing_1.png" alt="About" width={240} height={360} priority className="object-contain" />
        <div className="opacity-0 group-hover:opacity-100 absolute -bottom-10 left-1/2 -translate-x-1/2 transition-opacity duration-300 whitespace-nowrap bg-white/90 px-3 py-1 rounded shadow-sm text-sm border font-medium">About Me</div>
      </button>

      {/* Ship - bottom center */}
      <button
        onClick={() => setActiveNote("oss")}
        className="absolute bottom-[15%] left-[25%] hover:scale-110 hover:-translate-y-2 transition-transform duration-300 drop-shadow-lg z-10 group"
        aria-label={notesData.oss.label}
      >
        <Image src="/sticker/ship_1.png" alt="Ship - OSS" width={200} height={200} priority className="object-contain" />
        <div className="opacity-0 group-hover:opacity-100 absolute -bottom-10 left-1/2 -translate-x-1/2 transition-opacity duration-300 whitespace-nowrap bg-white/90 px-3 py-1 rounded shadow-sm text-sm border font-medium">Open Source</div>
      </button>

      {/* Walking - bottom right */}
      <button
        onClick={() => setActiveNote("contact")}
        className="absolute top-[10%] left-[45%] hover:scale-110 hover:translate-x-4 transition-transform duration-500 drop-shadow-lg z-10 group"
        aria-label={notesData.contact.label}
      >
        <Image src="/sticker/walking_1.png" alt="Contact" width={180} height={270} priority className="object-contain" />
        <div className="opacity-0 group-hover:opacity-100 absolute -bottom-10 left-1/2 -translate-x-1/2 transition-opacity duration-300 whitespace-nowrap bg-white/90 px-3 py-1 rounded shadow-sm text-sm border font-medium">Contact</div>
      </button>

      {/* Handnote Modal */}
      {activeNote && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm transition-all duration-300 p-6">
          <div
            className="relative w-full max-w-sm bg-[#fffae6] p-8 md:p-10 rounded-sm shadow-[0_15px_30px_-5px_rgba(0,0,0,0.3)] rotate-1 transform-gpu animate-in fade-in zoom-in duration-200"
            style={{
              boxShadow: "2px 4px 12px rgba(0,0,0,0.1), inset 0 0 100px rgba(0,0,0,0.01)",
              border: "1px solid rgba(0,0,0,0.05)"
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveNote(null)}
              className="absolute top-3 right-4 text-xl font-bold text-neutral-400 hover:text-neutral-800 transition-colors"
              aria-label="Close note"
            >
              ×
            </button>

            {/* Note Content */}
            <div className="font-[var(--font-display)] text-neutral-800">
              <h2 className="text-2xl font-bold tracking-tight mb-4 border-b border-neutral-300 pb-2 border-dashed">
                {notesData[activeNote].title}
              </h2>
              <div className="text-lg leading-relaxed space-y-4 whitespace-pre-line font-[var(--font-body)]">
                {notesData[activeNote].content}
              </div>
            </div>

            {/* Note tape styling */}
            <div className="absolute top-[-15px] left-1/2 -translate-x-1/2 w-24 h-8 bg-white/60 backdrop-blur-sm -rotate-2 shadow-sm border border-neutral-200/50 mix-blend-overlay"></div>
          </div>

          <div className="absolute inset-0 -z-10" onClick={() => setActiveNote(null)} />
        </div>
      )}
    </div>
  );
}
