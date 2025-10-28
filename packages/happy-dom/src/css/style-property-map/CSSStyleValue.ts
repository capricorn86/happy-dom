import CSSStyleDeclaration from '../declaration/CSSStyleDeclaration.js';
import * as PropertySymbol from '../../PropertySymbol.js';

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
	 * @param illegalConstructorSymbol
	 * @param style Style.
	 * @param property Property.
	 */
	constructor(illegalConstructorSymbol: Symbol, style: CSSStyleDeclaration, property: string) {
		if (illegalConstructorSymbol !== PropertySymbol.illegalConstructor) {
			throw new TypeError('Illegal constructor');
		}

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
