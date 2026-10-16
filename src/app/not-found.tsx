import "@kit/kit.css";
import "./(fengshui)/world.css";
import { ErrorView } from "@/components/fengshui/world/ErrorView";
import { WorldFooter } from "@/components/fengshui/world/WorldFooter";
import { WorldHeader } from "@/components/fengshui/world/WorldHeader";
import { SkipLink } from "@/components/fengshui/world/SkipLink";
import { createMetadata } from "@/lib/metadata";
import { worldSans, worldSerif } from "./world-font";

export const metadata = createMetadata({
  title: "Page not found",
  description: "This page was not found. / Không tìm thấy trang này.",
  robots: { index: false, follow: false },
});

/** The 404 page of the whole site (the static export writes it to 404.html), in the look of the Feng Shui world. */
export default function NotFound() {
  return (
    <div className={`fs-world ${worldSerif.variable} ${worldSans.variable}`}>
      <SkipLink />
      <WorldHeader />
      <main id="fs-main" tabIndex={-1}>
        <ErrorView kind="notFound" />
      </main>
      <WorldFooter />
    </div>
  );
}
