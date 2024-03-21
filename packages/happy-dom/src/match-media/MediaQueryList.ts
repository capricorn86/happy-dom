import EventTarget from '../event/EventTarget.js';
import * as PropertySymbol from '../PropertySymbol.js';
import Event from '../event/Event.js';
import BrowserWindow from '../window/BrowserWindow.js';
import IEventListener from '../event/IEventListener.js';
import MediaQueryListEvent from '../event/events/MediaQueryListEvent.js';
import IMediaQueryItem from './MediaQueryItem.js';
import MediaQueryParser from './MediaQueryParser.js';

/**
 * Media Query List.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList.
 */
export default class MediaQueryList extends EventTarget {
	public onchange: (event: Event) => void = null;
	#ownerWindow: BrowserWindow;
	#items: IMediaQueryItem[] | null = null;
	#media: string;
	#rootFontSize: string | number | null = null;

	/**
	 * Constructor.
	 *
	 * @param options Options.
	 * @param options.ownerWindow Owner window.
	 * @param options.media Media.
	 * @param [options.rootFontSize] Root font size.
	 */
	constructor(options: {
		ownerWindow: BrowserWindow;
		media: string;
		rootFontSize?: string | number;
	}) {
		super();
		this.#ownerWindow = options.ownerWindow;
		this.#media = options.media;
		this.#rootFontSize = options.rootFontSize || null;
	}

	/**
	 * Returns media.
	 *
	 * @returns Media.
	 */
	public get media(): string {
		this.#items =
			this.#items ||
			MediaQueryParser.parse({
				ownerWindow: this.#ownerWindow,
				mediaQuery: this.#media,
				rootFontSize: this.#rootFontSize
			});

		return this.#items.map((item) => item.toString()).join(', ');
	}

	/**
	 * Returns "true" if the document matches.
	 *
	 * @returns Matches.
	 */
	public get matches(): boolean {
		this.#items =
			this.#items ||
			MediaQueryParser.parse({
				ownerWindow: this.#ownerWindow,
				mediaQuery: this.#media,
				rootFontSize: this.#rootFontSize
			});

		for (const item of this.#items) {
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
			listener[PropertySymbol.windowResizeListener] = resizeListener;
			this.#ownerWindow.addEventListener('resize', resizeListener);
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
		if (type === 'change' && listener[PropertySymbol.windowResizeListener]) {
			this.#ownerWindow.removeEventListener(
				'resize',
				listener[PropertySymbol.windowResizeListener]
			);
		}
	}
}
