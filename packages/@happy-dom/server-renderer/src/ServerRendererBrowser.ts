import Browser from 'happy-dom/lib/browser/Browser.js';
import type IServerRendererConfiguration from './types/IServerRendererConfiguration.js';
import type IServerRendererItem from './types/IServerRendererItem.js';
import type IServerRendererResult from './types/IServerRendererResult.js';
import ServerRendererPage from './ServerRendererPage.js';

/**
 * Server renderer browser.
 */
export default class ServerRendererBrowser {
	#configuration: IServerRendererConfiguration;
	#browser: Browser;
	#isCacheLoaded: boolean = false;
	#pageRenderer: ServerRendererPage;

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
		this.#pageRenderer = new ServerRendererPage(configuration);
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

		return this.#pageRenderer.render(page, item);
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
