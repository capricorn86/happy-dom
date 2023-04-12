import IAttr from '../attr/IAttr';
import CSSStyleSheet from '../../css/CSSStyleSheet';
import ResourceFetch from '../../fetch/ResourceFetch';
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
	public override setAttributeNode(attribute: IAttr): IAttr {
		const replacedAttribute = super.setAttributeNode(attribute);
		const rel = this.getAttribute('rel');
		const href = this.getAttribute('href');

		if (attribute.name === 'rel' && this._relList) {
			this._relList._updateIndices();
		}

		if (
			(attribute.name === 'rel' || attribute.name === 'href') &&
			href !== null &&
			rel &&
			rel.toLowerCase() === 'stylesheet' &&
			this.isConnected &&
			!this.ownerDocument.defaultView.happyDOM.settings.disableCSSFileLoading
		) {
			(<Document>this.ownerDocument)._readyStateManager.startTask();
			ResourceFetch.fetch(this.ownerDocument, href)
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
	public override removeAttributeNode(attribute: IAttr): IAttr {
		super.removeAttributeNode(attribute);

		if (attribute.name === 'rel' && this._relList) {
			this._relList._updateIndices();
		}

		return attribute;
	}

	/**
	 * @override
	 */
	public override _connectToNode(parentNode: INode = null): void {
		const isConnected = this.isConnected;
		const isParentConnected = parentNode ? parentNode.isConnected : false;

		super._connectToNode(parentNode);

		if (
			isParentConnected &&
			isConnected !== isParentConnected &&
			this._evaluateCSS &&
			!this.ownerDocument.defaultView.happyDOM.settings.disableCSSFileLoading
		) {
			const href = this.getAttribute('href');
			const rel = this.getAttribute('rel');

			if (href !== null && rel && rel.toLowerCase() === 'stylesheet') {
				(<Document>this.ownerDocument)._readyStateManager.startTask();
				ResourceFetch.fetch(this.ownerDocument, href)
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
}
