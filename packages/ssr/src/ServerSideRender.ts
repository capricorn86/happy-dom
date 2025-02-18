import { GlobalWindow, PropertySymbol } from 'happy-dom';
import type { IOptionalBrowserSettings } from 'happy-dom';
import IOptionalServerSideRenderOptions from './IOptionalServerSideRenderOptions.js';
import IServerSideRenderItem from './IServerSideRenderItem.js';

/**
 * Server-side rendering.
 */
export default class ServerSideRender {
	#options: IOptionalServerSideRenderOptions;

	/**
	 * Constructor.
	 *
	 * @param options Options.
	 */
	constructor(options?: IOptionalServerSideRenderOptions) {
		this.#options = options;
	}

	/**
	 * Renders URLs.
	 *
	 * @param items Items.
	 */
	public async render(items: IServerSideRenderItem[]): Promise<void> {}

	/**
	 *
	 */
	#runInWorker(): Promise<void> {
		if (disableWorkers) {
			const worker = await import('./serverSideRenderWorker.js');
			await worker.render(workerData);
			return;
		}
		return new Promise((resolve, reject) => {
			const worker = new Worker(
				Path.join(Path.dirname(import.meta.url.replace('file:/', '')), 'serverSideRenderWorker.js'),
				{
					workerData
				}
			);
			worker.on('error', reject);
			worker.on('exit', (code) => {
				if (code !== 0) {
					reject(new Error(`Worker stopped with exit code ${code}`));
				} else {
					for (const url of workerData.urls) {
						// eslint-disable-next-line no-console
						console.log(' - Rendered page: ' + url.url);
					}
					resolve();
				}
			});
		});
	}
}
