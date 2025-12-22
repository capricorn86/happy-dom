import HTMLSerializer from 'happy-dom/lib/html-serializer/HTMLSerializer.js';
import FS from 'fs';
import Path from 'path';
import IServerRendererItem from './types/IServerRendererItem.js';
import IServerRendererResult from './types/IServerRendererResult.js';
import { ErrorEvent, IBrowserPage, Response } from 'happy-dom';
import BrowserWindowPolyfill from './utilities/BrowserWindowPolyfill.js';
import IServerRendererConfiguration from './types/IServerRendererConfiguration.js';
import ServerRendererModeEnum from './enums/ServerRendererModeEnum.js';

const SET_TIMEOUT = setTimeout;
const CLEAR_TIMEOUT = clearTimeout;

/**
 * Server renderer page.
 */
export default class ServerRendererPage {
	#configuration: IServerRendererConfiguration;
	#createdDirectories: Set<string> = new Set();
	#initialized: boolean = false;

	/**
	 * Constructor.
	 *
	 * @param configuration Configuration.
	 */
	constructor(configuration: IServerRendererConfiguration) {
		this.#configuration = configuration;
	}

	/**
	 * Renders a page.
	 *
	 * @param page Browser page.
	 * @param item Item.
	 */
	public async render(
		page: IBrowserPage,
		item: IServerRendererItem
	): Promise<IServerRendererResult> {
		const configuration = this.#configuration;
		const pageErrors: string[] = [];
		const errorListener = (event: any): void => {
			if ((<ErrorEvent>event).error) {
				pageErrors.push((<ErrorEvent>event).error!.stack!);
			}
		};
		let response: Response | null = null;
		let headers: { [key: string]: string } | null = null;

		if (item.html) {
			if (item.url) {
				page.mainFrame.url = item.url;
			}

			page.mainFrame.window.addEventListener('error', errorListener);

			if (!this.#initialized) {
				this.#initialized = true;

				if (!configuration.render.disablePolyfills) {
					BrowserWindowPolyfill.applyPolyfills(page.mainFrame.window);
				}

				if (configuration.render.setupScript) {
					page.mainFrame.evaluateModule({ code: configuration.render.setupScript });
				}
			}

			page.mainFrame.document.open();
			page.mainFrame.document.write(item.html);
		} else if (item.url) {
			headers = {};

			if (configuration.render.mode === ServerRendererModeEnum.page) {
				response = await page.mainFrame.window.fetch(item.url, {
					headers: item.headers || {}
				});
			} else {
				response = (await page.goto(item.url, {
					timeout: configuration.render.timeout,
					headers: item.headers,
					beforeContentCallback(window) {
						window.addEventListener('error', errorListener);

						if (!configuration.render.disablePolyfills) {
							BrowserWindowPolyfill.applyPolyfills(window);
						}

						if (configuration.render.setupScript) {
							page.evaluateModule({ code: configuration.render.setupScript });
						}
					}
				}))!;
			}

			for (const [key, value] of response.headers) {
				if (key !== 'content-encoding') {
					headers[key] = value;
				}
			}

			if (!response.ok) {
				const pageConsole = page.virtualConsolePrinter.readAsString();

				if (configuration.render.mode !== ServerRendererModeEnum.page) {
					await page.close();
				}

				return {
					url: item.url,
					content: null,
					status: response.status,
					statusText: response.statusText,
					headers,
					outputFile: item.outputFile ?? null,
					error: `Failed to render page ${item.url} (${response.status} ${response.statusText})`,
					pageConsole,
					pageErrors
				};
			}

			if (configuration.render.mode === ServerRendererModeEnum.page) {
				const text = await response.text();

				page.mainFrame.window.addEventListener('error', errorListener);

				if (!this.#initialized) {
					this.#initialized = true;
					if (!configuration.render.disablePolyfills) {
						BrowserWindowPolyfill.applyPolyfills(page.mainFrame.window);
					}

					if (configuration.render.setupScript) {
						page.mainFrame.evaluateModule({ code: configuration.render.setupScript });
					}
				}

				page.mainFrame.document.open();
				page.mainFrame.document.write(text);
			}
		} else {
			const pageConsole = page.virtualConsolePrinter.readAsString();

			if (configuration.render.mode !== ServerRendererModeEnum.page) {
				await page.close();
			}

			return {
				url: null,
				content: null,
				status: null,
				statusText: null,
				headers: null,
				outputFile: item.outputFile ?? null,
				error: `No "url" or "html" provided to render.`,
				pageConsole,
				pageErrors
			};
		}

		let timeoutError: string | null = null;
		const timeout =
			configuration.browser.debug.traceWaitUntilComplete === -1
				? SET_TIMEOUT(() => {
						timeoutError = `The page was not rendered within the defined time of ${configuration.render.timeout}ms and the operation was aborted. You can increase this value with the "render.timeout" setting.\n\nThe page may contain scripts with timer loops that prevent it from completing. You can debug open handles by setting "debug" to true, or prevent timer loops by setting "browser.timer.preventTimerLoops" to true. Read more about this in the documentation.`;
						page.abort();
				  }, configuration.render.timeout)
				: null;

		try {
			await page.waitUntilComplete();
		} catch (error) {
			const pageConsole = page.virtualConsolePrinter.readAsString();
			const url = item.url || page.url;

			if (configuration.render.mode !== ServerRendererModeEnum.page) {
				await page.close();
			}

			return {
				url,
				content: null,
				status: response?.status || null,
				statusText: response?.statusText || null,
				headers,
				outputFile: item.outputFile ?? null,
				error: (<Error>error).stack!,
				pageConsole,
				pageErrors
			};
		}

		// Wait for errors to be printed
		await new Promise((resolve) => SET_TIMEOUT(resolve, 10));

		page.mainFrame.window.removeEventListener('error', errorListener);

		if (timeout) {
			CLEAR_TIMEOUT(timeout);
		}

		const pageConsole = page.virtualConsolePrinter.readAsString();

		if (timeoutError) {
			const url = item.url || page.url;

			if (configuration.render.mode !== ServerRendererModeEnum.page) {
				await page.close();
			}

			return {
				url,
				content: null,
				status: response?.status || null,
				statusText: response?.statusText || null,
				headers,
				outputFile: null,
				error: timeoutError,
				pageConsole,
				pageErrors
			};
		}

		const serializer = new HTMLSerializer({
			allShadowRoots: configuration.render.allShadowRoots,
			serializableShadowRoots: configuration.render.serializableShadowRoots,
			excludeShadowRootTags: configuration.render.excludeShadowRootTags
		});

		const result = serializer.serializeToString(page.mainFrame.document);
		const url = item.url || page.url;

		if (configuration.render.mode !== ServerRendererModeEnum.page) {
			await page.close();
		}

		if (!item.outputFile) {
			return {
				url,
				content: result,
				status: response?.status || null,
				statusText: response?.statusText || null,
				headers,
				outputFile: null,
				error: null,
				pageConsole,
				pageErrors
			};
		}

		const directory = Path.dirname(item.outputFile);

		if (!this.#createdDirectories.has(directory)) {
			this.#createdDirectories.add(directory);
			try {
				await FS.promises.mkdir(directory, {
					recursive: true
				});
			} catch {
				// Ignore
			}
		}

		await FS.promises.writeFile(item.outputFile, result);

		return {
			url,
			content: null,
			status: response?.status || null,
			statusText: response?.statusText || null,
			headers,
			outputFile: item.outputFile,
			error: null,
			pageConsole,
			pageErrors
		};
	}
}
