import Attr from '../../attribute/Attr';
import HTMLElement from '../html-element/HTMLElement';
import IHTMLScriptElement from './IHTMLScriptElement';
import ScriptUtility from './ScriptUtility';

/**
 * HTML Script Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLScriptElement
 */
export default class HTMLScriptElement extends HTMLElement implements IHTMLScriptElement {
	public _evaluateScript = true;

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

			if (isConnected && this._evaluateScript) {
				const src = this.getAttributeNS(null, 'src');

				if (src !== null) {
					ScriptUtility.loadExternalScript({
						window: this.ownerDocument.defaultView,
						url: src,
						async: this.getAttributeNS(null, 'async') !== null
					});
				} else {
					const textContent = this.textContent;
					if (textContent) {
						this.ownerDocument.defaultView.eval(textContent);
					}
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
	 * Returns type.
	 *
	 * @return Type.
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
	 * @return Source.
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
	 * @return Charset.
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
	 * @return Lang.
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
	 * @return Async.
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
	 * @return Defer.
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
	 * @return Text.
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
			ScriptUtility.loadExternalScript({
				window: this.ownerDocument.defaultView,
				url: attribute.value,
				async: this.getAttributeNS(null, 'async') !== null
			});
		}

		return replacedAttribute;
	}

	/**
	 * Clones a node.
	 *
	 * @override
	 * @param [deep=false] "true" to clone deep.
	 * @return Cloned node.
	 */
	public cloneNode(deep = false): IHTMLScriptElement {
		return <IHTMLScriptElement>super.cloneNode(deep);
	}
}
