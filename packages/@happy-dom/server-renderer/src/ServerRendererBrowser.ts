import Browser from 'happy-dom/lib/browser/Browser.js';
import Headers from 'happy-dom/lib/fetch/Headers.js';
import HTMLSerializer from 'happy-dom/lib/html-serializer/HTMLSerializer.js';
import type ICachedResponse from 'happy-dom/lib/fetch/cache/response/ICachedResponse.js';
import IServerRendererConfiguration from './types/IServerRendererConfiguration.js';
import FS from 'fs';
import Path from 'path';
import IServerRendererItem from './types/IServerRendererItem.js';
import Crypto from 'crypto';
import IServerRendererResult from './types/IServerRendererResult.js';
import { ErrorEvent } from 'happy-dom';
import WindowPolyfillUtility from './utilities/WindowPolyfillUtility.js';

/**
 * Server renderer browser.
 */
export default class ServerRendererBrowser {
	#configuration: IServerRendererConfiguration;
	#browser: Browser;
	#isCacheLoaded: boolean = false;
	#isCacheDirectoryCreated: boolean = false;
	#cacheEntries: Set<ICachedResponse> = new Set();
	#cacheHashes: Set<string> = new Set();

	/**
	 * Constructor.
	 *
	 * @param configuration Configuration.
	 */
	constructor(configuration: IServerRendererConfiguration) {
		this.#configuration = configuration;
		const settings = configuration.debug
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
						this.#renderURL(browser, url).then((result) => {
							results.push(result);
						})
					);
				}
				await Promise.all(promises);
			}
		} else {
			const promises = [];
			for (const url of items) {
				promises.push(this.#renderURL(browser, url));
			}
			results = await Promise.all(promises);
		}

		await this.#storeCache(browser);

		return results;
	}

	/**
	 * Closes the browser.
	 */
	public async close(): Promise<void> {
		await this.#browser.close();
		this.#browser = null;
		this.#isCacheLoaded = false;
		this.#isCacheDirectoryCreated = false;
		this.#cacheEntries.clear();
		this.#cacheHashes.clear();
	}

	/**
	 * Renders a page.
	 *
	 * @param browser Browser.
	 * @param item Item.
	 */
	async #renderURL(browser: Browser, item: IServerRendererItem): Promise<IServerRendererResult> {
		const responseCache = browser.defaultContext.responseCache;
		const preflightResponseCache = browser.defaultContext.preflightResponseCache;
		const configuration = this.#configuration;
		const context = configuration.render.incognitoContext
			? browser.newIncognitoContext()
			: browser.defaultContext;
		const page = context.newPage();

		if (configuration.cache.disable) {
			context.responseCache.clear();
		} else {
			// @ts-ignore
			context.responseCache = responseCache;
			// @ts-ignore
			context.preflightResponseCache = preflightResponseCache;
		}

		const pageErrors: string[] = [];
		const response = await page.goto(item.url, {
			timeout: configuration.render.timeout,
			headers: item.headers,
			beforeContentCallback(window) {
				window.addEventListener('error', (event: ErrorEvent) => {
					if (event.error) {
						pageErrors.push(event.error.stack);
					}
				});
				if (!configuration.render.disablePolyfills) {
					WindowPolyfillUtility.applyPolyfills(window);
				}
			}
		});

		const headers = {};

		for (const [key, value] of response.headers) {
			if (key !== 'content-encoding') {
				headers[key] = value;
			}
		}

		if (!response.ok) {
			const pageConsole = page.virtualConsolePrinter.readAsString();
			await page.close();
			return {
				url: item.url,
				content: null,
				status: response.status,
				statusText: response.statusText,
				headers,
				outputFile: item.outputFile,
				error: `Failed to render page ${item.url} (${response.status} ${response.statusText})`,
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
			await page.close();
			return {
				url: item.url,
				content: null,
				status: response.status,
				statusText: response.statusText,
				headers,
				outputFile: item.outputFile,
				error: error.stack,
				pageConsole,
				pageErrors
			};
		}

		// Wait for errors to be printed
		await new Promise((resolve) => setTimeout(resolve, 10));

		clearTimeout(timeout);

		const pageConsole = page.virtualConsolePrinter.readAsString();

		if (timeoutError) {
			page.close();

			return {
				url: item.url,
				content: null,
				status: response.status,
				statusText: response.statusText,
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

		await page.close();

		if (!item.outputFile) {
			return {
				url: item.url,
				content: result,
				status: response.status,
				statusText: response.statusText,
				headers,
				outputFile: null,
				error: null,
				pageConsole,
				pageErrors
			};
		}

		try {
			await FS.promises.mkdir(Path.dirname(item.outputFile), {
				recursive: true
			});
		} catch {
			// Ignore
		}

		await FS.promises.writeFile(item.outputFile, result);

		return {
			url: item.url,
			content: null,
			status: response.status,
			statusText: response.statusText,
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
			this.#configuration.cache.fileSystem.disable ||
			!this.#configuration.cache.fileSystem.directory ||
			this.#isCacheLoaded
		) {
			return;
		}

		this.#isCacheLoaded = true;

		let files: string[] = [];

		try {
			files = await FS.promises.readdir(this.#configuration.cache.fileSystem.directory);
		} catch (error) {
			// If the directory does not exist, we have no cache and we can ignore it
			return;
		}

		const promises = [];

		for (const file of files) {
			if (file.endsWith('.json')) {
				promises.push(
					FS.promises
						.readFile(Path.join(this.#configuration.cache.fileSystem.directory, file), 'utf8')
						.then((content) => {
							const entry = <ICachedResponse>JSON.parse(content);
							if (entry.response && entry.request && !entry.virtual) {
								entry.response.headers = new Headers(entry.response.headers);
								entry.request.headers = new Headers(entry.request.headers);

								return FS.promises
									.readFile(
										Path.join(
											this.#configuration.cache.fileSystem.directory,
											file.split('.')[0] + '.data'
										)
									)
									.then((body) => {
										entry.response.body = body;
										let entries = browser.defaultContext.responseCache.entries.get(
											entry.response.url
										);
										if (!entries) {
											entries = [];
											browser.defaultContext.responseCache.entries.set(entry.response.url, entries);
										}
										entries.push(entry);
									})
									.catch(() => {});
							}
						})
						.catch(() => {})
				);
			}
		}

		await Promise.all(promises);
	}

	/**
	 * Stores cache to disk.
	 *
	 * @param browser Browser.
	 */
	async #storeCache(browser: Browser): Promise<void> {
		if (
			this.#configuration.cache.disable ||
			this.#configuration.cache.fileSystem.disable ||
			!this.#configuration.cache.fileSystem.directory
		) {
			return;
		}

		if (!this.#isCacheDirectoryCreated) {
			this.#isCacheDirectoryCreated = true;
			try {
				await FS.promises.mkdir(this.#configuration.cache.fileSystem.directory, {
					recursive: true
				});
			} catch (error) {
				// Ignore if the directory already exists
			}
		}

		const groupedEntries = browser.defaultContext.responseCache.entries;
		const entryPromises = [];
		const bodyPromises = [];

		for (const entries of groupedEntries.values()) {
			for (const entry of entries) {
				if (entry.response.body && !entry.virtual && this.#cacheEntries.has(entry)) {
					const responseHeaders = {};
					const requestHeaders = {};

					this.#cacheEntries.add(entry);

					for (const [key, value] of entry.response.headers.entries()) {
						responseHeaders[key] = value;
					}

					for (const [key, value] of entry.request.headers.entries()) {
						requestHeaders[key] = value;
					}

					const cacheableEntry = {
						...entry,
						response: {
							...entry.response,
							headers: responseHeaders,
							body: null
						},
						request: {
							...entry.request,
							headers: requestHeaders
						}
					};

					const json = JSON.stringify(cacheableEntry, null, 3);
					const hash = Crypto.createHash('md5').update(json).digest('hex');

					if (!this.#cacheHashes.has(hash)) {
						this.#cacheHashes.add(hash);

						entryPromises.push(
							FS.promises.writeFile(
								Path.join(this.#configuration.cache.fileSystem.directory, `${hash}.json`),
								json
							)
						);

						bodyPromises.push(
							FS.promises.writeFile(
								Path.join(this.#configuration.cache.fileSystem.directory, `${hash}.data`),
								entry.response.body
							)
						);
					}
				}
			}
		}

		await Promise.all([Promise.all(entryPromises), Promise.all(bodyPromises)]);
	}
}
