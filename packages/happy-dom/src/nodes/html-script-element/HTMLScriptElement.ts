import Attr from '../../attribute/Attr';
import HTMLElement from '../html-element/HTMLElement';
import IHTMLScriptElement from './IHTMLScriptElement';
import ScriptUtility from './ScriptUtility';
import Event from '../../event/Event';
import ErrorEvent from '../../event/events/ErrorEvent';
import INode from '../../nodes/node/INode';

/**
 * HTML Script Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLScriptElement.
 */
export default class HTMLScriptElement extends HTMLElement implements IHTMLScriptElement {
	public onerror: (event: ErrorEvent) => void = null;
	public onload: (event: Event) => void = null;
	public _evaluateScript = true;

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
	 * Returns source.
	 *
	 * @returns Source.
	 */
	public get src(): string {
		return this.getAttributeNS(null, 'src') || '';
	}

	/**
	 * Sets source.
	 *
	 * @param source Source.
	 */
	public set src(src: string) {
		this.setAttributeNS(null, 'src', src);
	}

	/**
	 * Returns charset.
	 *
	 * @returns Charset.
	 */
	public get charset(): string {
		return this.getAttributeNS(null, 'charset') || '';
	}

	/**
	 * Sets charset.
	 *
	 * @param charset Charset.
	 */
	public set charset(charset: string) {
		this.setAttributeNS(null, 'charset', charset);
	}

	/**
	 * Returns lang.
	 *
	 * @returns Lang.
	 */
	public get lang(): string {
		return this.getAttributeNS(null, 'lang') || '';
	}

	/**
	 * Sets lang.
	 *
	 * @param lang Lang.
	 */
	public set lang(lang: string) {
		this.setAttributeNS(null, 'lang', lang);
	}

	/**
	 * Returns async.
	 *
	 * @returns Async.
	 */
	public get async(): boolean {
		return this.getAttributeNS(null, 'async') !== null;
	}

	/**
	 * Sets async.
	 *
	 * @param async Async.
	 */
	public set async(async: boolean) {
		if (!async) {
			this.removeAttributeNS(null, 'async');
		} else {
			this.setAttributeNS(null, 'async', '');
		}
	}

	/**
	 * Returns defer.
	 *
	 * @returns Defer.
	 */
	public get defer(): boolean {
		return this.getAttributeNS(null, 'defer') !== null;
	}

	/**
	 * Sets defer.
	 *
	 * @param defer Defer.
	 */
	public set defer(defer: boolean) {
		if (!defer) {
			this.removeAttributeNS(null, 'defer');
		} else {
			this.setAttributeNS(null, 'defer', '');
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
	 * The setAttributeNode() method adds a new Attr node to the specified element.
	 *
	 * @override
	 * @param attribute Attribute.
	 * @returns Replaced attribute.
	 */
	public setAttributeNode(attribute: Attr): Attr {
		const replacedAttribute = super.setAttributeNode(attribute);

		if (attribute.name === 'src' && attribute.value !== null && this.isConnected) {
			ScriptUtility.loadExternalScript(this);
		}

		return replacedAttribute;
	}

	/**
	 * Clones a node.
	 *
	 * @override
	 * @param [deep=false] "true" to clone deep.
	 * @returns Cloned node.
	 */
	public cloneNode(deep = false): IHTMLScriptElement {
		return <IHTMLScriptElement>super.cloneNode(deep);
	}

	/**
	 * @override
	 */
	public _connectToNode(parentNode: INode = null): void {
		const isConnected = this.isConnected;
		const isParentConnected = parentNode ? parentNode.isConnected : false;

		super._connectToNode(parentNode);

		if (isConnected !== isParentConnected && this._evaluateScript) {
			const src = this.getAttributeNS(null, 'src');

			if (src !== null) {
				ScriptUtility.loadExternalScript(this);
			} else {
				const textContent = this.textContent;
				if (textContent) {
					this.ownerDocument.defaultView.eval(textContent);
				}
			}
		}
	}
}
