import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest';
import ServerRenderer from '../src/ServerRenderer.js';
import MockedURLList from './MockedURLList.js';
import IServerRendererResult from '../src/types/IServerRendererResult.js';
import MockedWorker from './MockedWorker.js';
import DefaultServerRendererConfiguration from '../src/config/DefaultServerRendererConfiguration.js';
// eslint-disable-next-line import/no-named-as-default
import Chalk from 'chalk';
import Path from 'path';
import ServerRendererLogLevelEnum from '../src/enums/ServerRendererLogLevelEnum.js';

vi.mock('worker_threads', async () => {
	const MockedWorker = await import('./MockedWorker.js');
	return {
		Worker: MockedWorker.default
	};
});

describe('ServerRenderer', () => {
	const log: string[] = [];

	beforeEach(() => {
		MockedWorker.openWorkers.length = 0;
		MockedWorker.terminatedWorkers.length = 0;
		log.length = 0;
		vi.spyOn(console, 'log').mockImplementation((...args) => {
			log.push(args.join(' '));
		});
		vi.spyOn(console, 'error').mockImplementation((...args) => {
			log.push(args.join(' '));
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('render()', () => {
		it('Renders pages in workers.', async () => {
			const renderer = new ServerRenderer({
				worker: {
					maxConcurrency: 10
				}
			});
			let results: IServerRendererResult[];

			renderer.render(MockedURLList).then((r) => {
				results = r;
			});

			expect(MockedWorker.openWorkers.length).toBe(10);

			for (const worker of MockedWorker.openWorkers) {
				expect(worker.listeners.message.length).toBe(1);
				expect(worker.postedData.length).toBe(1);

				expect(worker.scriptPath.toString()).toBe(
					'file://' + Path.resolve(Path.join('src', 'ServerRendererWorker.js'))
				);

				expect(worker.execArgv).toEqual(['--disallow-code-generation-from-strings']);

				expect(worker.workerData.configuration.cache.directory).toBe(
					Path.resolve(Path.join('happy-dom', 'cache'))
				);
				expect(worker.workerData.configuration.outputDirectory).toBe(
					Path.resolve(Path.join('happy-dom', 'render'))
				);

				expect(worker.workerData.configuration).toEqual({
					...DefaultServerRendererConfiguration,
					outputDirectory: Path.resolve(Path.join('happy-dom', 'render')),
					cache: {
						...DefaultServerRendererConfiguration.cache,
						directory: Path.resolve(Path.join('happy-dom', 'cache'))
					},
					worker: {
						...DefaultServerRendererConfiguration.worker,
						maxConcurrency: 10
					}
				});

				expect(worker.listeners.message.length).toBe(1);
				expect(worker.listeners.error.length).toBe(1);
				expect(worker.listeners.exit.length).toBe(1);
				expect(worker.postedData.length).toBe(1);

				const postedData = worker.postedData[0];
				worker.postedData = [];

				worker.listeners.message[0]({
					results: postedData.items.map((item) => ({
						url: item.url,
						content: '<html></html>',
						outputFile: null,
						error: null,
						pageConsole: '',
						pageErrors: [],
						status: 200,
						statusText: 'OK',
						headers: {
							test: 'value'
						}
					}))
				});
			}

			await new Promise((resolve) => setTimeout(resolve));

			// 10 workers are still open (no workers are terminated)
			expect(MockedWorker.openWorkers.length).toBe(10);

			// 4 workers are busy and are waiting for post message
			for (const worker of MockedWorker.openWorkers.slice(0, 4)) {
				expect(worker.listeners.message.length).toBe(1);
				expect(worker.postedData.length).toBe(1);
				const postedData = worker.postedData[0];
				worker.postedData = [];
				worker.listeners.message[0]({
					results: postedData.items.map((item) => ({
						url: item.url,
						content: '<html></html>',
						outputFile: null,
						error: null,
						pageConsole: '',
						pageErrors: [],
						status: 200,
						statusText: 'OK',
						headers: {
							test: 'value'
						}
					}))
				});
			}

			// 4 workers are free and idle
			for (const worker of MockedWorker.openWorkers.slice(4)) {
				expect(worker.postedData.length).toBe(0);
			}

			await new Promise((resolve) => setTimeout(resolve));

			// All workers have been terminated
			expect(MockedWorker.openWorkers.length).toBe(0);
			expect(MockedWorker.terminatedWorkers.length).toBe(10);

			expect(log).toEqual([
				Chalk.bold(`Rendering ${MockedURLList.length} pages...\n`),
				...MockedURLList.map((url) => Chalk.bold(`• Rendered page "${url}"`)),
				Chalk.bold(`\nRendered ${MockedURLList.length} pages in 0 seconds\n`)
			]);

			expect(results!).toEqual(
				MockedURLList.map((url) => ({
					url,
					content: '<html></html>',
					outputFile: null,
					error: null,
					pageErrors: [],
					pageConsole: '',
					status: 200,
					statusText: 'OK',
					headers: {
						test: 'value'
					}
				}))
			);
		});

		it('Renders pages in workers with cache warmup.', async () => {
			const renderer = new ServerRenderer({
				cache: {
					warmup: true
				},
				worker: {
					maxConcurrency: 10
				}
			});
			let results: IServerRendererResult[];

			renderer.render(MockedURLList).then((r) => {
				results = r;
			});

			// Cache warmup opens 1 worker first
			expect(MockedWorker.openWorkers.length).toBe(1);

			const worker = MockedWorker.openWorkers[0];
			const postedData = worker.postedData[0];
			worker.postedData = [];
			worker.listeners.message[0]({
				results: postedData.items.map((item) => ({
					url: item.url,
					content: '<html>Warmup</html>',
					outputFile: null,
					error: null,
					pageConsole: '',
					pageErrors: [],
					status: 200,
					statusText: 'OK',
					headers: {
						test: 'value'
					}
				}))
			});

			await new Promise((resolve) => setTimeout(resolve));

			expect(MockedWorker.openWorkers.length).toBe(10);

			for (const worker of MockedWorker.openWorkers) {
				expect(worker.listeners.message.length).toBe(1);
				expect(worker.postedData.length).toBe(1);

				expect(worker.scriptPath.toString()).toBe(
					'file://' + Path.resolve(Path.join('src', 'ServerRendererWorker.js'))
				);

				expect(worker.execArgv).toEqual(['--disallow-code-generation-from-strings']);

				expect(worker.workerData.configuration.cache.directory).toBe(
					Path.resolve(Path.join('happy-dom', 'cache'))
				);
				expect(worker.workerData.configuration.outputDirectory).toBe(
					Path.resolve(Path.join('happy-dom', 'render'))
				);

				expect(worker.workerData.configuration).toEqual({
					...DefaultServerRendererConfiguration,
					outputDirectory: Path.resolve(Path.join('happy-dom', 'render')),
					cache: {
						...DefaultServerRendererConfiguration.cache,
						directory: Path.resolve(Path.join('happy-dom', 'cache')),
						warmup: true
					},
					worker: {
						...DefaultServerRendererConfiguration.worker,
						maxConcurrency: 10
					}
				});

				expect(worker.listeners.message.length).toBe(1);
				expect(worker.listeners.error.length).toBe(1);
				expect(worker.listeners.exit.length).toBe(1);
				expect(worker.postedData.length).toBe(1);

				const postedData = worker.postedData[0];
				worker.postedData = [];

				worker.listeners.message[0]({
					results: postedData.items.map((item) => ({
						url: item.url,
						content: '<html></html>',
						outputFile: null,
						error: null,
						pageConsole: '',
						pageErrors: [],
						status: 200,
						statusText: 'OK',
						headers: {
							test: 'value'
						}
					}))
				});
			}

			await new Promise((resolve) => setTimeout(resolve));

			// 10 workers are still open (no workers are terminated)
			expect(MockedWorker.openWorkers.length).toBe(10);

			// 4 workers are busy and are waiting for post message
			for (const worker of MockedWorker.openWorkers.slice(0, 4)) {
				expect(worker.listeners.message.length).toBe(1);
				expect(worker.postedData.length).toBe(1);
				const postedData = worker.postedData[0];
				worker.postedData = [];
				worker.listeners.message[0]({
					results: postedData.items.map((item) => ({
						url: item.url,
						content: '<html></html>',
						outputFile: null,
						error: null,
						pageConsole: '',
						pageErrors: [],
						status: 200,
						statusText: 'OK',
						headers: {
							test: 'value'
						}
					}))
				});
			}

			// 4 workers are free and idle
			for (const worker of MockedWorker.openWorkers.slice(4)) {
				expect(worker.postedData.length).toBe(0);
			}

			await new Promise((resolve) => setTimeout(resolve));

			// All workers have been terminated
			expect(MockedWorker.openWorkers.length).toBe(0);
			expect(MockedWorker.terminatedWorkers.length).toBe(10);

			expect(log).toEqual([
				Chalk.bold(`Rendering ${MockedURLList.length} pages...\n`),
				'Warming up cache...\n',
				Chalk.bold(`• Rendered page "${MockedURLList[0]}"`),
				'\nCache warmup complete.\n',
				...MockedURLList.slice(1).map((url) => Chalk.bold(`• Rendered page "${url}"`)),
				Chalk.bold(`\nRendered ${MockedURLList.length} pages in 0 seconds\n`)
			]);

			expect(results!).toEqual(
				MockedURLList.map((url, index) => ({
					url,
					content: index === 0 ? '<html>Warmup</html>' : '<html></html>',
					outputFile: null,
					error: null,
					pageErrors: [],
					pageConsole: '',
					status: 200,
					statusText: 'OK',
					headers: {
						test: 'value'
					}
				}))
			);
		});

		it('Handles result with render error.', async () => {
			const mockedURLList = MockedURLList.slice(0, 4);
			const renderer = new ServerRenderer({
				worker: {
					maxConcurrency: 10
				}
			});
			let results: IServerRendererResult[];

			renderer.render(mockedURLList).then((r) => {
				results = r;
			});

			// 1 worker opened to handle the rendering
			expect(MockedWorker.openWorkers.length).toBe(1);

			const worker = MockedWorker.openWorkers[0];
			const postedData = worker.postedData[0];
			worker.postedData = [];
			worker.listeners.message[0]({
				results: postedData.items.map((item, index) => ({
					url: item.url,
					content: index === 2 ? null : '<html></html>',
					outputFile: null,
					error: index === 2 ? 'Error' : null,
					pageConsole: '',
					pageErrors: [],
					status: 200,
					statusText: 'OK',
					headers: {
						test: 'value'
					}
				}))
			});

			await new Promise((resolve) => setTimeout(resolve));

			// All workers have been terminated
			expect(MockedWorker.openWorkers.length).toBe(0);
			expect(MockedWorker.terminatedWorkers.length).toBe(1);

			expect(log).toEqual([
				Chalk.bold(`Rendering ${mockedURLList.length} pages...\n`),
				Chalk.bold(`• Rendered page "${mockedURLList[0]}"`),
				Chalk.bold(`• Rendered page "${mockedURLList[1]}"`),
				Chalk.bold(Chalk.red(`\n❌ Failed to render page "${mockedURLList[2]}"\n`)),
				Chalk.red('Error\n'),
				Chalk.bold(`• Rendered page "${mockedURLList[3]}"`),
				Chalk.bold(`\nRendered ${mockedURLList.length} pages in 0 seconds\n`)
			]);

			expect(results!).toEqual(
				mockedURLList.map((url, index) => ({
					url,
					outputFile: null,
					content: index === 2 ? null : '<html></html>',
					error: index === 2 ? 'Error' : null,
					pageConsole: '',
					pageErrors: [],
					status: 200,
					statusText: 'OK',
					headers: {
						test: 'value'
					}
				}))
			);
		});

		it('Handles error causing a worker to exit early', async () => {
			const mockedURLList = MockedURLList.slice(0, 20);
			const renderer = new ServerRenderer({
				worker: {
					maxConcurrency: 10
				}
			});
			let results: IServerRendererResult[];
			let resultError: Error | null = null;

			renderer
				.render(mockedURLList)
				.then((r) => {
					results = r;
				})
				.catch((error) => {
					resultError = error;
				});

			// 2 workers opened to handle the rendering
			expect(MockedWorker.openWorkers.length).toBe(2);

			const worker = MockedWorker.openWorkers[0];
			const postedData = worker.postedData[0];
			worker.postedData = [];
			worker.listeners.message[0]({
				results: postedData.items.map((item) => ({
					url: item.url,
					content: '<html></html>',
					outputFile: null,
					error: null,
					pageConsole: '',
					pageErrors: [],
					status: 200,
					statusText: 'OK',
					headers: {
						test: 'value'
					}
				}))
			});

			// Error worker
			const errorWorker = MockedWorker.openWorkers[1];
			errorWorker.postedData = [];
			errorWorker.listeners.exit[0](1);

			await new Promise((resolve) => setTimeout(resolve));

			expect(log).toEqual([
				Chalk.bold(`Rendering ${mockedURLList.length} pages...\n`),
				...mockedURLList.slice(0, 10).map((url) => Chalk.bold(`• Rendered page "${url}"`))
			]);

			expect(resultError).toEqual(new Error(`Worker stopped with exit code 1`));
		});

		it('Handles worker error', async () => {
			const mockedURLList = MockedURLList.slice(0, 13);
			const renderer = new ServerRenderer({
				worker: {
					maxConcurrency: 10
				}
			});
			let results: IServerRendererResult[];

			renderer.render(mockedURLList).then((r) => {
				results = r;
			});

			// 2 workers opened to handle the rendering
			expect(MockedWorker.openWorkers.length).toBe(2);

			const worker = MockedWorker.openWorkers[0];
			const postedData = worker.postedData[0];
			worker.postedData = [];
			worker.listeners.message[0]({
				results: postedData.items.map((item) => ({
					url: item.url,
					content: '<html></html>',
					outputFile: null,
					error: null,
					pageConsole: '',
					pageErrors: [],
					status: 200,
					statusText: 'OK',
					headers: {
						test: 'value'
					}
				}))
			});

			// Error worker
			const errorWorker = MockedWorker.openWorkers[1];
			const error = new Error('Worker error');
			errorWorker.postedData = [];
			errorWorker.listeners.error[0](error);

			await new Promise((resolve) => setTimeout(resolve));

			expect(log).toEqual([
				Chalk.bold(`Rendering ${mockedURLList.length} pages...\n`),
				...mockedURLList.slice(0, 10).map((url) => Chalk.bold(`• Rendered page "${url}"`)),
				Chalk.bold(Chalk.red(`\n❌ Failed to render page "${mockedURLList[10]}"\n`)),
				Chalk.red('Error: Worker error\n'),
				Chalk.bold(Chalk.red(`\n❌ Failed to render page "${mockedURLList[11]}"\n`)),
				Chalk.red('Error: Worker error\n'),
				Chalk.bold(Chalk.red(`\n❌ Failed to render page "${mockedURLList[12]}"\n`)),
				Chalk.red('Error: Worker error\n'),
				Chalk.bold(`\nRendered ${mockedURLList.length} pages in 0 seconds\n`)
			]);

			await new Promise((resolve) => setTimeout(resolve));

			expect(results!).toEqual([
				...mockedURLList.slice(0, 10).map((url) => ({
					url,
					content: '<html></html>',
					outputFile: null,
					error: null,
					pageConsole: '',
					pageErrors: [],
					status: 200,
					statusText: 'OK',
					headers: {
						test: 'value'
					}
				})),
				...mockedURLList.slice(10).map((url) => ({
					url,
					content: null,
					outputFile: null,
					error: `${error.message}\n${error.stack}`,
					pageConsole: '',
					pageErrors: [],
					status: 200,
					statusText: 'OK',
					headers: {}
				}))
			]);
		});

		it('Handles result with page errors', async () => {
			const mockedURLList = MockedURLList;
			const renderer = new ServerRenderer({
				worker: {
					maxConcurrency: 10
				}
			});
			let results: IServerRendererResult[];

			renderer.render(mockedURLList).then((r) => {
				results = r;
			});

			expect(MockedWorker.openWorkers.length).toBe(10);

			for (let i = 0; i < MockedWorker.openWorkers.length; i++) {
				const worker = MockedWorker.openWorkers[i];
				const postedData = worker.postedData[0];

				worker.postedData = [];

				if (i === 2) {
					worker.listeners.message[0]({
						results: postedData.items.map((item, index) => ({
							url: item.url,
							content: '<html></html>',
							outputFile: null,
							error: null,
							pageConsole: '',
							pageErrors: index === 1 ? ['Error 1', 'Error 2'] : [],
							status: 200,
							statusText: 'OK',
							headers: {
								test: 'value'
							}
						}))
					});
				} else {
					worker.listeners.message[0]({
						results: postedData.items.map((item) => ({
							url: item.url,
							content: '<html></html>',
							outputFile: null,
							error: null,
							pageConsole: '',
							pageErrors: [],
							status: 200,
							statusText: 'OK',
							headers: {
								test: 'value'
							}
						}))
					});
				}
			}

			await new Promise((resolve) => setTimeout(resolve));

			// 10 workers are still open (no workers are terminated)
			expect(MockedWorker.openWorkers.length).toBe(10);

			// 4 workers are busy and are waiting for post message
			for (const worker of MockedWorker.openWorkers.slice(0, 4)) {
				expect(worker.listeners.message.length).toBe(1);
				expect(worker.postedData.length).toBe(1);
				const postedData = worker.postedData[0];
				worker.postedData = [];
				worker.listeners.message[0]({
					results: postedData.items.map((item) => ({
						url: item.url,
						content: '<html></html>',
						outputFile: null,
						error: null,
						pageConsole: '',
						pageErrors: [],
						status: 200,
						statusText: 'OK',
						headers: {
							test: 'value'
						}
					}))
				});
			}

			await new Promise((resolve) => setTimeout(resolve));

			// All workers have been terminated
			expect(MockedWorker.openWorkers.length).toBe(0);
			expect(MockedWorker.terminatedWorkers.length).toBe(10);

			expect(log).toEqual([
				Chalk.bold(`Rendering ${MockedURLList.length} pages...\n`),
				...mockedURLList.slice(0, 22).map((url) => Chalk.bold(`• Rendered page "${url}"`)),
				Chalk.bold(
					Chalk.yellow(
						`\n⚠️ Warning! Errors where outputted to the browser when the page was rendered.\n`
					)
				),
				Chalk.red('Error 1\n'),
				Chalk.red('Error 2\n'),
				...mockedURLList.slice(22).map((url) => Chalk.bold(`• Rendered page "${url}"`)),
				`\nRendered ${mockedURLList.length} pages in 0 seconds\n`
			]);

			expect(results!).toEqual(
				mockedURLList.map((url, index) => ({
					url,
					outputFile: null,
					content: '<html></html>',
					error: null,
					pageConsole: '',
					pageErrors: index === 21 ? ['Error 1', 'Error 2'] : [],
					status: 200,
					statusText: 'OK',
					headers: {
						test: 'value'
					}
				}))
			);
		});

		it('Outputs page console to terminal when "logLevel" is set to "debug"', async () => {
			const mockedURLList = MockedURLList.slice(0, 4);
			const renderer = new ServerRenderer({
				worker: {
					maxConcurrency: 10
				},
				logLevel: ServerRendererLogLevelEnum.debug
			});
			let results: IServerRendererResult[];

			renderer.render(mockedURLList).then((r) => {
				results = r;
			});

			// 1 worker opened to handle the rendering
			expect(MockedWorker.openWorkers.length).toBe(1);

			for (let i = 0; i < MockedWorker.openWorkers.length; i++) {
				const worker = MockedWorker.openWorkers[i];
				const postedData = worker.postedData[0];
				worker.postedData = [];
				worker.listeners.message[0]({
					results: postedData.items.map((item, index) => ({
						url: item.url,
						content: '<html></html>',
						outputFile: null,
						error: null,
						pageConsole: index === 1 || index === 2 ? `Page console ${index + 1}` : '',
						pageErrors: [],
						status: 200,
						statusText: 'OK',
						headers: {
							test: 'value'
						}
					}))
				});
			}

			await new Promise((resolve) => setTimeout(resolve));

			// All workers have been terminated
			expect(MockedWorker.openWorkers.length).toBe(0);
			expect(MockedWorker.terminatedWorkers.length).toBe(1);

			expect(log).toEqual([
				Chalk.bold(`Rendering ${mockedURLList.length} pages...\n`),
				Chalk.bold(`• Rendered page "${mockedURLList[0]}"`),
				Chalk.bold(`• Rendered page "${mockedURLList[1]}"`),
				Chalk.gray('Page console 2'),
				Chalk.bold(`• Rendered page "${mockedURLList[2]}"`),
				Chalk.gray('Page console 3'),
				Chalk.bold(`• Rendered page "${mockedURLList[3]}"`),
				Chalk.bold(`\nRendered ${mockedURLList.length} pages in 0 seconds\n`)
			]);

			expect(results!).toEqual(
				mockedURLList.map((url, index) => ({
					url,
					outputFile: null,
					content: '<html></html>',
					error: null,
					pageConsole: index === 1 || index === 2 ? `Page console ${index + 1}` : '',
					pageErrors: [],
					status: 200,
					statusText: 'OK',
					headers: {
						test: 'value'
					}
				}))
			);
		});

		it('Outputs nothing to terminal when "logLevel" is set to "none"', async () => {
			const mockedURLList = MockedURLList.slice(0, 4);
			const renderer = new ServerRenderer({
				worker: {
					maxConcurrency: 10
				},
				logLevel: ServerRendererLogLevelEnum.none
			});
			let results: IServerRendererResult[];

			renderer.render(mockedURLList).then((r) => {
				results = r;
			});

			// 1 worker opened to handle the rendering
			expect(MockedWorker.openWorkers.length).toBe(1);

			for (let i = 0; i < MockedWorker.openWorkers.length; i++) {
				const worker = MockedWorker.openWorkers[i];
				const postedData = worker.postedData[0];
				worker.postedData = [];
				worker.listeners.message[0]({
					results: postedData.items.map((item, index) => ({
						url: item.url,
						content: '<html></html>',
						outputFile: null,
						error: index === 2 ? 'Error' : null,
						pageConsole: index === 2 ? `Page console` : '',
						pageErrors: index === 2 ? ['Error'] : [],
						status: 200,
						statusText: 'OK',
						headers: {
							test: 'value'
						}
					}))
				});
			}

			await new Promise((resolve) => setTimeout(resolve));

			// All workers have been terminated
			expect(MockedWorker.openWorkers.length).toBe(0);
			expect(MockedWorker.terminatedWorkers.length).toBe(1);

			expect(log).toEqual([]);

			expect(results!).toEqual(
				mockedURLList.map((url, index) => ({
					url,
					outputFile: null,
					content: '<html></html>',
					error: index === 2 ? 'Error' : null,
					pageConsole: index === 2 ? `Page console` : '',
					pageErrors: index === 2 ? ['Error'] : [],
					status: 200,
					statusText: 'OK',
					headers: {
						test: 'value'
					}
				}))
			);
		});

		it('Handles output to file', async () => {
			const mockedItems = MockedURLList.slice(0, 4).map((url) => {
				const parts = url.split('/').reverse();
				return {
					url,
					outputFile: `${parts[1]}_${parts[2]}.html`
				};
			});
			const renderer = new ServerRenderer({
				worker: {
					maxConcurrency: 10
				}
			});
			let results: IServerRendererResult[];

			renderer.render(mockedItems).then((r) => {
				results = r;
			});

			// 1 worker opened to handle the rendering
			expect(MockedWorker.openWorkers.length).toBe(1);

			for (let i = 0; i < MockedWorker.openWorkers.length; i++) {
				const worker = MockedWorker.openWorkers[i];
				const postedData = worker.postedData[0];
				worker.postedData = [];
				worker.listeners.message[0]({
					results: postedData.items.map((item) => ({
						url: item.url,
						content: '<html></html>',
						outputFile: item.outputFile!,
						error: null,
						pageConsole: '',
						pageErrors: [],
						status: 200,
						statusText: 'OK',
						headers: {
							test: 'value'
						}
					}))
				});
			}

			await new Promise((resolve) => setTimeout(resolve));

			// All workers have been terminated
			expect(MockedWorker.openWorkers.length).toBe(0);
			expect(MockedWorker.terminatedWorkers.length).toBe(1);

			expect(log).toEqual([
				Chalk.bold(`Rendering ${mockedItems.length} pages...\n`),
				Chalk.bold(`• Rendered page "${mockedItems[0].url}"`),
				Chalk.bold(`• Rendered page "${mockedItems[1].url}"`),
				Chalk.bold(`• Rendered page "${mockedItems[2].url}"`),
				Chalk.bold(`• Rendered page "${mockedItems[3].url}"`),
				Chalk.bold(`\nRendered ${mockedItems.length} pages in 0 seconds\n`)
			]);

			expect(results!).toEqual(
				mockedItems.map((item) => ({
					url: item.url,
					outputFile: Path.resolve(Path.join('happy-dom', 'render', item.outputFile)),
					content: '<html></html>',
					error: null,
					pageConsole: '',
					pageErrors: [],
					status: 200,
					statusText: 'OK',
					headers: {
						test: 'value'
					}
				}))
			);
		});
	});
});
