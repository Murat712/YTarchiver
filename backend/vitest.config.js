import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    envFile: '.env.test',
    setupFiles: ['./tests/setup.js'],
  },
});
