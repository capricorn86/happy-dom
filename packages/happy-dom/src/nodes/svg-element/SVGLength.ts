import SVGElement from './SVGElement.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import SVGUnitTypeEnum from './SVGUnitTypeEnum.js';

/**
 * SVG length.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGLength
 */
export default class SVGLength {
	// Static properties
	public static SVG_LENGTHTYPE_UNKNOWN = SVGUnitTypeEnum.unknown;
	public static SVG_LENGTHTYPE_NUMBER = SVGUnitTypeEnum.number;
	public static SVG_LENGTHTYPE_PERCENTAGE = SVGUnitTypeEnum.percentage;
	public static SVG_LENGTHTYPE_EMS = 3;
	public static SVG_LENGTHTYPE_EXS = 4;
	public static SVG_LENGTHTYPE_PX = 5;
	public static SVG_LENGTHTYPE_CM = 6;
	public static SVG_LENGTHTYPE_MM = 7;
	public static SVG_LENGTHTYPE_IN = 8;
	public static SVG_LENGTHTYPE_PT = 9;
	public static SVG_LENGTHTYPE_PC = 10;

	// Internal properties
	public [PropertySymbol.ownerElement]: SVGElement;
	public [PropertySymbol.attributeName]: string | null;
	public [PropertySymbol.value]: number = 0;

	/**
	 * Constructor.
	 *
	 * @param illegalConstructorSymbol Illegal constructor symbol.
	 * @param ownerElement Owner element.
	 * @param [attributeName] Attribute name.
	 */
	constructor(
		illegalConstructorSymbol: symbol,
		ownerElement: SVGElement,
		attributeName: string | null = null
	) {
		if (illegalConstructorSymbol !== PropertySymbol.illegalConstructor) {
			throw new TypeError('Illegal constructor');
		}
		this[PropertySymbol.ownerElement] = ownerElement;
		this[PropertySymbol.attributeName] = attributeName;
	}

	/**
	 * Returns unit type.
	 *
	 * @returns Unit type.
	 */
	public get unitType(): number {
		return SVGLength.SVG_LENGTHTYPE_NUMBER;
	}

	/**
	 * Returns value.
	 *
	 * @returns Value.
	 */
	public get value(): number {
		if (!this[PropertySymbol.attributeName]) {
			return this[PropertySymbol.value];
		}
		const value = this[PropertySymbol.ownerElement].getAttribute(
			this[PropertySymbol.attributeName]
		);
		const parsedValue = parseFloat(value);
		return isNaN(parsedValue) ? 0 : parsedValue;
	}

	/**
	 * Sets value.
	 *
	 * @param value Value.
	 */
	public set value(value: number) {
		value = typeof value !== 'number' ? parseFloat(String(value)) : value;
		if (isNaN(value)) {
			throw new this[PropertySymbol.ownerElement][PropertySymbol.window].TypeError(
				`Failed to set the 'value' property on 'SVGLength': The provided float value is non-finite.`
			);
		}
		if (!this[PropertySymbol.attributeName]) {
			this[PropertySymbol.value] = value;
			return;
		}
		this[PropertySymbol.ownerElement].setAttribute(
			this[PropertySymbol.attributeName],
			String(value)
		);
	}

	/**
	 * Returns value as string.
	 *
	 * @returns Value as string.
	 */
	public get valueAsString(): string {
		return this.value.toString();
	}

	/**
	 * Returns value in specified units.
	 *
	 * @returns Value in specified units.
	 */
	public get valueInSpecifiedUnits(): number {
		return this.value;
	}

	/**
	 * New value specific units.
	 * @param unitType
	 */
	public newValueSpecifiedUnits(unitType: number): void {}

	/**
	 * Convert to specific units.
	 */
	public convertToSpecifiedUnits(): void {}
}
