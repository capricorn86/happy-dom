import URL from './URL';

/**
 *
 */
export default class Location extends URL {
	/**
	 * Constructor.
	 */
	constructor() {
		super('');
	}

	/**
	 * Replaces the current resource with the one at the provided URL. The difference from the assign() method is that after using replace() the current page will not be saved in session History, meaning the user won't be able to use the back button to navigate to it.
	 *
	 * @param url URL.
	 */
	public replace(url: string): void {
		this.parse(url);
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
		this.replace(url);
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
