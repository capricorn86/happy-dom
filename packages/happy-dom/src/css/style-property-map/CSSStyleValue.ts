import CSSStyleDeclaration from '../declaration/CSSStyleDeclaration.js';

/**
 * CSSStyleValue interface.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleValue
 */
export default class CSSStyleValue {
	#style: CSSStyleDeclaration;
	#property: string;

	/**
	 * Constructor.
	 *
	 * @param style Style.
	 * @param property Property.
	 */
	constructor(style: CSSStyleDeclaration, property: string) {
		this.#style = style;
		this.#property = property;
	}

	/**
	 * Returns value as string.
	 *
	 * @returns Value.
	 */
	public toString(): string {
		return this.#style.getPropertyValue(this.#property);
	}
}
