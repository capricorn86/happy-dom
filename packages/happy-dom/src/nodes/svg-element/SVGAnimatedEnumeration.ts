import * as PropertySymbol from '../../PropertySymbol.js';
import SVGElement from './SVGElement.js';

/**
 * SVG Animated Enumaration.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGAnimatedEnumeration
 */
export default class SVGAnimatedEnumeration {
	// Internal properties
	public [PropertySymbol.ownerElement]: SVGElement;
	public [PropertySymbol.attributeName]: string;
	public [PropertySymbol.values]: string[];
	public [PropertySymbol.defaultValue]: string;

	/**
	 * Constructor.
	 *
	 * @param illegalConstructorSymbol Illegal constructor symbol.
	 * @param ownerElement Owner element.
	 * @param attributeName Attribute name.
	 * @param values Values.
	 * @param defaultValue Default value.
	 */
	constructor(
		illegalConstructorSymbol: symbol,
		ownerElement: SVGElement,
		attributeName: string,
		values: string[],
		defaultValue: string
	) {
		if (illegalConstructorSymbol !== PropertySymbol.illegalConstructor) {
			throw new TypeError('Illegal constructor');
		}
		this[PropertySymbol.ownerElement] = ownerElement;
		this[PropertySymbol.attributeName] = attributeName;
		this[PropertySymbol.values] = values;
		this[PropertySymbol.defaultValue] = defaultValue;
	}

	/**
	 * Returns animated value.
	 *
	 * @returns Animated value.
	 */
	public get animVal(): number {
		return this.baseVal;
	}

	/**
	 * Returns animated value.
	 *
	 * @param _value Animated value.
	 */
	public set animVal(_value) {
		// Do nothing
	}

	/**
	 * Returns base value.
	 *
	 * @returns Base value.
	 */
	public get baseVal(): number {
		const value = this[PropertySymbol.ownerElement].getAttribute(
			this[PropertySymbol.attributeName]
		);
		if (!value) {
			return this[PropertySymbol.values].indexOf(this[PropertySymbol.defaultValue]) + 1;
		}
		const index = this[PropertySymbol.values].indexOf(value);
		if (index === -1) {
			return 0;
		}
		return index + 1;
	}

	/**
	 * Sets base value.
	 *
	 * @param value Base value.
	 */
	public set baseVal(value: number) {
		let parsedValue = Number(value);
		if (isNaN(parsedValue)) {
			parsedValue = 0;
		}
		if (parsedValue === 0) {
			throw new TypeError(
				`Failed to set the 'baseVal' property on 'SVGAnimatedEnumeration': The enumeration value provided is 0, which is not settable.`
			);
		}
		if (parsedValue < 0 || parsedValue > this[PropertySymbol.values].length) {
			throw new TypeError(
				`Failed to set the 'baseVal' property on 'SVGAnimatedEnumeration': The enumeration value provided (${parsedValue}) is larger than the largest allowed value (${
					this[PropertySymbol.values].length
				}).`
			);
		}
		const currentValue = this[PropertySymbol.ownerElement].getAttribute(
			this[PropertySymbol.attributeName]
		);
		const isAnyValue = this[PropertySymbol.values][parsedValue - 1] === null;
		const newValue = isAnyValue ? '0' : this[PropertySymbol.values][parsedValue - 1];
		if (
			!currentValue ||
			(isAnyValue && this[PropertySymbol.values].includes(currentValue)) ||
			(!isAnyValue && currentValue !== newValue)
		) {
			this[PropertySymbol.ownerElement].setAttribute(this[PropertySymbol.attributeName], newValue);
		}
	}
}
