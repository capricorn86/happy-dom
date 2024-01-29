import URL from './URL.js';
import IBrowserFrame from '../browser/types/IBrowserFrame.js';
import * as PropertySymbol from '../PropertySymbol.js';

/**
 * Location.
 */
export default class Location extends URL {
	#browserFrame: IBrowserFrame;

	/**
	 * Constructor.
	 *
	 * @param browserFrame Browser frame.
	 * @param url URL.
	 */
	constructor(browserFrame: IBrowserFrame, url: string) {
		super(url);
		this.#browserFrame = browserFrame;
	}

	/**
	 * Override set href.
	 */
	// @ts-ignore
	public set href(url: string) {
		this.#browserFrame.goto(url).catch((error) => this.#browserFrame.page.console.error(error));
	}

	/**
	 * Override set href.
	 */
	public get href(): string {
		// @ts-ignore
		return super.href;
	}

	/**
	 * Replaces the current resource with the one at the provided URL. The difference from the assign() method is that after using replace() the current page will not be saved in session History, meaning the user won't be able to use the back button to navigate to it.
	 *
	 * @param url URL.
	 */
	public replace(url: string): void {
		this.href = url;
	}

	/**
	 * Loads the resource at the URL provided in parameter.
	 *
	 * @param url URL.
	 */
	public assign(url: string): void {
		this.href = url;
	}

	/**
	 * Reloads the resource from the current URL.
	 */
	public reload(): void {
		this.#browserFrame
			.goto(this.href)
			.catch((error) => this.#browserFrame.page.console.error(error));
	}

	/**
	 * Replaces the current URL state with the provided one without navigating to the new URL.
	 *
	 * @param browserFrame Browser frame that must match the current one as validation.
	 * @param url URL.
	 */
	public [PropertySymbol.setURL](browserFrame: IBrowserFrame, url: string): void {
		if (this.#browserFrame !== browserFrame) {
			throw new Error('Failed to set URL. Browser frame mismatch.');
		}

		// @ts-ignore
		super.href = url;
	}
}
