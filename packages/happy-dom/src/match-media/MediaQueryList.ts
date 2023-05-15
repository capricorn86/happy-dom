import EventTarget from '../event/EventTarget';
import Event from '../event/Event';
import IWindow from '../window/IWindow';
import IEventListener from '../event/IEventListener';
import MediaQueryListEvent from '../event/events/MediaQueryListEvent';
import IMediaQueryItem from './IMediaQueryItem';
import MediaQueryParser from './MediaQueryParser';
import MediaQueryDeviceEnum from './MediaQueryDeviceEnum';

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
	private _items: IMediaQueryItem[] = [];

	/**
	 * Constructor.
	 *
	 * @param ownerWindow Window.
	 * @param media Media.
	 */
	constructor(ownerWindow: IWindow, media: string) {
		super();
		this._ownerWindow = ownerWindow;
		this._items = MediaQueryParser.getMediaQueryItems(media);
		this.media = this._items.length > 0 ? media : 'not all';
	}

	/**
	 * Returns "true" if the document matches.
	 *
	 * @returns Matches.
	 */
	public get matches(): boolean {
		if (!this._items.length || this.media === 'not all') {
			return false;
		}

		for (const item of this._items) {
			if (!this._matchesItem(item)) {
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

	/**
	 *
	 * @param item
	 */
	private _matchesItem(item: IMediaQueryItem): boolean {
		if (
			item.device === MediaQueryDeviceEnum.print ||
			(item.not &&
				(item.device === MediaQueryDeviceEnum.screen || item.device === MediaQueryDeviceEnum.all))
		) {
			return false;
		}

		switch (item.rule.key) {
			case 'min-width':
				const minWidth = parseInt(item.rule.value, 10);
				return !isNaN(minWidth) && this._ownerWindow.innerWidth >= minWidth;
			case 'max-width':
				const maxWidth = parseInt(item.rule.value, 10);
				return !isNaN(maxWidth) && this._ownerWindow.innerWidth <= maxWidth;
			case 'min-height':
				const minHeight = parseInt(item.rule.value, 10);
				return !isNaN(minHeight) && this._ownerWindow.innerHeight >= minHeight;
			case 'max-height':
				const maxHeight = parseInt(item.rule.value, 10);
				return !isNaN(maxHeight) && this._ownerWindow.innerHeight <= maxHeight;
			case 'orientation':
				return item.rule.value === 'landscape'
					? this._ownerWindow.innerWidth > this._ownerWindow.innerHeight
					: this._ownerWindow.innerWidth < this._ownerWindow.innerHeight;
			case 'prefers-color-scheme':
				return item.rule.value === this._ownerWindow.happyDOM.settings.colorScheme;
			case 'hover':
				return item.rule.value === 'none'
					? this._ownerWindow.navigator.maxTouchPoints === 0
					: this._ownerWindow.navigator.maxTouchPoints > 0;
			case 'any-pointer':
			case 'pointer':
				return item.rule.value === 'none' || item.rule.value === 'fine'
					? this._ownerWindow.navigator.maxTouchPoints === 0
					: this._ownerWindow.navigator.maxTouchPoints > 0;
			case 'display-mode':
				return item.rule.value === 'browser';
			case 'min-aspect-ratio':
			case 'max-aspect-ratio':
			case 'aspect-ratio':
				const aspectRatio = item.rule.value.split('/');
				const width = parseInt(aspectRatio[0], 10);
				const height = parseInt(aspectRatio[1], 10);

				if (isNaN(width) || isNaN(height)) {
					return false;
				}

				switch (item.rule.key) {
					case 'min-aspect-ratio':
						return width / height <= this._ownerWindow.innerWidth / this._ownerWindow.innerHeight;
					case 'max-aspect-ratio':
						return width / height >= this._ownerWindow.innerWidth / this._ownerWindow.innerHeight;
					case 'aspect-ratio':
						return width / height === this._ownerWindow.innerWidth / this._ownerWindow.innerHeight;
				}
		}

		return false;
	}
}
