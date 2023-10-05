import URL from '../url/URL.js';
import DOMException from '../exception/DOMException.js';
import DOMExceptionNameEnum from '../exception/DOMExceptionNameEnum.js';

/**
 *
 */
export default class Location extends URL {
	/**
	 * Constructor.
	 */
	constructor() {
		super('about:blank');
	}

	/**
	 * Override set href.
	 */
	// @ts-ignore
	public set href(value: string) {
		try {
			super.href = this.hostname ? new URL(value, this).href : value;
		} catch (e) {
			if (this.hostname) {
				throw new DOMException(
					`Failed to construct URL from string "${value}".`,
					DOMExceptionNameEnum.uriMismatchError
				);
			} else {
				throw new DOMException(
					`Failed to construct URL from string "${value}" relative to URL "${super.href}".`,
					DOMExceptionNameEnum.uriMismatchError
				);
			}
		}
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
	 *
	 * Note: Will do nothing as reloading is not supported in server-dom.
	 */
	public reload(): void {
		// Do nothing
	}
}
