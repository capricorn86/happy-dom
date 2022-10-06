import EventTarget from '../event/EventTarget';
import Event from '../event/Event';
import IWindow from '../window/IWindow';
import IEventListener from '../event/IEventListener';
import MediaQueryListEvent from '../event/events/MediaQueryListEvent';

const MEDIA_REGEXP =
	/min-width: *([0-9]+) *px|max-width: *([0-9]+) *px|min-height: *([0-9]+) *px|max-height: *([0-9]+) *px/;

/**
 * Media Query List.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList.
 */
export default class MediaQueryList extends EventTarget {
	public readonly media: string = '';
	public onchange: (event: Event) => void = null;
	private _ownerWindow: IWindow;

	/**
	 * Constructor.
	 *
	 * @param ownerWindow Window.
	 * @param media Media.
	 */
	constructor(ownerWindow: IWindow, media: string) {
		super();
		this._ownerWindow = ownerWindow;
		this.media = media;
	}

	/**
	 * Returns "true" if the document matches.
	 *
	 * @returns Matches.
	 */
	public get matches(): boolean {
		const match = MEDIA_REGEXP.exec(this.media);
		if (match) {
			if (match[1]) {
				return this._ownerWindow.innerWidth >= parseInt(match[1]);
			} else if (match[2]) {
				return this._ownerWindow.innerWidth <= parseInt(match[2]);
			} else if (match[3]) {
				return this._ownerWindow.innerHeight >= parseInt(match[3]);
			} else if (match[4]) {
				return this._ownerWindow.innerHeight <= parseInt(match[4]);
			}
		}
		return false;
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

	/**
	 * @override
	 */
	public addEventListener(type: string, listener: IEventListener | ((event: Event) => void)): void {
		super.addEventListener(type, listener);
		if (type === 'change') {
			let matchesState = false;
			const resizeListener = (): void => {
				const matches = this.matches;
				if (matches !== matchesState) {
					matchesState = matches;
					this.dispatchEvent(new MediaQueryListEvent('change', { matches, media: this.media }));
				}
			};
			listener['_windowResizeListener'] = resizeListener;
			this._ownerWindow.addEventListener('resize', resizeListener);
		}
	}

	/**
	 * @override
	 */
	public removeEventListener(
		type: string,
		listener: IEventListener | ((event: Event) => void)
	): void {
		super.removeEventListener(type, listener);
		if (type === 'change' && listener['_windowResizeListener']) {
			this._ownerWindow.removeEventListener('resize', listener['_windowResizeListener']);
		}
	}
}
