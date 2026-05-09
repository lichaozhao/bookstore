import type { expect as playwrightExpect, test as playwrightTest } from '@playwright/test';

declare global {
  const test: typeof playwrightTest;
  const expect: typeof playwrightExpect;
}

export {};