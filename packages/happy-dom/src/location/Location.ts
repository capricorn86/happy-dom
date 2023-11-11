import URL from '../url/URL.js';
import IBrowserFrame from '../browser/types/IBrowserFrame.js';

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
		this.#browserFrame.goto(url);
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
		this.#browserFrame.goto(url);
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
		this.#browserFrame.goto(url);
	}

	/**
	 * Reloads the resource from the current URL.
	 */
	public reload(): void {
		this.#browserFrame.goto(this.href);
	}
}
