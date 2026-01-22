import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		projects: ['./packages/happy-dom/', './packages/@happy-dom/server-renderer/']
	}
});
