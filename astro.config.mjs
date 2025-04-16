// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  server: { host: true },
  devToolbar: {
    enabled: false,
  },
  integrations: [react()]
});