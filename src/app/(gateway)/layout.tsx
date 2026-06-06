"use client";

import { useEffect } from "react";

export default function GatewayLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");
  }, []);

  return (
    <main className="relative min-h-screen text-white">
      {children}
    </main>
  );
}
