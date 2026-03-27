export default function GatewayLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="relative min-h-screen text-white">
      {children}
    </main>
  );
}
