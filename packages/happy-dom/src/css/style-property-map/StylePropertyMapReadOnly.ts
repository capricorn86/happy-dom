import CSSStyleDeclaration from '../declaration/CSSStyleDeclaration.js';
import CSSKeywordValue from './CSSKeywordValue.js';
import CSSStyleValue from './CSSStyleValue.js';
import * as PropertySymbol from '../../PropertySymbol.js';

/**
 * StylePropertyMapReadOnly interface.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/StylePropertyMapReadOnly
 */
export default class StylePropertyMapReadOnly {
	public [PropertySymbol.style]: CSSStyleDeclaration;

	/**
	 * Constructor.
	 *
	 * @param illegalConstructorSymbol Illegal constructor symbol.
	 * @param style Style.
	 */
	constructor(illegalConstructorSymbol: Symbol, style: CSSStyleDeclaration) {
		if (illegalConstructorSymbol !== PropertySymbol.illegalConstructor) {
			throw new TypeError('Illegal constructor');
		}

		this[PropertySymbol.style] = style;
	}

	/**
	 * Returns size.
	 *
	 * @returns Size.
	 */
	public get size(): number {
		return this[PropertySymbol.style].length;
	}

	/**
	 * Returns an iterator, allowing you to go through all values of the key/value pairs contained in this object.
	 *
	 * @returns Iterator.
	 */
	public [Symbol.iterator](): IterableIterator<[string, CSSKeywordValue[]]> {
		return this.entries();
	}

	/**
	 * Returns an iterator, allowing you to go through all key/value pairs contained in this object.
	 *
	 * @returns Entries.
	 */
	public entries(): IterableIterator<[string, CSSKeywordValue[]]> {
		const length = this[PropertySymbol.style].length;
		const array = new Array(length);
		for (let i = 0; i < length; i++) {
			const property = (<any>this[PropertySymbol.style])[i];
			array[i] = [
				property,
				[new CSSKeywordValue(this[PropertySymbol.style].getPropertyValue(property))]
			];
		}
		return array.values();
	}

	/**
	 * Returns an iterator, allowing you to go through all values of the key/value pairs contained in this object.
	 *
	 * @returns Values.
	 */
	public values(): IterableIterator<CSSKeywordValue[]> {
		const length = this[PropertySymbol.style].length;
		const array = new Array(length);
		for (let i = 0; i < length; i++) {
			const property = (<any>this[PropertySymbol.style])[i];
			array[i] = [new CSSKeywordValue(this[PropertySymbol.style].getPropertyValue(property))];
		}
		return array.values();
	}

	/**
	 * Returns an iterator, allowing you to go through all keys of the key/value pairs contained in this object.
	 *
	 * @returns Keys.
	 */
	public keys(): IterableIterator<string> {
		const length = this[PropertySymbol.style].length;
		const array = new Array(length);
		for (let i = 0; i < length; i++) {
			array[i] = (<any>this[PropertySymbol.style])[i];
		}
		return array.values();
	}

	/**
	 * Returns a property value.
	 *
	 * @param property Property.
	 * @returns Value.
	 */
	public get(property: string): CSSStyleValue {
		return new CSSStyleValue(
			PropertySymbol.illegalConstructor,
			this[PropertySymbol.style],
			property
		);
	}

	/**
	 * Returns array of property values.
	 *
	 * @param property Property.
	 * @returns Values.
	 */
	public getAll(property: string): CSSStyleValue[] {
		return [
			new CSSStyleValue(PropertySymbol.illegalConstructor, this[PropertySymbol.style], property)
		];
	}

	/**
	 * Checks if a property is present.
	 *
	 * @param property Property.
	 * @returns True if the property is present.
	 */
	public has(property: string): boolean {
		return !!this[PropertySymbol.style].getPropertyValue(property);
	}
}
