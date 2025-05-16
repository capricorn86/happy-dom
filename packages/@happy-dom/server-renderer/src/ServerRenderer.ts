import IOptionalServerRendererConfiguration from './types/IOptionalServerRendererConfiguration.js';
import IServerRendererItem from './types/IServerRendererItem.js';
import { Worker } from 'worker_threads';
import IServerRendererResult from './types/IServerRendererResult.js';
import ServerRendererLogLevelEnum from './types/ServerRendererLogLevelEnum.js';
import IServerRendererConfiguration from './types/IServerRendererConfiguration.js';
import ServerRendererConfigurationFactory from './utilities/ServerRendererConfigurationFactory.js';
import Path from 'path';
import Inspector from 'node:inspector';
import Chalk from 'chalk';
import ServerRendererBrowser from './ServerRendererBrowser.js';

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
	#browser: ServerRendererBrowser | null = null;

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
	 * @param [urls] URLs to render.
	 * @param [options] Options.
	 * @param [options.headers] Headers.
	 */
	public async render(
		urls?: Array<string | IServerRendererItem> | null
	): Promise<IServerRendererResult[]> {
		const startTime = performance.now();
		const configuration = this.#configuration;
		const items = urls || configuration.urls;
		const parsedItems: IServerRendererItem[] = [];

		if (!items || !items.length) {
			if (configuration.logLevel >= ServerRendererLogLevelEnum.info) {
				// eslint-disable-next-line no-console
				console.log(Chalk.bold(`\nNo URLs to render\n`));
			}
			return [];
		}

		for (const item of urls) {
			if (typeof item === 'string') {
				parsedItems.push({ url: item });
			} else {
				parsedItems.push({
					url: item.url,
					outputFile: item.outputFile
						? Path.join(configuration.outputDirectory, item.outputFile)
						: null,
					headers: item.headers ?? null
				});
			}
		}

		if (configuration.logLevel >= ServerRendererLogLevelEnum.info) {
			if (configuration.debug) {
				// eslint-disable-next-line no-console
				console.log(Chalk.blue(Chalk.bold(`🔨 Debug mode enabled\n`)));
			}

			// eslint-disable-next-line no-console
			console.log(
				Chalk.bold(`Rendering ${parsedItems.length} page${parsedItems.length > 1 ? 's' : ''}...\n`)
			);
		}

		let results: IServerRendererResult[] = [];
		if (!configuration.cache.disable) {
			const item = parsedItems.shift();
			if (item) {
				results = results.concat(await this.#runInWorker([item], true));
			}
		}

		if (parsedItems.length) {
			const promises = [];

			while (parsedItems.length) {
				const chunk = parsedItems.splice(0, configuration.render.maxConcurrency);
				promises.push(
					this.#runInWorker(chunk).then((chunkResults) => {
						results = results.concat(chunkResults);
					})
				);
			}

			await Promise.all(promises);
		}

		for (const worker of this.#workerPool.busy) {
			worker.terminate();
		}

		for (const worker of this.#workerPool.free) {
			worker.terminate();
		}

		this.#workerPool.busy = [];
		this.#workerPool.free = [];
		this.#workerPool.waiting = [];

		if (configuration.logLevel >= ServerRendererLogLevelEnum.info) {
			const time = Math.round((performance.now() - startTime) / 1000);
			const minutes = Math.floor(time / 60);
			const seconds = time % 60;
			// eslint-disable-next-line no-console
			console.log(
				Chalk.bold(
					`\nRendered ${items.length} page${items.length > 1 ? 's' : ''} in ${
						minutes ? `${minutes} minutes and ` : ''
					}${seconds} seconds\n`
				)
			);
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
		isCacheWarmup = false
	): Promise<IServerRendererResult[]> {
		const configuration = this.#configuration;

		if (configuration.worker.disable) {
			if (!this.#browser) {
				this.#browser = new ServerRendererBrowser(configuration);
			}

			const results = await this.#browser.render(items, isCacheWarmup);

			this.outputResults(results);

			return results;
		}
		return new Promise((resolve, reject) => {
			if (this.#workerPool.free.length === 0) {
				const maxConcurrency = configuration.inspect ? 1 : configuration.worker.maxConcurrency;
				if (this.#workerPool.busy.length >= maxConcurrency) {
					this.#workerPool.waiting.push({ items, isCacheWarmup, resolve, reject });
					return;
				}
				const worker = new Worker(new URL('ServerRendererWorker.js', import.meta.url), {
					workerData: {
						configuration: configuration
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
						this.outputResults(results);
						done();
						resolve(results);
					},
					error: (error: Error) => {
						if (configuration.logLevel >= ServerRendererLogLevelEnum.error) {
							for (const item of items) {
								// eslint-disable-next-line no-console
								console.error(Chalk.bold(Chalk.red(`\n❌ Failed to render page "${item.url}"\n`)));
								// eslint-disable-next-line no-console
								console.error(Chalk.red(error + '\n'));
							}
						}

						done();
						resolve(
							items.map((item) => ({
								url: item.url,
								content: null,
								status: 500,
								statusText: 'Internal Server Error',
								headers: {},
								outputFile: item.outputFile ?? null,
								error: `${error.message}\n${error.stack}`,
								pageConsole: '',
								pageErrors: []
							}))
						);
					},
					exit: (code: number) => {
						// Closed intentionally, either by the user or with terminate()
						if (code === 0) {
							return;
						}

						this.#workerPool.busy.splice(this.#workerPool.busy.indexOf(worker), 1);

						for (const worker of this.#workerPool.free) {
							worker.terminate();
						}

						for (const worker of this.#workerPool.busy) {
							worker.terminate();
						}

						this.#workerPool.busy = [];
						this.#workerPool.free = [];
						this.#workerPool.waiting = [];

						reject(new Error(`Worker stopped with exit code ${code}`));
					}
				};

				worker.on('message', listeners.message);
				worker.on('error', listeners.error);
				worker.on('exit', listeners.exit);

				worker.postMessage({ items, isCacheWarmup });
			}
		});
	}

	/**
	 * Outputs results to the console.
	 *
	 * @param results Results.
	 */
	private outputResults(results: IServerRendererResult[]): void {
		const configuration = this.#configuration;

		if (configuration.logLevel === ServerRendererLogLevelEnum.none) {
			return;
		}

		for (const result of results) {
			if (result.error) {
				if (configuration.logLevel >= ServerRendererLogLevelEnum.error) {
					// eslint-disable-next-line no-console
					console.error(Chalk.bold(Chalk.red(`\n❌ Failed to render page "${result.url}"\n`)));
					// eslint-disable-next-line no-console
					console.error(Chalk.red(result.error + '\n'));
				}
			} else if (result.pageErrors.length) {
				if (configuration.logLevel >= ServerRendererLogLevelEnum.warn) {
					// eslint-disable-next-line no-console
					console.log(Chalk.bold(`• Rendered page "${result.url}"`));
					// eslint-disable-next-line no-console
					console.log(
						Chalk.bold(
							Chalk.yellow(
								`\n⚠️ Warning! Errors where outputted to the browser when the page was rendered.\n`
							)
						)
					);
					// eslint-disable-next-line no-console
					for (const error of result.pageErrors) {
						// eslint-disable-next-line no-console
						console.log(Chalk.red(error + '\n'));
					}
				}
			} else {
				if (configuration.logLevel >= ServerRendererLogLevelEnum.info) {
					// eslint-disable-next-line no-console
					console.log(Chalk.bold(`• Rendered page "${result.url}"`));
				}
			}
			if (configuration.logLevel >= ServerRendererLogLevelEnum.debug && result.pageConsole) {
				// eslint-disable-next-line no-console
				console.log(Chalk.gray(result.pageConsole));
			}
		}
	}
}
