import { defineConfig, devices } from "@playwright/test";

// Browser checks run against the production build. Failures are simulated by intercepting the
// directory request inside the test browser; one test also loads from the real API.
const PORT = 4173;

export default defineConfig({
  testDir: "./e2e",
  outputDir: "./e2e/.results",
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    viewport: { width: 1440, height: 900 },
    trace: "retain-on-failure",
  },
  webServer: {
    command: `npm run build && npx vite preview --port ${PORT} --strictPort --host 127.0.0.1`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: false,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"], viewport: { width: 1440, height: 900 } },
    },
  ],
});
