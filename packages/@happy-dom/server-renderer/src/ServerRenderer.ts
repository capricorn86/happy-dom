import { GlobalWindow, PropertySymbol } from 'happy-dom-bundle';
import type { IOptionalBrowserSettings } from 'happy-dom-bundle';
import IOptionalServerRendererOptions from './IOptionalServerRendererOptions.js';
import IServerRendererItem from './IServerRendererItem.js';
import { Worker } from 'worker_threads';

interface IWorkerWaitingItem {
    items: IServerRendererItem[];
    isCacheWarmup?: boolean;
    resolve: () => void;
    reject: (error: Error) => void;
}

/**
 * Server-side rendering.
 */
export default class ServerRenderer {
	#options: IOptionalServerRendererOptions;
    #workerPool: { busy: Worker[]; free: Worker[], waiting: IWorkerWaitingItem[] } = { busy: [], free: [], waiting: [] };

	/**
	 * Constructor.
	 *
	 * @param options Options.
	 */
	constructor(options?: IOptionalServerRendererOptions) {
		this.#options = options;
	}

	/**
	 * Renders URLs.
	 *
	 * @param items Items.
	 */
	public async render(items: IServerRendererItem[]): Promise<void> {
        if(!this.#options.disableCache) {
            const item = items[0];
            items = items.slice(1);
            await this.#runInWorker([item], true);
        }

        const promises = [];
        
        while (items.length) {
            const chunk = items.splice(0, this.#options.render.maxConcurrency);
            promises.push(this.#runInWorker(chunk));
        }

        await Promise.all(promises);
    }

	/**
	 *
	 */
	async #runInWorker(items: IServerRendererItem[], isCacheWarmup?: boolean): Promise<void> {
		if (this.#options.worker.disable) {
			const Browser = await import('./ServerRendererBrowser.js');
            const worker = new Browser.default(this.#options);
			await worker.render(items, isCacheWarmup);
			return;
		}
		return new Promise((resolve, reject) => {
            if(this.#workerPool.free.length === 0) {
                if(this.#workerPool.busy.length >= this.#options.worker.maxConcurrency) {
                    this.#workerPool.waiting.push({ items, isCacheWarmup, resolve, reject });
                    return;
                }
                const worker = new Worker(
                    new URL('ServerRendererWorker.js', import.meta.url),
                    {
                        workerData: {
                            options: this.#options
                        }
                    }
                );
                this.#workerPool.free.push(worker);
            }

            if(this.#workerPool.free.length > 0) {
                const worker = this.#workerPool.free.pop();

                this.#workerPool.busy.push(worker);

                const listeners: {
                    message: (message: any) => void;
                    error: (error: Error) => void;
                    exit: (code: number) => void;
                } = {
                    message: () => {
                        for (const item of items) {
                            // eslint-disable-next-line no-console
                            console.log(' - Rendered page: ' + item.url);
                        }
                        worker.off('message', listeners.message);
                        worker.off('error', listeners.error);
                        worker.off('exit', listeners.exit);
                        this.#workerPool.busy.splice(this.#workerPool.busy.indexOf(worker), 1);
                        this.#workerPool.free.push(worker);
                        const waiting = this.#workerPool.waiting.shift();
                        if(waiting) {
                            this.#runInWorker(waiting.items, waiting.isCacheWarmup).then(waiting.resolve).catch(waiting.reject);
                        }
                        resolve();
                    },
                    error: (error: Error) => {
                        // eslint-disable-next-line no-console
                        console.error(error);

                        for (const item of items) {
                            // eslint-disable-next-line no-console
                            console.log(' - Failed to render page: ' + item.url);
                        }

                        worker.off('message', listeners.message);
                        worker.off('error', listeners.error);
                        worker.off('exit', listeners.exit);

                        this.#workerPool.busy.splice(this.#workerPool.busy.indexOf(worker), 1);
                        this.#workerPool.free.push(worker);
                        
                        resolve();
                    },
                    exit: (code: number) => {
                        if (code !== 0) {
                            this.#workerPool.busy.splice(this.#workerPool.busy.indexOf(worker), 1);
                            reject(new Error(`Worker stopped with exit code ${code}`));
                        }
                    }
                }

                worker.on('message', listeners.message);
                worker.on('error', listeners.error);
                worker.on('exit', listeners.exit);

                worker.postMessage({ items, isCacheWarmup });
            }
		});
	}
}
