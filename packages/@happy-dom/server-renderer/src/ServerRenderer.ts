import IOptionalServerRendererConfiguration from './IOptionalServerRendererConfiguration.js';
import IServerRendererItem from './IServerRendererItem.js';
import { Worker } from 'worker_threads';
import IServerRendererResult from './IServerRendererResult.js';
import ServerRendererLogLevelEnum from './ServerRendererLogLevelEnum.js';
import IServerRendererConfiguration from './IServerRendererConfiguration.js';
import ServerRendererConfigurationFactory from './ServerRendererConfigurationFactory.js';
import Path from 'path';
import Inspector from 'node:inspector';
import Chalk from 'chalk';

interface IWorkerWaitingItem {
	items: IServerRendererItem[];
	isCacheWarmup?: boolean;
	resolve: (results: IServerRendererResult[]) => void;
	reject: (error: Error) => void;
}

/**
 * Server renderer.
 */
export default class ServerRenderer {
	#configuration: IServerRendererConfiguration;
	#workerPool: { busy: Worker[]; free: Worker[]; waiting: IWorkerWaitingItem[] } = {
		busy: [],
		free: [],
		waiting: []
	};

	/**
	 * Constructor.
	 *
	 * @param configuration Configuration.
	 */
	constructor(configuration?: IOptionalServerRendererConfiguration) {
		this.#configuration = ServerRendererConfigurationFactory.createConfiguration(configuration);

		if (this.#configuration.worker.disable && this.#configuration.inspect) {
			Inspector.open();
			Inspector.waitForDebugger();
		}
	}

	/**
	 * Renders URLs.
	 *
	 * @param items Items.
	 */
	public async render(
		items: Array<string | IServerRendererItem>
	): Promise<IServerRendererResult[]> {
		const startTime = performance.now();
		const parsedItems: IServerRendererItem[] = [];

		for (const item of items) {
			if (typeof item === 'string') {
				parsedItems.push({ url: item });
			} else {
				parsedItems.push({
					url: item.url,
					outputFile: item.outputFile
						? Path.join(this.#configuration.outputDirectory, item.outputFile)
						: null
				});
			}
		}

		if (this.#configuration.logLevel >= ServerRendererLogLevelEnum.info) {
			// eslint-disable-next-line no-console
			console.log(`Rendering ${parsedItems.length} page${parsedItems.length > 1 ? 's' : ''}`);
		}

		let results: IServerRendererResult[] = [];
		if (!this.#configuration.cache.disable) {
			const item = parsedItems.shift();
			if (item) {
				results = results.concat(await this.#runInWorker([item], true));
			}
		}

		const promises = [];

		while (parsedItems.length) {
			const chunk = parsedItems.splice(0, this.#configuration.render.maxConcurrency);
			promises.push(
				this.#runInWorker(chunk).then((chunkResults) => {
					results = results.concat(chunkResults);
				})
			);
		}

		await Promise.all(promises);

		for (const worker of this.#workerPool.busy) {
			worker.terminate();
		}

		for (const worker of this.#workerPool.free) {
			worker.terminate();
		}

		this.#workerPool.busy = [];
		this.#workerPool.free = [];
		this.#workerPool.waiting = [];

		if (this.#configuration.logLevel >= ServerRendererLogLevelEnum.info) {
			const time = Math.round((performance.now() - startTime) / 1000);
			const minutes = Math.floor(time / 60);
			const seconds = time % 60;
			// eslint-disable-next-line no-console
			console.log(`Rendered ${items.length} pages in ${minutes} minutes and ${seconds} seconds`);
		}

		return results;
	}

	/**
	 * Runs in a worker.
	 *
	 * @param items Items.
	 * @param isCacheWarmup Is cache warmup.
	 */
	async #runInWorker(
		items: IServerRendererItem[],
		isCacheWarmup?: boolean
	): Promise<IServerRendererResult[]> {
		if (this.#configuration.worker.disable) {
			const Browser = await import('./ServerRendererBrowser.js');
			const browser = new Browser.default(this.#configuration);
			const results = await browser.render(items, isCacheWarmup);
			for (const result of results) {
				if (result.error) {
					if (this.#configuration.logLevel >= ServerRendererLogLevelEnum.error) {
						// eslint-disable-next-line no-console
						console.error(` - Failed to render page "${result.url}": ${result.error}`);
					}
				} else {
					if (this.#configuration.logLevel >= ServerRendererLogLevelEnum.info) {
						// eslint-disable-next-line no-console
						console.log(' - Rendered page "' + result.url);
					}
				}
			}
			return results;
		}
		return new Promise((resolve, reject) => {
			if (this.#workerPool.free.length === 0) {
				const maxConcurrency = this.#configuration.inspect
					? 1
					: this.#configuration.worker.maxConcurrency;
				if (this.#workerPool.busy.length >= maxConcurrency) {
					this.#workerPool.waiting.push({ items, isCacheWarmup, resolve, reject });
					return;
				}
				const worker = new Worker(new URL('ServerRendererWorker.js', import.meta.url), {
					workerData: {
						configuration: this.#configuration
					}
				});
				this.#workerPool.free.push(worker);
			}

			if (this.#workerPool.free.length > 0) {
				const worker = this.#workerPool.free.pop();

				this.#workerPool.busy.push(worker);

				const done = (): void => {
					worker.off('message', listeners.message);
					worker.off('error', listeners.error);
					worker.off('exit', listeners.exit);

					this.#workerPool.busy.splice(this.#workerPool.busy.indexOf(worker), 1);
					this.#workerPool.free.push(worker);

					const waiting = this.#workerPool.waiting.shift();

					if (waiting) {
						this.#runInWorker(waiting.items, waiting.isCacheWarmup)
							.then(waiting.resolve)
							.catch(waiting.reject);
					}
				};
				const listeners: {
					message: (message: any) => void;
					error: (error: Error) => void;
					exit: (code: number) => void;
				} = {
					message: (data) => {
						const results = <IServerRendererResult[]>data.results;

						if (this.#configuration.logLevel !== ServerRendererLogLevelEnum.none) {
							for (const result of results) {
								if (result.error) {
									if (this.#configuration.logLevel >= ServerRendererLogLevelEnum.error) {
										// eslint-disable-next-line no-console
										console.error(
											Chalk.red(`❌ Failed to render page "${result.url}"\n   ${result.error}`)
										);
									}
								} else if (result.pageErrors.length) {
									if (this.#configuration.logLevel >= ServerRendererLogLevelEnum.warn) {
										// eslint-disable-next-line no-console
										console.log(Chalk.bold(`• Rendered page "${result.url}"`));
										// eslint-disable-next-line no-console
										console.log(Chalk.red(result.pageErrors.join('\n   ')));
									}
								} else {
									if (this.#configuration.logLevel >= ServerRendererLogLevelEnum.info) {
										// eslint-disable-next-line no-console
										console.log(Chalk.bold(`• Rendered page "${result.url}"`));
									}
								}
								if (this.#configuration.logLevel >= ServerRendererLogLevelEnum.debug) {
									// eslint-disable-next-line no-console
									console.log(Chalk.gray(result.pageConsole));
								}
							}
						}

						done();
						resolve(results);
					},
					error: (error: Error) => {
						if (this.#configuration.logLevel >= ServerRendererLogLevelEnum.error) {
							for (const item of items) {
								// eslint-disable-next-line no-console
								console.error(Chalk.red(`❌ Failed to render page "${item.url}"\n   ${error}`));
							}
						}

						done();
						resolve(
							items.map((item) => ({
								url: item.url,
								content: null,
								outputFile: item.outputFile ?? null,
								error: `${error.message}\n${error.stack}`,
								pageConsole: '',
								pageErrors: []
							}))
						);
					},
					exit: (code: number) => {
						if (code !== 0) {
							this.#workerPool.busy.splice(this.#workerPool.busy.indexOf(worker), 1);

							for (const worker of this.#workerPool.busy) {
								worker.terminate();
							}

							this.#workerPool.busy = [];
							this.#workerPool.free = [];
							this.#workerPool.waiting = [];

							reject(new Error(`Worker stopped with exit code ${code}`));
						}
					}
				};

				worker.on('message', listeners.message);
				worker.on('error', listeners.error);
				worker.on('exit', listeners.exit);

				worker.postMessage({ items, isCacheWarmup });
			}
		});
	}
}
