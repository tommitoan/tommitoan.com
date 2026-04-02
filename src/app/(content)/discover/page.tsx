import Image from "next/image";
import Link from "next/link";
import { createMetadata } from "@/lib/metadata";
import { PageShell } from "@/components/layout/page-shell";

export const metadata = createMetadata({
  title: "Discover",
  description: "Coming soon.",
  path: "/discover/",
});

export default function DiscoverPage() {
  return (
    <PageShell className="!py-0 flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center text-center">
      <div className="flex flex-col items-center gap-0 max-w-lg mx-auto">
        <div
          className="relative overflow-hidden rounded-2xl border-2 border-black"
          style={{
            width: "clamp(18rem, 60vh, 44rem)",
            height: "clamp(12rem, 42vh, 30rem)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.72), 0 2px 12px rgba(0,0,0,0.5)",
          }}
        >
          <Image
            src="/announcement/building.png"
            alt="Planet under construction"
            fill
            className="object-cover object-bottom"
            priority
          />
        </div>

        <div className="space-y-2 mt-4">
          <h1 className="font-[var(--font-display)] text-3xl md:text-4xl font-semibold tracking-[-0.05em] text-white">
            This planet is being built
          </h1>
          <p className="text-base leading-8 text-white/60 max-w-sm mx-auto">
            The Discover section is under active construction and will be released soon. Please check back later.
          </p>
        </div>

        <Link
          href="/"
          className="mt-5 inline-flex rounded-full border border-white/12 bg-white/4 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/8"
        >
          Return to gateway
        </Link>
      </div>
    </PageShell>
  );
}
