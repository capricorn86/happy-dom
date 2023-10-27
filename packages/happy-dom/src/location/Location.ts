import URL from '../url/URL.js';
import DOMException from '../exception/DOMException.js';
import DOMExceptionNameEnum from '../exception/DOMExceptionNameEnum.js';
import IBrowserFrame from '../browser/types/IBrowserFrame.js';
import DetachedBrowserFrame from '../browser/detached-browser/DetachedBrowserFrame.js';
import WindowErrorUtility from '../window/WindowErrorUtility.js';

/**
 *
 */
export default class Location extends URL {
	#browserFrame: IBrowserFrame | null;

	/**
	 * Constructor.
	 *
	 * @param [url] URL.
	 */
	constructor(url = 'about:blank', browserFrame?: IBrowserFrame) {
		super(url);
		this.#browserFrame = browserFrame ?? null;
	}

	/**
	 * Override set href.
	 */
	// @ts-ignore
	public set href(value: string) {
		if (value.startsWith('javascript:')) {
			if (
				this.#browserFrame &&
				!this.#browserFrame.page.context.browser.settings.disableJavaScriptEvaluation
			) {
				if (this.#browserFrame.page.context.browser.settings.disableErrorCapturing) {
					this.#browserFrame.window.eval(value.replace('javascript:', ''));
				} else {
					WindowErrorUtility.captureError(this.#browserFrame.window, () =>
						this.#browserFrame.window.eval(value.replace('javascript:', ''))
					);
				}
			}
			return;
		}

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

		// When using the Window instance directly and not via the Browser API we should not navigate the browser frame.
		if (!(this.#browserFrame instanceof DetachedBrowserFrame)) {
			this.#browserFrame?.goto(value);
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
