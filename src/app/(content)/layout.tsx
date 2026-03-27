import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function ContentLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-[#040814] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(77,150,255,0.16),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(176,87,255,0.14),transparent_24%),linear-gradient(180deg,#030711_0%,#07101c_100%)]" />
      <div className="pointer-events-none fixed inset-0 -z-10 foundation-grid opacity-30" />
      <SiteHeader />
      <main className="relative z-10">{children}</main>
      <SiteFooter />
    </div>
  );
}
