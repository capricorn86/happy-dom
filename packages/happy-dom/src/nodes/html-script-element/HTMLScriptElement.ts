import HTMLElement from '../html-element/HTMLElement.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import Event from '../../event/Event.js';
import ErrorEvent from '../../event/events/ErrorEvent.js';
import Node from '../../nodes/node/Node.js';
import NamedNodeMap from '../../named-node-map/NamedNodeMap.js';
import HTMLScriptElementNamedNodeMap from './HTMLScriptElementNamedNodeMap.js';
import WindowErrorUtility from '../../window/WindowErrorUtility.js';
import WindowBrowserSettingsReader from '../../window/WindowBrowserSettingsReader.js';
import HTMLScriptElementScriptLoader from './HTMLScriptElementScriptLoader.js';
import IBrowserFrame from '../../browser/types/IBrowserFrame.js';
import BrowserErrorCaptureEnum from '../../browser/enums/BrowserErrorCaptureEnum.js';

/**
 * HTML Script Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLScriptElement.
 */
export default class HTMLScriptElement extends HTMLElement {
	// Public properties
	public cloneNode: (deep?: boolean) => HTMLScriptElement;

	// Events
	public onerror: (event: ErrorEvent) => void = null;
	public onload: (event: Event) => void = null;

	// Internal properties
	public override [PropertySymbol.attributes]: NamedNodeMap;
	public [PropertySymbol.evaluateScript] = true;

	// Private properties
	#scriptLoader: HTMLScriptElementScriptLoader;

	/**
	 * Constructor.
	 *
	 * @param browserFrame Browser frame.
	 */
	constructor(browserFrame: IBrowserFrame) {
		super();

		this.#scriptLoader = new HTMLScriptElementScriptLoader({
			element: this,
			browserFrame
		});

		this[PropertySymbol.attributes] = new HTMLScriptElementNamedNodeMap(this, this.#scriptLoader);
	}

	/**
	 * Returns type.
	 *
	 * @returns Type.
	 */
	public get type(): string {
		return this.getAttribute('type') || '';
	}

	/**
	 * Sets type.
	 *
	 * @param type Type.
	 */
	public set type(type: string) {
		this.setAttribute('type', type);
	}

	/**
	 * Returns source.
	 *
	 * @returns Source.
	 */
	public get src(): string {
		if (!this.hasAttribute('src')) {
			return '';
		}

		try {
			return new URL(this.getAttribute('src'), this[PropertySymbol.ownerDocument].location.href)
				.href;
		} catch (e) {
			return this.getAttribute('src');
		}
	}

	/**
	 * Sets source.
	 *
	 * @param src Source.
	 */
	public set src(src: string) {
		this.setAttribute('src', src);
	}

	/**
	 * Returns charset.
	 *
	 * @returns Charset.
	 */
	public get charset(): string {
		return this.getAttribute('charset') || '';
	}

	/**
	 * Sets charset.
	 *
	 * @param charset Charset.
	 */
	public set charset(charset: string) {
		this.setAttribute('charset', charset);
	}

	/**
	 * Returns lang.
	 *
	 * @returns Lang.
	 */
	public get lang(): string {
		return this.getAttribute('lang') || '';
	}

	/**
	 * Sets lang.
	 *
	 * @param lang Lang.
	 */
	public set lang(lang: string) {
		this.setAttribute('lang', lang);
	}

	/**
	 * Returns async.
	 *
	 * @returns Async.
	 */
	public get async(): boolean {
		return this.getAttribute('async') !== null;
	}

	/**
	 * Sets async.
	 *
	 * @param async Async.
	 */
	public set async(async: boolean) {
		if (!async) {
			this.removeAttribute('async');
		} else {
			this.setAttribute('async', '');
		}
	}

	/**
	 * Returns defer.
	 *
	 * @returns Defer.
	 */
	public get defer(): boolean {
		return this.getAttribute('defer') !== null;
	}

	/**
	 * Sets defer.
	 *
	 * @param defer Defer.
	 */
	public set defer(defer: boolean) {
		if (!defer) {
			this.removeAttribute('defer');
		} else {
			this.setAttribute('defer', '');
		}
	}

	/**
	 * Returns text.
	 *
	 * @returns Text.
	 */
	public get text(): string {
		return this.textContent;
	}

	/**
	 * Sets text.
	 *
	 * @param text Text.
	 */
	public set text(text: string) {
		this.textContent = text;
	}

	/**
	 * @override
	 */
	public override [PropertySymbol.cloneNode](deep = false): HTMLScriptElement {
		return <HTMLScriptElement>super[PropertySymbol.cloneNode](deep);
	}

	/**
	 * @override
	 */
	public override [PropertySymbol.connectToNode](parentNode: Node = null): void {
		const isConnected = this[PropertySymbol.isConnected];
		const isParentConnected = parentNode ? parentNode[PropertySymbol.isConnected] : false;
		const browserSettings = WindowBrowserSettingsReader.getSettings(
			this[PropertySymbol.ownerDocument][PropertySymbol.ownerWindow]
		);

		super[PropertySymbol.connectToNode](parentNode);

		if (
			isParentConnected &&
			isConnected !== isParentConnected &&
			this[PropertySymbol.evaluateScript]
		) {
			const src = this.getAttribute('src');

			if (src !== null) {
				this.#scriptLoader.loadScript(src);
			} else if (!browserSettings.disableJavaScriptEvaluation) {
				const textContent = this.textContent;
				const type = this.getAttribute('type');
				if (
					textContent &&
					(type === null ||
						type === 'application/x-ecmascript' ||
						type === 'application/x-javascript' ||
						type.startsWith('text/javascript'))
				) {
					this[PropertySymbol.ownerDocument][PropertySymbol.currentScript] = this;

					const code =
						`//# sourceURL=${
							this[PropertySymbol.ownerDocument][PropertySymbol.ownerWindow].location.href
						}\n` + textContent;

					if (
						browserSettings.disableErrorCapturing ||
						browserSettings.errorCapture !== BrowserErrorCaptureEnum.tryAndCatch
					) {
						this[PropertySymbol.ownerDocument][PropertySymbol.ownerWindow].eval(code);
					} else {
						WindowErrorUtility.captureError(
							this[PropertySymbol.ownerDocument][PropertySymbol.ownerWindow],
							() => this[PropertySymbol.ownerDocument][PropertySymbol.ownerWindow].eval(code)
						);
					}

					this[PropertySymbol.ownerDocument][PropertySymbol.currentScript] = null;
				}
			}
		}
	}
}
