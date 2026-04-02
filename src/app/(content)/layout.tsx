import { StarsBackgroundClient } from "@/components/tech/StarsBackgroundClient";
import { spaceThemeBackgroundStyle, spaceThemeOverlayStyle } from "@/components/gateway/gatewayHomeConfig";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function ContentLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen text-white">
      <div className="pointer-events-none fixed inset-0 -z-30" style={spaceThemeBackgroundStyle} />
      <div className="pointer-events-none fixed inset-0 -z-20" style={spaceThemeOverlayStyle} />
      <div className="pointer-events-none fixed inset-0 -z-20 foundation-grid opacity-15" />
      <StarsBackgroundClient />
      <SiteHeader />
      <main className="relative z-10">{children}</main>
      <SiteFooter />
    </div>
  );
}
