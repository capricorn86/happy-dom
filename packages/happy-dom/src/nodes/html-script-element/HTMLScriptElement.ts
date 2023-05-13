import IAttr from '../attr/IAttr';
import HTMLElement from '../html-element/HTMLElement';
import IHTMLScriptElement from './IHTMLScriptElement';
import HTMLScriptElementUtility from './HTMLScriptElementUtility';
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
		return this.getAttribute('src') || '';
	}

	/**
	 * Sets source.
	 *
	 * @param source Source.
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
	 * The setAttributeNode() method adds a new Attr node to the specified element.
	 *
	 * @override
	 * @param attribute Attribute.
	 * @returns Replaced attribute.
	 */
	public setAttributeNode(attribute: IAttr): IAttr {
		const replacedAttribute = super.setAttributeNode(attribute);

		if (attribute.name === 'src' && attribute.value !== null && this.isConnected) {
			HTMLScriptElementUtility.loadExternalScript(this);
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
	public override _connectToNode(parentNode: INode = null): void {
		const isConnected = this.isConnected;
		const isParentConnected = parentNode ? parentNode.isConnected : false;

		super._connectToNode(parentNode);

		if (isParentConnected && isConnected !== isParentConnected && this._evaluateScript) {
			const src = this.getAttribute('src');

			if (src !== null) {
				HTMLScriptElementUtility.loadExternalScript(this);
			} else if (!this.ownerDocument.defaultView.happyDOM.settings.disableJavaScriptEvaluation) {
				const textContent = this.textContent;
				const type = this.getAttribute('type');
				if (
					textContent &&
					(type === null ||
						type === 'application/x-ecmascript' ||
						type === 'application/x-javascript' ||
						type.startsWith('text/javascript'))
				) {
					this.ownerDocument.defaultView.eval(textContent);
				}
			}
		}
	}
}
