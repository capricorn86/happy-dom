import CSSStyleDeclaration from '../../css/declaration/CSSStyleDeclaration.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import Element from '../element/Element.js';
import HTMLElementUtility from '../html-element/HTMLElementUtility.js';
import DOMStringMap from '../../dom/DOMStringMap.js';

/**
 * Math ML Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/MathMLElement.
 */
export default class MathMLElement extends Element {
	// Internal properties
	public [PropertySymbol.style]: CSSStyleDeclaration | null = null;

	// Private properties
	#dataset: DOMStringMap | null = null;

	/**
	 * Returns data set.
	 *
	 * @returns Data set.
	 */
	public get dataset(): DOMStringMap {
		return (this.#dataset ??= new DOMStringMap(PropertySymbol.illegalConstructor, this));
	}

	/**
	 * Returns style.
	 *
	 * @returns Style.
	 */
	public get style(): CSSStyleDeclaration {
		if (!this[PropertySymbol.style]) {
			this[PropertySymbol.style] = new CSSStyleDeclaration(
				PropertySymbol.illegalConstructor,
				this[PropertySymbol.window],
				{ element: this }
			);
		}
		return this[PropertySymbol.style];
	}

	/**
	 * Returns tab index.
	 *
	 * @returns Tab index.
	 */
	public get tabIndex(): number {
		const tabIndex = this.getAttribute('tabindex');
		return tabIndex !== null ? Number(tabIndex) : -1;
	}

	/**
	 * Returns tab index.
	 *
	 * @param tabIndex Tab index.
	 */
	public set tabIndex(tabIndex: number) {
		if (tabIndex === -1) {
			this.removeAttribute('tabindex');
		} else {
			this.setAttribute('tabindex', String(tabIndex));
		}
	}

	/**
	 * Triggers a blur event.
	 */
	public blur(): void {
		HTMLElementUtility.blur(this);
	}

	/**
	 * Triggers a focus event.
	 */
	public focus(): void {
		HTMLElementUtility.focus(this);
	}
}
