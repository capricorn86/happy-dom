import URL from '../url/URL.js';
import IBrowserFrame from '../browser/types/IBrowserFrame.js';
import BrowserFrameUtility from '../browser/BrowserFrameUtility.js';

/**
 * Location.
 */
export default class Location extends URL {
	#browserFrame: IBrowserFrame | null;

	/**
	 * Constructor.
	 *
	 * @param [url] URL.
	 */
	constructor(url = 'about:blank', browserFrame?: IBrowserFrame) {
		super(browserFrame ? BrowserFrameUtility.getRelativeURL(browserFrame, url) : url);
		this.#browserFrame = browserFrame ?? null;
	}

	/**
	 * Override set href.
	 */
	// @ts-ignore
	public set href(value: string) {
		this.#browserFrame?.goto(value);
	}

	/**
	 * Override set href.
	 */
	public get href(): string {
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
	 * Note: Will do the same thing as "replace()" as server-dom does not support loading the URL.
	 *
	 * @param url
	 * @see this.replace()
	 */
	public assign(url: string): void {
		this.href = url;
	}

	/**
	 * Reloads the resource from the current URL.
	 */
	public reload(): void {
		this.#browserFrame?.goto(this.href);
	}
}
