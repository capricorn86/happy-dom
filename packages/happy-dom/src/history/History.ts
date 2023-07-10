import HistoryScrollRestorationEnum from './HistoryScrollRestorationEnum.js';

/**
 * History API.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/History.
 */
export default class History {
	public readonly length = 0;
	public readonly state = null;
	private _scrollRestoration = HistoryScrollRestorationEnum.auto;

	/**
	 * Returns scroll restoration.
	 *
	 * @returns Sroll restoration.
	 */
	public get scrollRestoration(): HistoryScrollRestorationEnum {
		return this._scrollRestoration;
	}

	/**
	 * Sets scroll restoration.
	 *
	 * @param scrollRestoration Sroll restoration.
	 */
	public set scrollRestoration(scrollRestoration: HistoryScrollRestorationEnum) {
		this._scrollRestoration = HistoryScrollRestorationEnum[scrollRestoration]
			? scrollRestoration
			: this._scrollRestoration;
	}

	/**
	 * Goes to the previous page in session history.
	 */
	public back(): void {
		// Do nothing.
	}

	/**
	 * Goes to the next page in session history.
	 */
	public forward(): void {
		// Do nothing.
	}

	/**
	 * Load a specific page from the session history.
	 *
	 * @param delta Delta.
	 * @param _delta
	 */
	public go(_delta: number): void {
		// Do nothing.
	}

	/**
	 * Pushes the given data onto the session history stack.
	 *
	 * @param state State.
	 * @param title Title.
	 * @param [url] URL.
	 * @param _state
	 * @param _title
	 * @param _url
	 */
	public pushState(_state: object, _title, _url?: string): void {
		// Do nothing.
	}

	/**
	 * This method modifies the current history entry, replacing it with a new state.
	 *
	 * @param state State.
	 * @param title Title.
	 * @param [url] URL.
	 * @param _state
	 * @param _title
	 * @param _url
	 */
	public replaceState(_state: object, _title, _url?: string): void {
		// Do nothing.
	}
}
