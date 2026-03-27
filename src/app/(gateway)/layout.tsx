export default function GatewayLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <main className="relative min-h-screen overflow-hidden bg-[#040814] text-white">{children}</main>;
}
