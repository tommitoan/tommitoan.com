import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: [
      { find: /^@kit$/, replacement: path.resolve(__dirname, "kit/src/index.ts") },
      { find: /^@kit\//, replacement: `${path.resolve(__dirname, "kit/src")}/` },
      { find: /^@\//, replacement: `${path.resolve(__dirname, "src")}/` },
    ],
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "kit/**/*.test.ts"],
  },
});
