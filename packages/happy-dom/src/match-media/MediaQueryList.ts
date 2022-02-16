import EventTarget from '../event/EventTarget';
import Event from '../event/Event';

/**
 * Media Query List.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList.
 */
export default class MediaQueryList extends EventTarget {
	public _matches = false;
	public _media = '';
	public onchange: (event: Event) => void = null;

	/**
	 * Returns "true" if the document matches.
	 *
	 * @returns Matches.
	 */
	public get matches(): boolean {
		return this._matches;
	}

	/**
	 * Returns the serialized media query.
	 *
	 * @returns Serialized media query.
	 */
	public get media(): string {
		return this._media;
	}

	/**
	 * Adds a listener.
	 *
	 * @deprecated
	 * @param callback Callback.
	 */
	public addListener(callback: (event: Event) => void): void {
		this.addEventListener('change', callback);
	}

	/**
	 * Removes listener.
	 *
	 * @deprecated
	 * @param callback Callback.
	 */
	public removeListener(callback: (event: Event) => void): void {
		this.removeEventListener('change', callback);
	}
}
