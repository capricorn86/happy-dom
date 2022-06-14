import HTMLElement from '../html-element/HTMLElement';
import IHTMLOptGroupElement from './IHTMLOptGroupElement';

/**
 * HTML Opt Group Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLOptGroupElement.
 */
export default class HTMLOptGroupElement extends HTMLElement implements IHTMLOptGroupElement {
	/**
	 * Returns label.
	 *
	 * @returns Label.
	 */
	public get label(): string {
		return this.getAttributeNS(null, 'label') || '';
	}

	/**
	 * Sets label.
	 *
	 * @param label Label.
	 */
	public set label(label: string) {
		if (!label) {
			this.removeAttributeNS(null, 'label');
		} else {
			this.setAttributeNS(null, 'label', label);
		}
	}

	/**
	 * Returns disabled.
	 *
	 * @returns Disabled.
	 */
	public get disabled(): boolean {
		return this.getAttributeNS(null, 'disabled') !== null;
	}

	/**
	 * Sets disabled.
	 *
	 * @param disabled Disabled.
	 */
	public set disabled(disabled: boolean) {
		if (!disabled) {
			this.removeAttributeNS(null, 'disabled');
		} else {
			this.setAttributeNS(null, 'disabled', '');
		}
	}
}
