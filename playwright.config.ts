import { defineConfig, devices } from '@playwright/test'

/**
 * The acceptance tests run against the real production build over a local
 * static server — the same bytes that go on the iPads.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'off',
    // Honour a pre-installed Chromium when the container ships one that does
    // not match this Playwright build. Unset locally and Playwright's own
    // browser is used.
    launchOptions: process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
  },
  webServer: {
    command: 'npx vite preview --port 4173 --strictPort',
    url: 'http://127.0.0.1:4173/index.html',
    reuseExistingServer: true,
    timeout: 60_000,
  },
  /**
   * Chromium only: this container ships Chromium, not WebKit. The viewports and
   * touch profiles are the real iPad/iPhone ones. Re-run with the WebKit
   * descriptors (drop the browserName override) on a machine that has it before
   * the book goes on the devices.
   */
  projects: [
    { name: 'ipad-11', use: { ...devices['iPad Pro 11'], browserName: 'chromium' } },
    { name: 'ipad-11-landscape', use: { ...devices['iPad Pro 11 landscape'], browserName: 'chromium' } },
    { name: 'iphone', use: { ...devices['iPhone 13'], browserName: 'chromium' } },
  ],
})
