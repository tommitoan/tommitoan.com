import { readFileSync } from "node:fs";
import path from "node:path";
import "@kit/kit.css";
import "./world.css";
import { hanFontHref } from "@/components/fengshui/world/han";
import { KitMount } from "@/components/fengshui/world/KitMount";
import { WorldFooter } from "@/components/fengshui/world/WorldFooter";
import { SkipLink } from "@/components/fengshui/world/SkipLink";
import { WorldHeader } from "@/components/fengshui/world/WorldHeader";
import { worldSerif } from "../world-font";

/** Adds the paper cover before first paint when the visitor arrives from the sister site. */
const bootScript = readFileSync(path.join(process.cwd(), "kit/dist/kit-boot.js"), "utf8");

export default function FengShuiLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`fs-world ${worldSerif.variable}`}>
      <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href={hanFontHref()} precedence="default" />
      <KitMount />
      <SkipLink />
      <WorldHeader />
      <main id="fs-main" tabIndex={-1}>
        {children}
      </main>
      <WorldFooter />
    </div>
  );
}
