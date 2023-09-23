/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    reporters: ["junit"],
    outputFile: "./test-results.xml",
  },
});
