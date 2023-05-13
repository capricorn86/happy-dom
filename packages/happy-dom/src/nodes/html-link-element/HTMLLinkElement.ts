import IAttr from '../attr/IAttr';
import CSSStyleSheet from '../../css/CSSStyleSheet';
import HTMLElement from '../html-element/HTMLElement';
import IHTMLLinkElement from './IHTMLLinkElement';
import Event from '../../event/Event';
import ErrorEvent from '../../event/events/ErrorEvent';
import INode from '../../nodes/node/INode';
import DOMTokenList from '../../dom-token-list/DOMTokenList';
import IDOMTokenList from '../../dom-token-list/IDOMTokenList';
import HTMLLinkElementUtility from './HTMLLinkElementUtility';

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

		if (attribute.name === 'rel' && this._relList) {
			this._relList._updateIndices();
		}

		if (attribute.name === 'rel' || attribute.name === 'href') {
			HTMLLinkElementUtility.loadExternalStylesheet(this);
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

		if (isParentConnected && isConnected !== isParentConnected && this._evaluateCSS) {
			HTMLLinkElementUtility.loadExternalStylesheet(this);
		}
	}
}
