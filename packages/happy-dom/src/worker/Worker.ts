import EventTarget from '../event/EventTarget.js';
import Event from '../event/Event.js';
import IEventListener from '../event/IEventListener.js';
import MediaQueryListEvent from '../event/events/MediaQueryListEvent.js';
import IDocument from '../nodes/document/IDocument.js';
import URL from '../url/URL.js';

/**
 * Worker.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/Worker.
 */
export default class Worker extends EventTarget {
	public onchange: (event: Event) => void = null;

	// Needs to be injected by sub-class.
	protected _ownerDocument: IDocument;
	#url: URL;
	#options: { type: 'classic' | 'module'; credentials: 'omit' | 'same-origin' | 'include' };
	#window: IWindow;

	/**
	 * Constructor.
	 *
	 * @param options Options.
	 * @param options.ownerWindow Owner window.
	 * @param options.media Media.
	 * @param [options.rootFontSize] Root font size.
	 * @param url
	 * @param options.type
	 * @param options.credentials
	 */
	constructor(
		url: string,
		options: { type: 'classic' | 'module'; credentials: 'omit' | 'same-origin' | 'include' }
	) {
		super();
		this.#url = new URL(url);
		this.#options = options;
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
}
