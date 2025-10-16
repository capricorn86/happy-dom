import StylePropertyMapReadOnly from './StylePropertyMapReadOnly.js';
import * as PropertySymbol from '../../PropertySymbol.js';

/**
 * StylePropertyMapReadOnly interface.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/StylePropertyMapReadOnly
 */
export default class StylePropertyMap extends StylePropertyMapReadOnly {
	/**
	 * Appends a property.
	 *
	 * @param property Property.
	 * @param value Value.
	 */
	public append(property: string, value: string): void {
		this[PropertySymbol.style].setProperty(property, value);
	}

	/**
	 * Clears all properties.
	 */
	public clear(): void {
		this[PropertySymbol.style].cssText = '';
	}

	/**
	 * Deletes a property.
	 *
	 * @param property Property.
	 */
	public delete(property: string): void {
		this[PropertySymbol.style].removeProperty(property);
	}

	/**
	 * Sets a property.
	 *
	 * @param property Property.
	 * @param value Value.
	 */
	public set(property: string, value: string): void {
		this[PropertySymbol.style].setProperty(property, value);
	}
}
