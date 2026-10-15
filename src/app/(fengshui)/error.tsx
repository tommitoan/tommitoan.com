"use client";

import { ErrorView } from "@/components/fengshui/world/ErrorView";

/** Shown inside the world's header and footer when a page of the world throws while it renders. */
export default function WorldError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorView kind="error" onRetry={reset} />;
}
