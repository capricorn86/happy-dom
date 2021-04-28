import Attr from '../../attribute/Attr';
import CSSStyleSheet from '../../css/CSSStyleSheet';
import ResourceFetcher from '../../fetch/ResourceFetcher';
import HTMLElement from '../html-element/HTMLElement';
import IHTMLLinkElement from './IHTMLLinkElement';
import Event from '../../event/Event';
import ErrorEvent from '../../event/events/ErrorEvent';

/**
 * HTML Link Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLLinkElement
 */
export default class HTMLLinkElement extends HTMLElement implements IHTMLLinkElement {
	public onerror: (event: ErrorEvent) => void = null;
	public onload: (event: Event) => void = null;
	public readonly sheet: CSSStyleSheet = null;
	public _evaluateCSS = true;

	/**
	 * "true" if connected to DOM.
	 *
	 * @return "true" if connected.
	 */
	public get isConnected(): boolean {
		return this._isConnected;
	}

	/**
	 * Sets the connected state.
	 *
	 * @param isConnected "true" if connected.
	 */
	public set isConnected(isConnected) {
		if (this._isConnected !== isConnected) {
			this._isConnected = isConnected;

			for (const child of this.childNodes) {
				child.isConnected = isConnected;
			}

			// eslint-disable-next-line
			if (this.shadowRoot) {
				// eslint-disable-next-line
				this.shadowRoot.isConnected = isConnected;
			}

			if (isConnected && this._evaluateCSS) {
				const href = this.getAttributeNS(null, 'href');
				const rel = this.getAttributeNS(null, 'rel');
				if (href !== null && rel && rel.toLowerCase() === 'stylesheet') {
					ResourceFetcher.fetch({ window: this.ownerDocument.defaultView, url: href })
						.then(code => {
							const styleSheet = new CSSStyleSheet();
							styleSheet.replaceSync(code);
							(<CSSStyleSheet>this.sheet) = styleSheet;
							this.dispatchEvent(new Event('load'));
						})
						.catch(error => {
							this.dispatchEvent(
								new ErrorEvent('error', {
									message: error.message,
									error
								})
							);
						});
				}
			}

			if (isConnected && this.connectedCallback) {
				this.connectedCallback();
			} else if (!isConnected && this.disconnectedCallback) {
				this.disconnectedCallback();
			}
		}
	}

	/**
	 * Returns as.
	 *
	 * @return as.
	 */
	public get as(): string {
		return this.getAttributeNS(null, 'as') || '';
	}

	/**
	 * Sets crossOrigin.
	 *
	 * @param crossOrigin crossOrigin.
	 */
	public set as(as: string) {
		this.setAttributeNS(null, 'as', as);
	}

	/**
	 * Returns crossOrigin.
	 *
	 * @return crossOrigin.
	 */
	public get crossOrigin(): string {
		return this.getAttribute('crossorigin') || '';
	}

	/**
	 * Sets crossOrigin.
	 *
	 * @param crossOrigin crossOrigin.
	 */
	public set crossOrigin(crossOrigin: string) {
		this.setAttributeNS(null, 'crossorigin', crossOrigin);
	}

	/**
	 * Returns href.
	 *
	 * @return Href.
	 */
	public get href(): string {
		return this.getAttributeNS(null, 'href') || '';
	}

	/**
	 * Sets href.
	 *
	 * @param href Href.
	 */
	public set href(href: string) {
		this.setAttributeNS(null, 'href', href);
	}

	/**
	 * Returns hreflang.
	 *
	 * @return hreflang.
	 */
	public get hreflang(): string {
		return this.getAttributeNS(null, 'hreflang') || '';
	}

	/**
	 * Sets hreflang.
	 *
	 * @param hreflang hreflang.
	 */
	public set hreflang(hreflang: string) {
		this.setAttributeNS(null, 'hreflang', hreflang);
	}

	/**
	 * Returns media.
	 *
	 * @return media.
	 */
	public get media(): string {
		return this.getAttributeNS(null, 'media') || '';
	}

	/**
	 * Sets media.
	 *
	 * @param media media.
	 */
	public set media(media: string) {
		this.setAttributeNS(null, 'media', media);
	}

	/**
	 * Returns referrerPolicy.
	 *
	 * @return referrerPolicy.
	 */
	public get referrerPolicy(): string {
		return this.getAttribute('referrerPolicy') || '';
	}

	/**
	 * Sets referrerPolicy.
	 *
	 * @param referrerPolicy referrerPolicy.
	 */
	public set referrerPolicy(referrerPolicy: string) {
		this.setAttributeNS(null, 'referrerPolicy', referrerPolicy);
	}

	/**
	 * Returns rel.
	 *
	 * @return rel.
	 */
	public get rel(): string {
		return this.getAttributeNS(null, 'rel') || '';
	}

	/**
	 * Sets rel.
	 *
	 * @param rel rel.
	 */
	public set rel(rel: string) {
		this.setAttributeNS(null, 'rel', rel);
	}

	/**
	 * Returns type.
	 *
	 * @return type.
	 */
	public get type(): string {
		return this.getAttributeNS(null, 'type') || '';
	}

	/**
	 * Sets type.
	 *
	 * @param type type.
	 */
	public set type(type: string) {
		this.setAttributeNS(null, 'type', type);
	}

	/**
	 * The setAttributeNode() method adds a new Attr node to the specified element.
	 *
	 * @override
	 * @param attribute Attribute.
	 * @returns Replaced attribute.
	 */
	public setAttributeNode(attribute: Attr): Attr {
		const replacedAttribute = super.setAttributeNode(attribute);
		const rel = this.getAttributeNS(null, 'rel');
		const href = this.getAttributeNS(null, 'href');

		if (
			(attribute.name === 'rel' || attribute.name === 'href') &&
			href !== null &&
			rel &&
			rel.toLowerCase() === 'stylesheet' &&
			this.isConnected
		) {
			ResourceFetcher.fetch({ window: this.ownerDocument.defaultView, url: href })
				.then(code => {
					const styleSheet = new CSSStyleSheet();
					styleSheet.replaceSync(code);
					(<CSSStyleSheet>this.sheet) = styleSheet;
					this.dispatchEvent(new Event('load'));
				})
				.catch(error => {
					this.dispatchEvent(
						new ErrorEvent('error', {
							message: error.message,
							error
						})
					);
				});
		}

		return replacedAttribute;
	}
}
