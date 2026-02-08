import { parentPort, workerData } from 'worker_threads';
import Inspector from 'node:inspector';
import { GlobalRegistrator } from '@happy-dom/global-registrator';
import type { Document, Window } from 'happy-dom';
import WindowBrowserContext from 'happy-dom/lib/window/WindowBrowserContext.js';
import ServerRendererPage from './ServerRendererPage.js';

declare global {
	const document: Document;
	const window: Window;
}

/**
 * Server renderer worker.
 */
export default class ServerRendererPageWorker {
	/**
	 * Connects to the worker.
	 */
	public static async connect(): Promise<void> {
		const { configuration } = workerData;

		if (configuration.inspect) {
			Inspector.open();
			Inspector.waitForDebugger();
		}

		GlobalRegistrator.register({
			url: 'https://localhost:8080/',
			settings: configuration.browser
		});

		const renderer = new ServerRendererPage(configuration);

		parentPort?.on('message', async ({ items }) => {
			if (items.length !== 1) {
				throw new Error(
					'Failed to render page worker. Page workers can only render one item at a time.'
				);
			}

			const page = new WindowBrowserContext(window).getBrowserPage();

			if (!page) {
				throw new Error('Failed to render page. No browser page available.');
			}

			const result = await renderer.render(page, items[0]);

			parentPort?.postMessage({ status: 'done', results: [result] });
		});
	}
}

ServerRendererPageWorker.connect();
