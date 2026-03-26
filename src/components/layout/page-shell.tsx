import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageShellProps = {
  children: ReactNode;
  className?: string;
};

export function PageShell({ children, className }: PageShellProps) {
  return <section className={cn("mx-auto w-[min(1120px,calc(100%-1.5rem))] py-16 md:py-24", className)}>{children}</section>;
}
