import { defineConfig } from 'vitest/config';

export default defineConfig({
	cacheDir: '.turbo/vitest',
	test: {
		environment: 'node',
		include: ['./test/**/*.test.ts'],
		setupFiles: ['./test/setup.ts'],
		testTimeout: 500,
		restoreMocks: true
	}
});
