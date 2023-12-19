import CSSStyleSheet from '../../css/CSSStyleSheet.js';
import HTMLElement from '../html-element/HTMLElement.js';
import IHTMLLinkElement from './IHTMLLinkElement.js';
import Event from '../../event/Event.js';
import ErrorEvent from '../../event/events/ErrorEvent.js';
import INode from '../../nodes/node/INode.js';
import DOMTokenList from '../../dom-token-list/DOMTokenList.js';
import IDOMTokenList from '../../dom-token-list/IDOMTokenList.js';
import INamedNodeMap from '../../named-node-map/INamedNodeMap.js';
import HTMLLinkElementNamedNodeMap from './HTMLLinkElementNamedNodeMap.js';
import HTMLLinkElementStyleSheetLoader from './HTMLLinkElementStyleSheetLoader.js';
import IBrowserFrame from '../../browser/types/IBrowserFrame.js';

/**
 * HTML Link Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLLinkElement.
 */
export default class HTMLLinkElement extends HTMLElement implements IHTMLLinkElement {
	public override readonly attributes: INamedNodeMap;
	public onerror: (event: ErrorEvent) => void = null;
	public onload: (event: Event) => void = null;
	public readonly sheet: CSSStyleSheet = null;
	public __evaluateCSS__ = true;
	public __relList__: DOMTokenList = null;
	#styleSheetLoader: HTMLLinkElementStyleSheetLoader;

	/**
	 * Constructor.
	 *
	 * @param browserFrame Browser frame.
	 */
	constructor(browserFrame: IBrowserFrame) {
		super();

		this.#styleSheetLoader = new HTMLLinkElementStyleSheetLoader({
			element: this,
			browserFrame
		});

		this.attributes = new HTMLLinkElementNamedNodeMap(this, this.#styleSheetLoader);
	}

	/**
	 * Returns rel list.
	 *
	 * @returns Rel list.
	 */
	public get relList(): IDOMTokenList {
		if (!this.__relList__) {
			this.__relList__ = new DOMTokenList(this, 'rel');
		}
		return <IDOMTokenList>this.__relList__;
	}

	/**
	 * Returns as.
	 *
	 * @returns As.
	 */
	public get as(): string {
		return this.getAttribute('as') || '';
	}

	/**
	 * Sets crossOrigin.
	 *
	 * @param crossOrigin CrossOrigin.
	 */
	public set as(as: string) {
		this.setAttribute('as', as);
	}

	/**
	 * Returns crossOrigin.
	 *
	 * @returns CrossOrigin.
	 */
	public get crossOrigin(): string {
		return this.getAttribute('crossorigin') || '';
	}

	/**
	 * Sets crossOrigin.
	 *
	 * @param crossOrigin CrossOrigin.
	 */
	public set crossOrigin(crossOrigin: string) {
		this.setAttribute('crossorigin', crossOrigin);
	}

	/**
	 * Returns href.
	 *
	 * @returns Href.
	 */
	public get href(): string {
		return this.getAttribute('href') || '';
	}

	/**
	 * Sets href.
	 *
	 * @param href Href.
	 */
	public set href(href: string) {
		this.setAttribute('href', href);
	}

	/**
	 * Returns hreflang.
	 *
	 * @returns Hreflang.
	 */
	public get hreflang(): string {
		return this.getAttribute('hreflang') || '';
	}

	/**
	 * Sets hreflang.
	 *
	 * @param hreflang Hreflang.
	 */
	public set hreflang(hreflang: string) {
		this.setAttribute('hreflang', hreflang);
	}

	/**
	 * Returns media.
	 *
	 * @returns Media.
	 */
	public get media(): string {
		return this.getAttribute('media') || '';
	}

	/**
	 * Sets media.
	 *
	 * @param media Media.
	 */
	public set media(media: string) {
		this.setAttribute('media', media);
	}

	/**
	 * Returns referrerPolicy.
	 *
	 * @returns ReferrerPolicy.
	 */
	public get referrerPolicy(): string {
		return this.getAttribute('referrerPolicy') || '';
	}

	/**
	 * Sets referrerPolicy.
	 *
	 * @param referrerPolicy ReferrerPolicy.
	 */
	public set referrerPolicy(referrerPolicy: string) {
		this.setAttribute('referrerPolicy', referrerPolicy);
	}

	/**
	 * Returns rel.
	 *
	 * @returns Rel.
	 */
	public get rel(): string {
		return this.getAttribute('rel') || '';
	}

	/**
	 * Sets rel.
	 *
	 * @param rel Rel.
	 */
	public set rel(rel: string) {
		this.setAttribute('rel', rel);
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
	 * @override
	 */
	public override __connectToNode__(parentNode: INode = null): void {
		const isConnected = this.isConnected;
		const isParentConnected = parentNode ? parentNode.isConnected : false;

		super.__connectToNode__(parentNode);

		if (isParentConnected && isConnected !== isParentConnected && this.__evaluateCSS__) {
			this.#styleSheetLoader.loadStyleSheet(this.getAttribute('href'), this.getAttribute('rel'));
		}
	}
}
