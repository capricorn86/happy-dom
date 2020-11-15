import HTMLElement from '../html-element/HTMLElement';

/**
 * HTML Script Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLScriptElement
 */
export default class HTMLScriptElement extends HTMLElement {
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

			if (this._evaluateScript) {
				eval(this.textContent);
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
	 * Sets type.
	 *
	 * @param type Type.
	 */
	public set value(type: string) {
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
		this.setAttributeNS(null, 'async', async ? '' : null);
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
		this.setAttributeNS(null, 'defer', defer ? '' : null);
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
}
