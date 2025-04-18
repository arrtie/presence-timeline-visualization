// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  // "listen on all addresses, including LAN and public addresses"
  server: { host: true },
  // toolbar gets in the way of tests
  devToolbar: {
    enabled: false,
  },
  // integrate react with astro
  integrations: [react()]
});