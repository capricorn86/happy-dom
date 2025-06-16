import IBrowserFrame from '../browser/types/IBrowserFrame.js';
import HashChangeEvent from '../event/events/HashChangeEvent.js';
import HistoryScrollRestorationEnum from '../history/HistoryScrollRestorationEnum.js';
import * as PropertySymbol from '../PropertySymbol.js';

/**
 * Location.
 */
export default class Location {
	// Public properties
	public [Symbol.toStringTag] = 'Location';

	// Private properties
	#browserFrame: IBrowserFrame | null;
	#url: URL;
	#hashChangeTimeout: NodeJS.Timeout | null = null;
	#hashChangeEvents: HashChangeEvent[] = [];

	/**
	 * Constructor.
	 *
	 * @param browserFrame Browser frame.
	 * @param url URL.
	 */
	constructor(browserFrame: IBrowserFrame, url: string) {
		if (!browserFrame) {
			throw new TypeError('Illegal constructor');
		}
		this.#browserFrame = browserFrame;
		this.#url = new URL(url);
	}

	/**
	 * Returns hash.
	 *
	 * @returns Hash.
	 */
	public get hash(): string {
		return this.#url.hash;
	}

	/**
	 * Sets hash.
	 *
	 * @param hash Value.
	 */
	public set hash(hash: string) {
		const history = this.#browserFrame?.[PropertySymbol.history];

		if (!history || !this.#browserFrame) {
			return;
		}

		const url = new URL(this.#url.href);
		const oldHash = this.#url.hash;

		url.hash = hash;

		if (url.hash !== oldHash) {
			history.currentItem.popState = true;

			history.push({
				title: '',
				href: url.href,
				state: history.currentItem.state,
				popState: true,
				scrollRestoration: HistoryScrollRestorationEnum.manual,
				method: history.currentItem.method,
				formData: history.currentItem.formData || null
			});

			this[PropertySymbol.setURL](this.#browserFrame, url.href);
		}
	}

	/**
	 * Returns host.
	 *
	 * @returns Host.
	 */
	public get host(): string {
		return this.#url.host;
	}

	/**
	 * Sets host.
	 *
	 * @param host Value.
	 */
	public set host(host: string) {
		const url = new URL(this.#url.href);
		url.host = host;
		this.href = url.href;
	}

	/**
	 * Returns hostname.
	 *
	 * @returns Hostname.
	 */
	public get hostname(): string {
		return this.#url.hostname;
	}

	/**
	 * Sets hostname.
	 *
	 * @param hostname Value.
	 */
	public set hostname(hostname: string) {
		const url = new URL(this.#url.href);
		url.hostname = hostname;
		this.href = url.href;
	}

	/**
	 * Override set href.
	 */
	public get href(): string {
		return this.#url.href;
	}

	/**
	 * Override set href.
	 */
	public set href(url: string) {
		if (!this.#browserFrame) {
			return;
		}

		this.#browserFrame.goto(url).catch((error) => {
			if (this.#browserFrame?.page?.console) {
				this.#browserFrame.page.console.error(error);
			} else {
				throw error;
			}
		});
	}

	/**
	 * Returns origin.
	 *
	 * @returns Origin.
	 */
	public get origin(): string {
		return this.#url.origin;
	}

	/**
	 * Returns pathname
	 *
	 * @returns Pathname.
	 */
	public get pathname(): string {
		return this.#url.pathname;
	}

	/**
	 * Sets pathname.
	 *
	 * @param pathname Value.
	 */
	public set pathname(pathname: string) {
		const url = new URL(this.#url.href);
		url.pathname = pathname;
		this.href = url.href;
	}

	/**
	 * Returns port.
	 *
	 * @returns Port.
	 */
	public get port(): string {
		return this.#url.port;
	}

	/**
	 * Sets port.
	 *
	 * @param port Value.
	 */
	public set port(port: string) {
		const url = new URL(this.#url.href);
		url.port = port;
		this.href = url.href;
	}

	/**
	 * Returns protocol.
	 *
	 * @returns Protocol.
	 */
	public get protocol(): string {
		return this.#url.protocol;
	}

	/**
	 * Sets protocol.
	 *
	 * @param protocol Value.
	 */
	public set protocol(protocol: string) {
		const url = new URL(this.#url.href);
		url.protocol = protocol;
		this.href = url.href;
	}

	/**
	 * Returns search.
	 *
	 * @returns Search.
	 */
	public get search(): string {
		return this.#url.search;
	}

	/**
	 * Sets search.
	 *
	 * @param search Value.
	 */
	public set search(search: string) {
		const url = new URL(this.#url.href);
		url.search = search;
		this.href = url.href;
	}

	/**
	 * Replaces the current resource with the one at the provided URL. The difference from the assign() method is that after using replace() the current page will not be saved in session History, meaning the user won't be able to use the back button to navigate to it.
	 *
	 * @param url URL.
	 */
	public replace(url: string | URL): void {
		this.href = String(url);
	}

	/**
	 * Loads the resource at the URL provided in parameter.
	 *
	 * @param url URL.
	 */
	public assign(url: string | URL): void {
		this.href = String(url);
	}

	/**
	 * Reloads the resource from the current URL.
	 */
	public reload(): void {
		if (!this.#browserFrame) {
			return;
		}

		this.#browserFrame.goto(this.href).catch((error) => {
			if (this.#browserFrame?.page.console) {
				this.#browserFrame.page.console.error(error);
			} else {
				throw error;
			}
		});
	}

	/**
	 * Replaces the current URL state with the provided one without navigating to the new URL.
	 *
	 * @param browserFrame Browser frame that must match the current one as validation.
	 * @param url URL.
	 */
	public [PropertySymbol.setURL](browserFrame: IBrowserFrame, url: string): void {
		if (!this.#browserFrame) {
			return;
		}

		if (this.#browserFrame !== browserFrame) {
			throw new Error('Failed to set URL. Browser frame mismatch.');
		}

		const oldURL = this.#url.href;
		const oldHash = this.#url.hash;

		this.#url.href = url;

		if (this.#url.hash !== oldHash) {
			const newURL = this.#url.href;
			this.#hashChangeEvents.push(new HashChangeEvent('hashchange', { oldURL, newURL }));
			if (this.#hashChangeTimeout) {
				this.#browserFrame.window?.clearTimeout(this.#hashChangeTimeout);
			}
			this.#hashChangeTimeout = this.#browserFrame.window?.setTimeout(() => {
				const hashChangeEvents = this.#hashChangeEvents;
				this.#hashChangeEvents = [];
				for (const event of hashChangeEvents) {
					this.#browserFrame?.window?.dispatchEvent(event);
				}
				this.#browserFrame?.window?.document?.[PropertySymbol.clearCache]();
			});
		}
	}

	/**
	 * Destroys the location.
	 */
	public [PropertySymbol.destroy](): void {
		if (this.#hashChangeTimeout) {
			this.#browserFrame?.window?.clearTimeout(this.#hashChangeTimeout);
		}
		this.#browserFrame = null;
	}

	/**
	 * Returns the URL as a string.
	 *
	 * @returns URL as a string.
	 */
	public toString(): string {
		return this.#url.toString();
	}
}
