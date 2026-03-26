import { siteContent } from "@/content/site-content";

export type HomeNoteKey = "backend" | "infra" | "about" | "oss" | "contact";

export type StickerAsset = {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  className: string;
};

export type InteractiveSticker = StickerAsset & {
  note: HomeNoteKey;
  tooltip: string;
};

export type HomeNoteCard = {
  title: string;
  content: string;
  label: string;
};

export const heroStickerConfig = {
  width: 360,
  height: 540,
  className:
    "absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer drop-shadow-xl transition-transform duration-300 hover:scale-105",
  tooltip: "Click for my CV",
  href: "https://toanngo.cv",
};

export const decorStickers: StickerAsset[] = [
  {
    id: "game",
    src: "/sticker/decor_game.png",
    alt: "Game",
    width: 200,
    height: 200,
    className: "absolute top-[10%] right-[15%] rotate-12 drop-shadow-md",
  },
  {
    id: "feng-shui",
    src: "/sticker/decor_fengshui.png",
    alt: "Feng Shui",
    width: 180,
    height: 180,
    className: "absolute bottom-[20%] left-[8%] -rotate-6 drop-shadow-md",
  },
  {
    id: "plane",
    src: "/sticker/plane.png",
    alt: "Plane",
    width: 220,
    height: 220,
    className: "absolute top-[20%] left-[25%] -rotate-[15deg] drop-shadow-md",
  },
  {
    id: "movie",
    src: "/sticker/decor_movie.png",
    alt: "Movie",
    width: 160,
    height: 160,
    className: "absolute bottom-[10%] right-[30%] rotate-3 drop-shadow-md transition-transform",
  },
];

export const interactiveStickers: InteractiveSticker[] = [
  {
    id: "backend",
    note: "backend",
    src: "/sticker/working_1_focus.png",
    alt: "Backend",
    width: 260,
    height: 390,
    className:
      "absolute top-[25%] right-[8%] z-10 group drop-shadow-lg transition-transform duration-300 hover:scale-110 hover:-rotate-3",
    tooltip: "Backend Info",
  },
  {
    id: "infra",
    note: "infra",
    src: "/sticker/working_2_friendly.png",
    alt: "Infra",
    width: 280,
    height: 420,
    className:
      "absolute top-[60%] right-[15%] z-10 group drop-shadow-lg transition-transform duration-300 hover:scale-110 hover:rotate-3",
    tooltip: "Infra & Homelab",
  },
  {
    id: "about",
    note: "about",
    src: "/sticker/standing_1.png",
    alt: "About",
    width: 240,
    height: 360,
    className:
      "absolute top-[50%] left-[10%] z-10 group drop-shadow-lg transition-transform duration-300 hover:scale-110 hover:-rotate-2",
    tooltip: "About Me",
  },
  {
    id: "oss",
    note: "oss",
    src: "/sticker/ship_1.png",
    alt: "Ship - OSS",
    width: 200,
    height: 200,
    className:
      "absolute bottom-[15%] left-[25%] z-10 group drop-shadow-lg transition-transform duration-300 hover:scale-110 hover:-translate-y-2",
    tooltip: "Open Source",
  },
  {
    id: "contact",
    note: "contact",
    src: "/sticker/walking_1.png",
    alt: "Contact",
    width: 180,
    height: 270,
    className:
      "absolute top-[10%] left-[45%] z-10 group drop-shadow-lg transition-transform duration-500 hover:scale-110 hover:translate-x-4",
    tooltip: "Contact",
  },
];

export const homeNotes: Record<HomeNoteKey, HomeNoteCard> = {
  backend: {
    title: "Backend Engineer",
    content:
      "I design and build robust backend systems primarily in Go. Focusing on service boundaries, API contracts, and clean delivery flows.",
    label: "Click to read about Backend",
  },
  infra: {
    title: "Homelab & Infra",
    content:
      "My personal proving ground: a 3-node k3s cluster, Argo CD sync flows, and an observability stack (Grafana/Loki/Jaeger).",
    label: "Click to read about Infrastructure",
  },
  about: {
    title: "Who am I?",
    content:
      "I'm Toan Ngo. I enjoy building practical and durable systems, stuff that runs well and stays easy to operate over time.",
    label: "Click to read About Me",
  },
  oss: {
    title: "Open Source",
    content:
      "I build public products like Bazica, an open-source Go library and live demo for Ba-zi charts. It's my public playground.",
    label: "Click to read about Open Source",
  },
  contact: {
    title: "Get in touch",
    content:
      "Email: toan.ngo.contact@gmail.com\nLocation: Vietnam\nFind me on GitHub (@tommitoan) and LinkedIn.",
    label: "Click for Contact info",
  },
};

export const heroStickerFrames = siteContent.home.stickerStates;
