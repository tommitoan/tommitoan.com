import { StarsBackgroundClient } from "@/components/tech/StarsBackgroundClient";

export default function GatewayLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="relative min-h-screen text-white">
      <div
        className="pointer-events-none fixed inset-0 -z-30"
        style={{ backgroundImage: "url('/bg.png')", backgroundSize: "cover", backgroundPosition: "center" }}
      />
      <div className="pointer-events-none fixed inset-0 -z-20 bg-[radial-gradient(circle_at_top,rgba(77,150,255,0.10),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(176,87,255,0.08),transparent_24%),linear-gradient(180deg,rgba(3,7,17,0.45)_0%,rgba(7,16,28,0.45)_100%)]" />
      <StarsBackgroundClient />
      {children}
    </main>
  );
}
