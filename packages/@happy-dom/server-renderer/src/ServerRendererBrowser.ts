import Browser from 'happy-dom/lib/browser/Browser.js';
import HTMLSerializer from 'happy-dom/lib/html-serializer/HTMLSerializer.js';
import IServerRendererConfiguration from './types/IServerRendererConfiguration.js';
import FS from 'fs';
import Path from 'path';
import IServerRendererItem from './types/IServerRendererItem.js';
import IServerRendererResult from './types/IServerRendererResult.js';
import { ErrorEvent, Response } from 'happy-dom';
import BrowserWindowPolyfill from './utilities/BrowserWindowPolyfill.js';

/**
 * Server renderer browser.
 */
export default class ServerRendererBrowser {
	#configuration: IServerRendererConfiguration;
	#browser: Browser;
	#isCacheLoaded: boolean = false;
	#createdDirectories: Set<string> = new Set();

	/**
	 * Constructor.
	 *
	 * @param configuration Configuration.
	 */
	constructor(configuration: IServerRendererConfiguration) {
		this.#configuration = configuration;
		const settings =
			configuration.debug && configuration.browser.debug?.traceWaitUntilComplete === -1
				? {
						...configuration.browser,
						debug: {
							...configuration.browser.debug,
							traceWaitUntilComplete: configuration.render.timeout
						}
					}
				: configuration.browser;
		this.#browser = new Browser({ settings });
	}

	/**
	 * Renders URLs.
	 *
	 * @param items Items.
	 */
	public async render(items: IServerRendererItem[]): Promise<IServerRendererResult[]> {
		const browser = this.#browser;

		await this.#loadCache(browser);

		let results: IServerRendererResult[];

		if (items.length > this.#configuration.render.maxConcurrency) {
			results = [];
			while (items.length) {
				const chunk = items.splice(0, this.#configuration.render.maxConcurrency);
				const promises = [];
				for (const url of chunk) {
					promises.push(
						this.#renderPage(browser, url).then((result) => {
							results.push(result);
						})
					);
				}
				await Promise.all(promises);
			}
		} else {
			const promises = [];
			for (const url of items) {
				promises.push(this.#renderPage(browser, url));
			}
			results = await Promise.all(promises);
		}

		await this.#saveCache(browser);

		return results;
	}

	/**
	 * Closes the browser.
	 */
	public async close(): Promise<void> {
		await this.#browser.close();
		this.#browser = null!;
		this.#isCacheLoaded = false;
	}

	/**
	 * Renders a page.
	 *
	 * @param browser Browser.
	 * @param item Item.
	 */
	async #renderPage(browser: Browser, item: IServerRendererItem): Promise<IServerRendererResult> {
		const responseCache = browser.defaultContext.responseCache;
		const preflightResponseCache = browser.defaultContext.preflightResponseCache;
		const configuration = this.#configuration;
		const context =
			configuration.render.incognitoContext || configuration.cache.disable
				? browser.newIncognitoContext()
				: browser.defaultContext;
		const page = context.newPage();

		if (configuration.render.incognitoContext && !configuration.cache.disable) {
			// @ts-ignore
			context.responseCache = responseCache;
			// @ts-ignore
			context.preflightResponseCache = preflightResponseCache;
		}

		const pageErrors: string[] = [];
		let response: Response | null = null;
		let headers: { [key: string]: string } | null = null;

		if (item.html) {
			if (item.url) {
				page.mainFrame.url = item.url;
			}
			if (!configuration.render.disablePolyfills) {
				BrowserWindowPolyfill.applyPolyfills(page.mainFrame.window);
			}
			page.mainFrame.document.write(item.html);
		} else if (item.url) {
			headers = {};
			response = (await page.goto(item.url, {
				timeout: configuration.render.timeout,
				headers: item.headers,
				beforeContentCallback(window) {
					window.addEventListener('error', (event) => {
						if ((<ErrorEvent>event).error) {
							pageErrors.push((<ErrorEvent>event).error!.stack!);
						}
					});
					if (!configuration.render.disablePolyfills) {
						BrowserWindowPolyfill.applyPolyfills(window);
					}
				}
			}))!;

			for (const [key, value] of response.headers) {
				if (key !== 'content-encoding') {
					headers[key] = value;
				}
			}

			if (!response.ok) {
				const pageConsole = page.virtualConsolePrinter.readAsString();
				await page.close();
				return {
					url: item.url || page.url,
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
		} else {
			const pageConsole = page.virtualConsolePrinter.readAsString();
			await page.close();
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
			this.#browser.settings.debug.traceWaitUntilComplete === -1
				? setTimeout(() => {
						timeoutError = `The page was not rendered within the defined time of ${configuration.render.timeout}ms and the operation was aborted. You can increase this value with the "render.timeout" setting.\n\nThe page may contain scripts with timer loops that prevent it from completing. You can debug open handles by setting "debug" to true, or prevent timer loops by setting "browser.timer.preventTimerLoops" to true. Read more about this in the documentation.`;
						page.abort();
					}, configuration.render.timeout)
				: null;

		try {
			await page.waitUntilComplete();
		} catch (error) {
			const pageConsole = page.virtualConsolePrinter.readAsString();
			const url = item.url || page.url;
			await page.close();
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
		await new Promise((resolve) => setTimeout(resolve, 10));

		if (timeout) {
			clearTimeout(timeout);
		}

		const pageConsole = page.virtualConsolePrinter.readAsString();

		if (timeoutError) {
			const url = item.url || page.url;

			await page.close();

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

		await page.close();

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

	/**
	 * Loads cache from disk.
	 *
	 * @param browser Browser.
	 */
	async #loadCache(browser: Browser): Promise<void> {
		if (
			this.#configuration.cache.disable ||
			!this.#configuration.cache.directory ||
			this.#isCacheLoaded
		) {
			return;
		}

		this.#isCacheLoaded = true;

		await browser.defaultContext.responseCache.fileSystem.load(this.#configuration.cache.directory);
	}

	/**
	 * Saves cache to disk.
	 *
	 * @param browser Browser.
	 */
	async #saveCache(browser: Browser): Promise<void> {
		if (this.#configuration.cache.disable || !this.#configuration.cache.directory) {
			return;
		}

		await browser.defaultContext.responseCache.fileSystem.save(this.#configuration.cache.directory);
	}
}
