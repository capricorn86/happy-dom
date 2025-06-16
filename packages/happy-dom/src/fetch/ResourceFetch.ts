import BrowserWindow from '../window/BrowserWindow.js';
import URL from '../url/URL.js';
import Fetch from './Fetch.js';
import SyncFetch from './SyncFetch.js';
import IRequestCredentials from './types/IRequestCredentials.js';
import WindowBrowserContext from '../window/WindowBrowserContext.js';
import PreloadUtility from './preload/PreloadUtility.js';
import * as PropertySymbol from '../PropertySymbol.js';
import IRequestReferrerPolicy from './types/IRequestReferrerPolicy.js';

/**
 * Helper class for performing fetch of resources.
 */
export default class ResourceFetch {
	private window: BrowserWindow;

	/**
	 * Constructor.
	 *
	 * @param window Window.
	 */
	constructor(window: BrowserWindow) {
		this.window = window;
	}

	/**
	 * Returns resource data asynchronously.
	 *
	 * @param url URL.
	 * @param destination Destination.
	 * @param [options]
	 * @param [options.credentials] Credentials.
	 * @param options.referrerPolicy
	 * @returns Response.
	 */
	public async fetch(
		url: string | URL,
		destination: 'script' | 'style' | 'module',
		options?: { credentials?: IRequestCredentials; referrerPolicy?: IRequestReferrerPolicy }
	): Promise<string> {
		const browserFrame = new WindowBrowserContext(this.window).getBrowserFrame();

		if (!browserFrame) {
			return '';
		}

		// Preloaded resource
		if (destination === 'script' || destination === 'style') {
			const preloadKey = PreloadUtility.getKey({
				url: String(url),
				destination,
				mode: 'cors',
				credentialsMode: options?.credentials || 'same-origin'
			});
			const preloadEntry = this.window.document[PropertySymbol.preloads].get(preloadKey);

			if (preloadEntry) {
				this.window.document[PropertySymbol.preloads].delete(preloadKey);

				const response = preloadEntry.response || (await preloadEntry.onResponseAvailable());

				if (response && !response.ok) {
					throw new this.window.DOMException(
						`Failed to perform request to "${
							new URL(url, this.window.location.href).href
						}". Status ${preloadEntry.response?.status || '0'} ${preloadEntry.response?.statusText || 'Unknown'}.`
					);
				}

				return preloadEntry.response?.[PropertySymbol.buffer]?.toString() || '';
			}
		}

		const fetch = new Fetch({
			browserFrame,
			window: this.window,
			url,
			disableSameOriginPolicy: destination === 'script' || destination === 'style',
			disablePreload: true,
			init: {
				credentials: options?.credentials,
				referrerPolicy: options?.referrerPolicy
			}
		});

		const response = await fetch.send();

		if (!response.ok) {
			throw new this.window.DOMException(
				`Failed to perform request to "${new URL(url, this.window.location.href).href}". Status ${
					response.status
				} ${response.statusText}.`
			);
		}

		return await response.text();
	}

	/**
	 * Returns resource data synchronously.
	 *
	 * @param url URL.
	 * @param destination Destination.
	 * @param [options] Options.
	 * @param [options.credentials] Credentials.
	 * @param [options.referrerPolicy] Referrer policy.
	 * @returns Response.
	 */
	public fetchSync(
		url: string,
		destination: 'script' | 'style' | 'module',
		options?: { credentials?: IRequestCredentials; referrerPolicy?: IRequestReferrerPolicy }
	): string {
		const browserFrame = new WindowBrowserContext(this.window).getBrowserFrame();

		if (!browserFrame) {
			return '';
		}

		// Preloaded resource
		if (destination === 'script' || destination === 'style') {
			const preloadKey = PreloadUtility.getKey({
				url: String(url),
				destination,
				mode: 'cors',
				credentialsMode: options?.credentials || 'same-origin'
			});
			const preloadEntry = this.window.document[PropertySymbol.preloads].get(preloadKey);

			// We will only use this if the fetch for the resource is complete as it is async and this request is sync.
			if (preloadEntry && preloadEntry.response) {
				this.window.document[PropertySymbol.preloads].delete(preloadKey);

				const response = preloadEntry.response;

				if (!response.ok) {
					throw new this.window.DOMException(
						`Failed to perform request to "${
							new URL(url, this.window.location.href).href
						}". Status ${preloadEntry.response.status} ${preloadEntry.response.statusText}.`
					);
				}

				if (!preloadEntry.response[PropertySymbol.buffer]) {
					throw new this.window.DOMException(
						`Failed to perform request to "${new URL(url, this.window.location.href).href}". Response buffer is not available.`
					);
				}

				return preloadEntry.response[PropertySymbol.buffer].toString();
			}
		}

		const fetch = new SyncFetch({
			browserFrame,
			window: this.window,
			url,
			disableSameOriginPolicy: true,
			init: {
				credentials: options?.credentials,
				referrerPolicy: options?.referrerPolicy
			}
		});

		const response = fetch.send();

		if (!response.ok) {
			throw new this.window.DOMException(
				`Failed to perform request to "${new URL(url, this.window.location.href).href}". Status ${
					response.status
				} ${response.statusText}.`
			);
		}

		return response.body?.toString() || '';
	}
}
