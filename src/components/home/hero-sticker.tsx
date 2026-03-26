"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export function HeroSticker() {
  const [stamp, setStamp] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isHovered) {
      if (stamp === 1) {
        setStamp(2);
      } else if (stamp === 2) {
        // We need a way to know if we've already done state 3 and returned to 2.
        // If it's the initial transition:
        timeoutId = setTimeout(() => setStamp(4), 400); // use 4 as a temporary state for 'sit_3' 
      } else if (stamp === 4) {
        timeoutId = setTimeout(() => setStamp(5), 400); // 5 represents the final 'sit_2' state
      }
    } else {
      setStamp(1);
    }

    return () => clearTimeout(timeoutId);
  }, [isHovered, stamp]);

  const getImageSrc = () => {
    switch (stamp) {
      case 1: return "/sticker/sit_1_think.png";
      case 2: return "/sticker/sit_2_think.png";
      case 4: return "/sticker/sit_3_idea.png"; // temporary for state 3
      case 5: return "/sticker/sit_2_think.png"; // final state 2
      case 3: return "/sticker/sit_3_idea.png"; // fallback
    }
  };

  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer drop-shadow-xl hover:scale-105 transition-transform duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => window.open('https://toanngo.cv', '_blank')}
    >
      <div className="relative group">
        <Image
          src={getImageSrc()}
          alt="Hero Character"
          width={360}
          height={540}
          priority
          className="object-contain"
        />
        {/* Tooltip on hover */}
        <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-2 rounded-xl text-neutral-800 font-medium text-sm shadow-md border border-black/5 opacity-0 group-hover:opacity-100 transition-opacity">
          Click for my CV
        </div>
      </div>
    </div>
  );
}
