/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    globals: true,
    include: ["app/**/__tests__/**/*.{test,spec}.{ts,tsx}"],
    css: false,
    mockReset: true,
    restoreMocks: true,
    clearMocks: true,
  },
  resolve: {
    conditions: ["browser", "module", "default"],
  },
});
