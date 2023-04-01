import CSSStyleSheet from '../../css/CSSStyleSheet';
import HTMLElement from '../html-element/HTMLElement';
import IHTMLStyleElement from './IHTMLStyleElement';

/**
 * HTML Style Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLStyleElement.
 */
export default class HTMLStyleElement extends HTMLElement implements IHTMLStyleElement {
	private _styleSheet: CSSStyleSheet | null = null;

	/**
	 * Returns CSS style sheet.
	 *
	 * @returns CSS style sheet.
	 */
	public get sheet(): CSSStyleSheet {
		if (!this.isConnected) {
			return null;
		}
		if (!this._styleSheet) {
			this._styleSheet = new CSSStyleSheet();
		}
		this._styleSheet.replaceSync(this.textContent);
		return this._styleSheet;
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
	 * Returns disabled.
	 *
	 * @returns Disabled.
	 */
	public get disabled(): boolean {
		return this.getAttribute('disabled') !== null;
	}

	/**
	 * Sets disabled.
	 *
	 * @param disabled Disabled.
	 */
	public set disabled(disabled: boolean) {
		if (!disabled) {
			this.removeAttribute('disabled');
		} else {
			this.setAttribute('disabled', '');
		}
	}
}
