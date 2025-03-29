import { Browser, Headers, HTMLSerializer } from 'happy-dom-bundle';
import type { ICachedResponse } from 'happy-dom-bundle';
import IServerRendererOptions from './IOptionalServerRendererOptions.js';
import FS from 'fs';
import Path from 'path';
import IServerRendererItem from './IServerRendererItem.js';
import Crypto from 'crypto';
import IServerRendererResult from './IServerRendererResult.js';

/**
 * Server-side rendering browser.
 */
export default class ServerRendererBrowser {
	#options: IServerRendererOptions;
    #browser: Browser;

	/**
	 * Constructor.
	 *
	 * @param options Options.
	 */
	constructor(options: IServerRendererOptions) {
		this.#options = options;
		this.#browser = new Browser({ settings: options.settings });
	}

	/**
	 * Renders URLs.
	 *
	 * @param items Items.
	 * @param [isCacheWarmup] Indicates that this is a cache warmup.
	 */
	public async render(items: IServerRendererItem[], isCacheWarmup?: boolean): Promise<IServerRendererResult[]> {
		const browser = this.#browser

		if (!isCacheWarmup) {
			this.#loadCache(browser);
		}

        let results: IServerRendererResult[] = [];

		// We should not render too many pages at once, as it can affect performance and cause timing issues
		while (items.length) {
			const chunk = items.splice(0, this.#options.render.maxConcurrency);
			const promises = [];
			for (const url of chunk) {
				promises.push(this.#renderURL(browser, url).then((result) => {
                    results.push(result);
                }).catch((error) => {
                    results.push({ url: url.url, content: null, outputFile: url.outputFile  ?? null, error: `${error.message}\${error.stack}` });
                }));
			}
			await Promise.all(promises);
		}

		if (isCacheWarmup) {
			await this.#storeCache(browser);
		}

		await browser.close();

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
        const context = this.#options.render.incognitoContext ? browser.newIncognitoContext() : browser.defaultContext;
		const page = context.newPage();

        // @ts-ignore
        context.responseCache = responseCache;
        // @ts-ignore
        context.preflightResponseCache = preflightResponseCache;

		const response = await page.goto(item.url);

		if (!response.ok) {
			throw new Error(
				`Failed to render page ${item.url} (${response.status} ${response.statusText})`
			);
		}

		try {
			await page.waitUntilComplete();
		} catch (error) {
			throw new Error(
				`Failed to render page ${item.url}:\n\n${
					error.message
				}\n\nConsole:\n\n${page.virtualConsolePrinter.readAsString()}`
			);
		}

		const serializer = new HTMLSerializer({
			allShadowRoots: this.#options.render.allShadowRoots,
			serializableShadowRoots: this.#options.render.serializableShadowRoots,
			excludeShadowRootTags: this.#options.render.excludeShadowRootTags
		});

		const result = serializer.serializeToString(page.mainFrame.document);

		await page.close();

        if(!item.outputFile) {
            return { url: item.url, content: result, outputFile: null, error: null };
        }

		try {
			await FS.promises.mkdir(Path.dirname(item.outputFile), {
				recursive: true
			});
		} catch {
			// Ignore
		}

		await FS.promises.writeFile(item.outputFile, result);

        return { url: item.url, content: null, outputFile: item.outputFile, error: null };
	}

	/**
	 * Loads cache from disk.
	 *
	 * @param browser Browser.
	 */
	async #loadCache(browser: Browser): Promise<void> {
		if (this.#options.disableCache || !this.#options.cacheDirectory) {
			return;
		}

		const files = await FS.promises.readdir(Path.join(this.#options.cacheDirectory));
		const promises = [];

		for (const file of files) {
			promises.push(
				FS.promises
					.readFile(Path.join(this.#options.cacheDirectory, file), 'utf8')
					.then((content) => {
						const entry = <ICachedResponse>JSON.parse(content);
						if (entry.response && entry.request) {
							entry.response.headers = new Headers(entry.response.headers);
							entry.request.headers = new Headers(entry.request.headers);

							return FS.promises
								.readFile(Path.join(this.#options.cacheDirectory, file.split('.')[0] + '.data'))
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
		if (this.#options.disableCache || !this.#options.cacheDirectory) {
			return;
		}

		const groupedEntries = browser.defaultContext.responseCache.entries;
		const entryPromises = [];
		const bodyPromises = [];

		for (const entries of groupedEntries.values()) {
			const cachableEntries = [];

			for (const entry of entries) {
				const responseHeaders = {};
				const requestHeaders = {};

				for (const [key, value] of entry.response.headers.entries()) {
					responseHeaders[key] = value;
				}

				for (const [key, value] of entry.request.headers.entries()) {
					requestHeaders[key] = value;
				}

				cachableEntries.push({
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
				});

				const json = JSON.stringify(cachableEntries, null, 3);
				const hash = Crypto.createHash('md5').update(json).digest('hex');

				entryPromises.push(
					FS.promises.writeFile(
						Path.join(this.#options.cacheDirectory, `${hash}.json`),
						JSON.stringify(cachableEntries, null, 2)
					)
				);

				bodyPromises.push(
					FS.promises.writeFile(
						Path.join(this.#options.cacheDirectory, `${hash}.data`),
						entry.response.body
					)
				);
			}
		}

		await Promise.all(entryPromises);
		await Promise.all(bodyPromises);
	}
}
