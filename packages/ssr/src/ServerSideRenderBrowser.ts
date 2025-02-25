import { Browser, Headers } from 'happy-dom';
import IServerSideRenderOptions from './IOptionalServerSideRenderOptions.js';
import FS from 'fs';
import Path from 'path';
import HTMLSerializer from 'happy-dom/lib/html-serializer/HTMLSerializer.js';
import IServerSideRenderItem from './IServerSideRenderItem.js';
import Crypto from 'crypto';
import ICachedResponse from 'happy-dom/lib/fetch/cache/response/ICachedResponse.js';

/**
 * Server-side rendering worker.
 */
export default class ServerSideRenderBrowser {
	#options: IServerSideRenderOptions;

	/**
	 * Constructor.
	 *
	 * @param options Options.
	 */
	constructor(options: IServerSideRenderOptions) {
		this.#options = options;
	}

	/**
	 * Renders URLs.
	 *
	 * @param items Items.
	 * @param [isCacheWarmup] Indicates that this is a cache warmup.
	 */
	public async render(items: IServerSideRenderItem[], isCacheWarmup?: boolean): Promise<void> {
		const options = this.#options;
		const settings = { ...options.settings };

		if (options.requestHeaders) {
			settings.fetch.interceptor = {
				async beforeAsyncRequest({ request }) {
					for (const header of options.requestHeaders) {
						if (
							typeof header.url === 'string'
								? header.url.startsWith(request.url)
								: request.url.match(header.url)
						) {
							for (const [key, value] of Object.entries(header.headers)) {
								request.headers.set(key, value);
							}
						}
					}
				}
			};
		}

		const browser = new Browser({ settings });

		if (!isCacheWarmup) {
			this.#loadCache(browser);
		}

		// We should not render too many pages at once, as it can affect performance and cause timing issues
		while (items.length) {
			const chunk = items.splice(0, this.#options.render.maxConcurrency);
			const promises = [];
			for (const url of chunk) {
				promises.push(this.#renderURL(browser, url));
			}
			await Promise.all(promises);
		}

		if (isCacheWarmup) {
			await this.#storeCache(browser);
		}

		await browser.close();
	}

	/**
	 * Renders a page.
	 *
	 * @param browser Browser.
	 * @param item Item.
	 */
	async #renderURL(browser: Browser, item: IServerSideRenderItem): Promise<void> {
		const page = await browser.newPage();

		page.setViewport(this.#options.viewport);

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

		try {
			await FS.promises.mkdir(Path.dirname(item.outputFile), {
				recursive: true
			});
		} catch {
			// Ignore
		}

		await FS.promises.writeFile(item.outputFile, result);
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
