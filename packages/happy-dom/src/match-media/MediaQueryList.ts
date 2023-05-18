import EventTarget from '../event/EventTarget';
import Event from '../event/Event';
import IWindow from '../window/IWindow';
import IEventListener from '../event/IEventListener';
import MediaQueryListEvent from '../event/events/MediaQueryListEvent';
import IMediaQueryItem from './MediaQueryItem';
import MediaQueryParser from './MediaQueryParser';

/**
 * Media Query List.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList.
 */
export default class MediaQueryList extends EventTarget {
	public onchange: (event: Event) => void = null;
	private _ownerWindow: IWindow;
	private _items: IMediaQueryItem[] | null = null;
	private _media: string;
	private _rootFontSize: string | number | null = null;

	/**
	 * Constructor.
	 *
	 * @param options Options.
	 * @param options.ownerWindow Owner window.
	 * @param options.media Media.
	 * @param [options.rootFontSize] Root font size.
	 */
	constructor(options: { ownerWindow: IWindow; media: string; rootFontSize?: string | number }) {
		super();
		this._ownerWindow = options.ownerWindow;
		this._media = options.media;
		this._rootFontSize = options.rootFontSize || null;
	}

	/**
	 * Returns media.
	 *
	 * @returns Media.
	 */
	public get media(): string {
		this._items =
			this._items ||
			MediaQueryParser.parse({
				ownerWindow: this._ownerWindow,
				mediaQuery: this._media,
				rootFontSize: this._rootFontSize
			});

		return this._items.map((item) => item.toString()).join(', ');
	}

	/**
	 * Returns "true" if the document matches.
	 *
	 * @returns Matches.
	 */
	public get matches(): boolean {
		this._items =
			this._items ||
			MediaQueryParser.parse({
				ownerWindow: this._ownerWindow,
				mediaQuery: this._media,
				rootFontSize: this._rootFontSize
			});

		for (const item of this._items) {
			if (!item.matches()) {
				return false;
			}
		}

		return true;
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
