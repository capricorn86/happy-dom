import Browser from 'happy-dom/lib/browser/Browser.js';
import Headers from 'happy-dom/lib/fetch/Headers.js';
import HTMLSerializer from 'happy-dom/lib/html-serializer/HTMLSerializer.js';
import type ICachedResponse from 'happy-dom/lib/fetch/cache/response/ICachedResponse.js';
import IServerRendererConfiguration from './IServerRendererConfiguration.js';
import FS from 'fs';
import Path from 'path';
import IServerRendererItem from './IServerRendererItem.js';
import Crypto from 'crypto';
import IServerRendererResult from './IServerRendererResult.js';
import { ErrorEvent } from 'happy-dom';

/**
 * Server renderer browser.
 */
export default class ServerRendererBrowser {
	#configuration: IServerRendererConfiguration;
	#browser: Browser;
	#isCacheLoaded: boolean = false;

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
	 * @param [isCacheWarmup] Indicates that this is a cache warmup.
	 */
	public async render(
		items: IServerRendererItem[],
		isCacheWarmup?: boolean
	): Promise<IServerRendererResult[]> {
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

		if (isCacheWarmup) {
			await this.#storeCache(browser);
		}

		return results;
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
		const context = this.#configuration.render.incognitoContext
			? browser.newIncognitoContext()
			: browser.defaultContext;
		const page = context.newPage();

		// @ts-ignore
		context.responseCache = responseCache;
		// @ts-ignore
		context.preflightResponseCache = preflightResponseCache;

		const pageErrors: string[] = [];
		const response = await page.goto(item.url, {
			timeout: this.#configuration.render.timeout,
			beforeContentCallback(window) {
				window.addEventListener('error', (event: ErrorEvent) => {
					if (event.error) {
						pageErrors.push(`${event.error.message}\n${event.error.stack}`);
					}
				});
			}
		});

		if (!response.ok) {
			const pageConsole = page.virtualConsolePrinter.readAsString();
			await page.close();
			return {
				url: item.url,
				content: null,
				outputFile: item.outputFile,
				error: `Failed to render page ${item.url} (${response.status} ${response.statusText})`,
				pageConsole,
				pageErrors
			};
		}

		const timeout = !this.#browser.settings.debug.traceWaitUntilComplete
			? setTimeout(() => {
					page.abort();
			  }, this.#configuration.render.timeout)
			: null;

		try {
			await page.waitUntilComplete();
		} catch (error) {
			const pageConsole = page.virtualConsolePrinter.readAsString();
			await page.close();
			return {
				url: item.url,
				content: null,
				outputFile: item.outputFile,
				error: `${error.message}\n${error.stack}\n\n  Console:\n\n${pageConsole}`,
				pageConsole,
				pageErrors
			};
		}

		clearTimeout(timeout);

		const serializer = new HTMLSerializer({
			allShadowRoots: this.#configuration.render.allShadowRoots,
			serializableShadowRoots: this.#configuration.render.serializableShadowRoots,
			excludeShadowRootTags: this.#configuration.render.excludeShadowRootTags
		});

		const result = serializer.serializeToString(page.mainFrame.document);
		const pageConsole = page.virtualConsolePrinter.readAsString();

		await page.close();

		if (!item.outputFile) {
			return {
				url: item.url,
				content: result,
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

		let files: string[] = [];

		try {
			files = await FS.promises.readdir(this.#configuration.cache.directory);
		} catch (error) {
			// If the directory does not exist, we have no cache and we can ignore it
			return;
		}

		const promises = [];

		for (const file of files) {
			promises.push(
				FS.promises
					.readFile(Path.join(this.#configuration.cache.directory, file), 'utf8')
					.then((content) => {
						const entry = <ICachedResponse>JSON.parse(content);
						if (entry.response && entry.request && !entry.virtual) {
							entry.response.headers = new Headers(entry.response.headers);
							entry.request.headers = new Headers(entry.request.headers);

							if (this.#configuration.cache.forceResponseCacheTime > 0) {
								entry.lastModified = null;
								entry.expires = Date.now() + this.#configuration.cache.forceResponseCacheTime;
								entry.etag = null;
								entry.mustRevalidate = false;
								entry.staleWhileRevalidate = false;
								entry.virtual = true;
							}

							return FS.promises
								.readFile(
									Path.join(this.#configuration.cache.directory, file.split('.')[0] + '.data')
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

		await Promise.all(promises);
	}

	/**
	 * Stores cache to disk.
	 *
	 * @param browser Browser.
	 */
	async #storeCache(browser: Browser): Promise<void> {
		if (this.#configuration.cache.disable || !this.#configuration.cache.directory) {
			return;
		}

		try {
			await FS.promises.mkdir(this.#configuration.cache.directory, {
				recursive: true
			});
		} catch (error) {
			// Ignore if the directory already exists
		}

		const groupedEntries = browser.defaultContext.responseCache.entries;
		const entryPromises = [];
		const bodyPromises = [];

		for (const entries of groupedEntries.values()) {
			for (const entry of entries) {
				if (entry.response.body && !entry.virtual) {
					const responseHeaders = {};
					const requestHeaders = {};

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

					entryPromises.push(
						FS.promises.writeFile(
							Path.join(this.#configuration.cache.directory, `${hash}.json`),
							json
						)
					);

					bodyPromises.push(
						FS.promises.writeFile(
							Path.join(this.#configuration.cache.directory, `${hash}.data`),
							entry.response.body
						)
					);

					if (this.#configuration.cache.forceResponseCacheTime > 0) {
						entry.lastModified = null;
						entry.expires = Date.now() + this.#configuration.cache.forceResponseCacheTime;
						entry.etag = null;
						entry.mustRevalidate = false;
						entry.staleWhileRevalidate = false;
						entry.virtual = true;
					}
				}
			}
		}

		await Promise.all([Promise.all(entryPromises), Promise.all(bodyPromises)]);
	}
}
