import { readFileSync } from "node:fs";
import path from "node:path";
import { Noto_Serif } from "next/font/google";
import "@kit/kit.css";
import "./world.css";
import { hanFontHref } from "@/components/fengshui/world/han";
import { KitMount } from "@/components/fengshui/world/KitMount";
import { WorldFooter } from "@/components/fengshui/world/WorldFooter";
import { WorldHeader } from "@/components/fengshui/world/WorldHeader";

const worldSerif = Noto_Serif({
  subsets: ["latin", "vietnamese"],
  weight: "400",
  variable: "--font-world-serif",
});

/** Adds the paper cover before first paint when the visitor arrives from the sister site. */
const bootScript = readFileSync(path.join(process.cwd(), "kit/dist/kit-boot.js"), "utf8");

export default function FengShuiLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`fs-world ${worldSerif.variable}`}>
      <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href={hanFontHref()} precedence="default" />
      <KitMount />
      <WorldHeader />
      <main>{children}</main>
      <WorldFooter />
    </div>
  );
}
