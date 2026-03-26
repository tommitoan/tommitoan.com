"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { heroStickerConfig, heroStickerFrames } from "@/content/home-scene";

export function HeroSticker() {
  const [stamp, setStamp] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [isHovered, setIsHovered] = useState(false);
  const defaultFrame = heroStickerFrames[0]?.image ?? "/sticker/sit_1_think.png";

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (isHovered) {
      if (stamp === 2) {
        timeoutId = setTimeout(() => setStamp(4), 400);
      } else if (stamp === 4) {
        timeoutId = setTimeout(() => setStamp(5), 400);
      }
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isHovered, stamp]);

  const getImageSrc = () => {
    switch (stamp) {
      case 1:
        return heroStickerFrames[0]?.image ?? defaultFrame;
      case 2:
        return heroStickerFrames[1]?.image ?? defaultFrame;
      case 4:
        return heroStickerFrames[2]?.image ?? defaultFrame;
      case 5:
        return heroStickerFrames[1]?.image ?? defaultFrame;
      case 3:
        return heroStickerFrames[2]?.image ?? defaultFrame;
      default:
        return defaultFrame;
    }
  };

  return (
    <div
      className={heroStickerConfig.className}
      onMouseEnter={() => {
        setIsHovered(true);
        setStamp(2);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setStamp(1);
      }}
      onClick={() => window.open(heroStickerConfig.href, "_blank")}
    >
      <div className="relative group">
        <Image
          src={getImageSrc()}
          alt="Hero Character"
          width={heroStickerConfig.width}
          height={heroStickerConfig.height}
          priority
          className="object-contain"
        />
        <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-2 rounded-xl text-neutral-800 font-medium text-sm shadow-md border border-black/5 opacity-0 group-hover:opacity-100 transition-opacity">
          {heroStickerConfig.tooltip}
        </div>
      </div>
    </div>
  );
}
