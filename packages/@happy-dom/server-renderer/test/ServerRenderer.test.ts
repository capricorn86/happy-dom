import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest';
import ServerRenderer from '../src/ServerRenderer.js';
import MockedURLList from './MockedURLList.js';
import IServerRendererResult from '../src/IServerRendererResult.js';
import MockedWorker from './MockedWorker.js';

vi.mock('worker_threads', async () => {
	const MockedWorker = await import('./MockedWorker.js');
	return {
		Worker: MockedWorker.default
	};
});

describe('ServerRenderer', () => {
	beforeEach(() => {
		MockedWorker.openWorkers.length = 0;
		MockedWorker.terminatedWorkers.length = 0;
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('render()', () => {
		it('Renders pages in workers.', async () => {
			const renderer = new ServerRenderer();
			let results: IServerRendererResult[];

			debugger;
			renderer.render(MockedURLList).then((r) => {
				results = r;
			});

			// Cache warmup
			const worker = MockedWorker.openWorkers[0];
			worker.listeners.message[0]({
				results: worker.postedData[0].items
			});

			await new Promise((resolve) => setTimeout(resolve));

			expect(MockedWorker.openWorkers.length > 1).toBe(true);

			for (const worker of MockedWorker.openWorkers) {
				worker.listeners.message[0]({
					results: worker.postedData[0].items
				});
			}

			await new Promise((resolve) => setTimeout(resolve));

			expect(results!).toEqual(MockedURLList.map((url) => ({ url })));
		});
	});
});
