import Attr from '../../attribute/Attr';
import CSSStyleSheet from '../../css/CSSStyleSheet';
import ResourceFetchHandler from '../../fetch/ResourceFetchHandler';
import HTMLElement from '../html-element/HTMLElement';
import Document from '../document/Document';
import IHTMLLinkElement from './IHTMLLinkElement';
import Event from '../../event/Event';
import ErrorEvent from '../../event/events/ErrorEvent';
import INode from '../../nodes/node/INode';
import DOMTokenList from '../../dom-token-list/DOMTokenList';
import IDOMTokenList from '../../dom-token-list/IDOMTokenList';

/**
 * HTML Link Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLLinkElement.
 */
export default class HTMLLinkElement extends HTMLElement implements IHTMLLinkElement {
	public onerror: (event: ErrorEvent) => void = null;
	public onload: (event: Event) => void = null;
	public readonly sheet: CSSStyleSheet = null;
	public _evaluateCSS = true;
	private _relList: DOMTokenList = null;

	/**
	 * Returns rel list.
	 *
	 * @returns Rel list.
	 */
	public get relList(): IDOMTokenList {
		if (!this._relList) {
			this._relList = new DOMTokenList(this, 'rel');
		}
		return <IDOMTokenList>this._relList;
	}

	/**
	 * Returns as.
	 *
	 * @returns As.
	 */
	public get as(): string {
		return this.getAttributeNS(null, 'as') || '';
	}

	/**
	 * Sets crossOrigin.
	 *
	 * @param crossOrigin CrossOrigin.
	 */
	public set as(as: string) {
		this.setAttributeNS(null, 'as', as);
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
		this.setAttributeNS(null, 'crossorigin', crossOrigin);
	}

	/**
	 * Returns href.
	 *
	 * @returns Href.
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
	 * @returns Hreflang.
	 */
	public get hreflang(): string {
		return this.getAttributeNS(null, 'hreflang') || '';
	}

	/**
	 * Sets hreflang.
	 *
	 * @param hreflang Hreflang.
	 */
	public set hreflang(hreflang: string) {
		this.setAttributeNS(null, 'hreflang', hreflang);
	}

	/**
	 * Returns media.
	 *
	 * @returns Media.
	 */
	public get media(): string {
		return this.getAttributeNS(null, 'media') || '';
	}

	/**
	 * Sets media.
	 *
	 * @param media Media.
	 */
	public set media(media: string) {
		this.setAttributeNS(null, 'media', media);
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
		this.setAttributeNS(null, 'referrerPolicy', referrerPolicy);
	}

	/**
	 * Returns rel.
	 *
	 * @returns Rel.
	 */
	public get rel(): string {
		return this.getAttributeNS(null, 'rel') || '';
	}

	/**
	 * Sets rel.
	 *
	 * @param rel Rel.
	 */
	public set rel(rel: string) {
		this.setAttributeNS(null, 'rel', rel);
	}

	/**
	 * Returns type.
	 *
	 * @returns Type.
	 */
	public get type(): string {
		return this.getAttributeNS(null, 'type') || '';
	}

	/**
	 * Sets type.
	 *
	 * @param type Type.
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
			(<Document>this.ownerDocument)._readyStateManager.startTask();
			ResourceFetchHandler.fetch(this.ownerDocument, href)
				.then((code) => {
					const styleSheet = new CSSStyleSheet();
					styleSheet.replaceSync(code);
					(<CSSStyleSheet>this.sheet) = styleSheet;
					this.dispatchEvent(new Event('load'));
					(<Document>this.ownerDocument)._readyStateManager.endTask();
				})
				.catch((error) => {
					this.dispatchEvent(
						new ErrorEvent('error', {
							message: error.message,
							error
						})
					);
					this.ownerDocument.defaultView.dispatchEvent(
						new ErrorEvent('error', {
							message: error.message,
							error
						})
					);
					(<Document>this.ownerDocument)._readyStateManager.endTask();
					if (
						!this['_listeners']['error'] &&
						!this.ownerDocument.defaultView['_listeners']['error']
					) {
						this.ownerDocument.defaultView.console.error(error);
					}
				});
		}

		return replacedAttribute;
	}

	/**
	 * @override
	 */
	public _connectToNode(parentNode: INode = null): void {
		const isConnected = this.isConnected;
		const isParentConnected = parentNode ? parentNode.isConnected : false;

		super._connectToNode(parentNode);

		if (isConnected !== isParentConnected && this._evaluateCSS) {
			const href = this.getAttributeNS(null, 'href');
			const rel = this.getAttributeNS(null, 'rel');

			if (href !== null && rel && rel.toLowerCase() === 'stylesheet') {
				(<Document>this.ownerDocument)._readyStateManager.startTask();
				ResourceFetchHandler.fetch(this.ownerDocument, href)
					.then((code) => {
						const styleSheet = new CSSStyleSheet();
						styleSheet.replaceSync(code);
						(<CSSStyleSheet>this.sheet) = styleSheet;
						this.dispatchEvent(new Event('load'));
						(<Document>this.ownerDocument)._readyStateManager.endTask();
					})
					.catch((error) => {
						this.dispatchEvent(
							new ErrorEvent('error', {
								message: error.message,
								error
							})
						);
						this.ownerDocument.defaultView.dispatchEvent(
							new ErrorEvent('error', {
								message: error.message,
								error
							})
						);
						(<Document>this.ownerDocument)._readyStateManager.endTask();
						if (
							!this['_listeners']['error'] &&
							!this.ownerDocument.defaultView['_listeners']['error']
						) {
							this.ownerDocument.defaultView.console.error(error);
						}
					});
			}
		}
	}

	/**
	 * Updates DOM list indices.
	 */
	protected _updateDomListIndices(): void {
		super._updateDomListIndices();

		if (this._relList) {
			this._relList._updateIndices();
		}
	}
}
