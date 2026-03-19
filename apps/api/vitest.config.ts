import { resolve } from 'path';
import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
  test: {
    globals: true,
    setupFiles: ['reflect-metadata'],
    root: './',
    environment: 'node',
    include: ['src/**/*.spec.ts'],
    exclude: ['node_modules/**', 'dist/**', 'coverage/**'],
    reporters: ['default', 'hanging-process'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'dist/',
        'coverage/',
        'test/',
        'data-source.ts',

        '**/index.{js,ts}',

        // Configuration files
        '**/*.config.{js,ts}',
        '**/*.config.e2e.{js,ts}',
        '**/*.conf.{js,ts}',
        'eslint.config.mjs',
        'vitest.config.ts',
        'nest-cli.json',

        // TypeScript definitions
        '**/*.d.ts',

        // Main entry points (usually just bootstrap code)
        'src/main.ts',

        // Database migrations and seeds
        'src/data/migrations/**',
        'src/seeds/**',
        'src/telemetry/**',

        // Generated files
        'src/**/*.generated.{js,ts}',

        // Interfaces and types (no logic to test)
        'src/**/interfaces/**',
        'src/**/types/**',
        'src/**/*.interface.{js,ts}',
        'src/**/*.type.{js,ts}',
        'src/**/*.enum.{js,ts}',

        // DTOs (data transfer objects - minimal logic)
        'src/**/dto/**',
        'src/**/*.dto.{js,ts}',

        // Entity/Model definitions (ORM entities)
        'src/**/entities/**',
        'src/**/*.entity.{js,ts}',
        'src/**/models/**',
        'src/**/*.model.{js,ts}',

        // Constants and configuration
        'src/**/constants/**',
        'src/**/*.constants.{js,ts}',
        'src/config/**',

        // Decorators (unless they contain complex logic)
        'src/**/decorators/**',
        'src/**/*.decorator.{js,ts}',

        // Guards, interceptors, pipes with minimal logic
        'src/**/guards/*.guard.{js,ts}',
        'src/**/interceptors/*.interceptor.{js,ts}',
        'src/**/pipes/*.pipe.{js,ts}',

        // Exception filters
        'src/**/filters/**',
        'src/**/*.filter.{js,ts}',
        //exclude eslint.config.mjs
        'eslint.config.mjs',
        // exlude ./src/app.module.ts
        'src/app.module.ts',
        //exclude ./src/app.data-source.ts
        'src/app.data-source.ts',
        'src/instrumentation.ts',
        '**/*.module.{js,ts}',
        'src/files/optimization/category-search-performance-test.ts',
      ],
      enabled: false,
    },
    alias: {
      '@': resolve(__dirname, './src'),
    },
    testTimeout: 10000,
    watch: true,
    ui: false,
    open: false,
  },
});
