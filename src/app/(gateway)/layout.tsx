"use client";

import { useEffect } from "react";
import { gatewayBody, gatewayDisplay } from "../gateway-font";

export default function GatewayLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");
  }, []);

  return (
    <main className={`relative min-h-screen text-white ${gatewayBody.variable} ${gatewayDisplay.variable}`}>
      {children}
    </main>
  );
}
