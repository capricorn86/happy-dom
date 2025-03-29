import IOptionalServerRendererOptions from './IOptionalServerRendererOptions.js';
import IServerRendererItem from './IServerRendererItem.js';
import { Worker } from 'worker_threads';
import IServerRendererResult from './IServerRendererResult.js';
import ServerRendererLogLevelEnum from './ServerRendererLogLevelEnum.js';

interface IWorkerWaitingItem {
    items: IServerRendererItem[];
    isCacheWarmup?: boolean;
    resolve: (results: IServerRendererResult[]) => void;
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
	public async render(items: Array<string | IServerRendererItem>): Promise<IServerRendererResult[]> {
        const parsedItems: IServerRendererItem[] = [];

        for (const item of items) {
            if (typeof item === 'string') {
                parsedItems.push({ url: item });
            } else {
                parsedItems.push(item);
            }
        }

        if(!this.#options.disableCache) {
            const item = parsedItems.shift();
            if(item) {
                await this.#runInWorker([item], true);
            }
        }

        const promises = [];
        let results: IServerRendererResult[] = [];
        
        while (parsedItems.length) {
            const chunk = parsedItems.splice(0, this.#options.render.maxConcurrency);
            promises.push(this.#runInWorker(chunk).then((chunkResults) => {
                results = results.concat(chunkResults);
            }));
        }

        await Promise.all(promises);

        return results;
    }

	/**
	 * Runs in a worker.
     * 
     * @param items Items.
     * @param isCacheWarmup Is cache warmup.
	 */
	async #runInWorker(items: IServerRendererItem[], isCacheWarmup?: boolean): Promise<IServerRendererResult[]> {
		if (this.#options.worker.disable) {
			const Browser = await import('./ServerRendererBrowser.js');
            const browser = new Browser.default(this.#options);
			await browser.render(items, isCacheWarmup);
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

                const done = () => {
                    worker.off('message', listeners.message);
                    worker.off('error', listeners.error);
                    worker.off('exit', listeners.exit);

                    this.#workerPool.busy.splice(this.#workerPool.busy.indexOf(worker), 1);
                    this.#workerPool.free.push(worker);

                    const waiting = this.#workerPool.waiting.shift();

                    if(waiting) {
                        this.#runInWorker(waiting.items, waiting.isCacheWarmup).then(waiting.resolve).catch(waiting.reject);
                    }
                }
                const listeners: {
                    message: (message: any) => void;
                    error: (error: Error) => void;
                    exit: (code: number) => void;
                } = {
                    message: (event) => {
                        const results = <IServerRendererResult[]>event.data.results;

                        if(this.#options.logLevel !== ServerRendererLogLevelEnum.none) {
                            for (const result of results) {
                                if(result.error) {
                                    if(this.#options.logLevel === ServerRendererLogLevelEnum.error) {
                                        // eslint-disable-next-line no-console
                                        console.error(` - Failed to render page "${result.url}": ${result.error}`);
                                    }
                                } else {
                                    if(this.#options.logLevel >= ServerRendererLogLevelEnum.info) {
                                        // eslint-disable-next-line no-console
                                        console.log(' - Rendered page "' + result.url);
                                    }
                                }
                            }
                        }

                        done();
                        resolve(results);
                    },
                    error: (error: Error) => {
                        if(this.#options.logLevel === ServerRendererLogLevelEnum.error) {
                            for (const item of items) {
                                // eslint-disable-next-line no-console
                                console.error(` - Failed to render page "${item.url}": ${error}`);
                            }
                        }

                        done();
                        resolve(items.map((item) => ({ url: item.url, content: null, outputFile: item.outputFile ?? null, error: `${error.message}\n${error.stack}` })));
                    },
                    exit: (code: number) => {
                        if (code !== 0) {
                            this.#workerPool.busy.splice(this.#workerPool.busy.indexOf(worker), 1);

                            for(const worker of this.#workerPool.busy) {
                                worker.terminate();
                            }

                            this.#workerPool.busy = [];
                            this.#workerPool.free = [];
                            this.#workerPool.waiting = [];

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
