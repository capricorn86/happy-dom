import * as PropertySymbol from '../PropertySymbol.js';
import SVGUnitTypeEnum from './SVGUnitTypeEnum.js';
import BrowserWindow from '../window/BrowserWindow.js';

const ATTRIBUTE_REGEXP = /^(\d+|\d+\.\d+)(px|em|ex|cm|mm|in|pt|pc|%|)$/;

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
	public static SVG_LENGTHTYPE_EMS = SVGUnitTypeEnum.ems;
	public static SVG_LENGTHTYPE_EXS = SVGUnitTypeEnum.exs;
	public static SVG_LENGTHTYPE_PX = SVGUnitTypeEnum.px;
	public static SVG_LENGTHTYPE_CM = SVGUnitTypeEnum.cm;
	public static SVG_LENGTHTYPE_MM = SVGUnitTypeEnum.mm;
	public static SVG_LENGTHTYPE_IN = SVGUnitTypeEnum.in;
	public static SVG_LENGTHTYPE_PT = SVGUnitTypeEnum.pt;
	public static SVG_LENGTHTYPE_PC = SVGUnitTypeEnum.pc;

	// Internal properties
	public [PropertySymbol.window]: BrowserWindow;
	public [PropertySymbol.getAttribute]: () => string | null = null;
	public [PropertySymbol.setAttribute]: (value: string) => void | null = null;
	public [PropertySymbol.attributeValue]: string | null = null;
	public [PropertySymbol.readOnly]: boolean = false;

	/**
	 * Constructor.
	 *
	 * @param illegalConstructorSymbol Illegal constructor symbol.
	 * @param window Window.
	 * @param [options] Options.
	 * @param [options.readOnly] Read only.
	 * @param [options.getAttribute] Get attribute.
	 * @param [options.setAttribute] Set attribute.
	 */
	constructor(
		illegalConstructorSymbol: symbol,
		window: BrowserWindow,
		options?: {
			readOnly?: boolean;
			getAttribute?: () => string | null;
			setAttribute?: (value: string) => void;
		}
	) {
		if (illegalConstructorSymbol !== PropertySymbol.illegalConstructor) {
			throw new TypeError('Illegal constructor');
		}

		this[PropertySymbol.window] = window;

		if (options) {
			this[PropertySymbol.readOnly] = !!options.readOnly;
			this[PropertySymbol.getAttribute] = options.getAttribute || null;
			this[PropertySymbol.setAttribute] = options.setAttribute || null;
		}
	}

	/**
	 * Returns unit type.
	 *
	 * @returns Unit type.
	 */
	public get unitType(): SVGUnitTypeEnum {
		const attributeValue = this[PropertySymbol.getAttribute]
			? this[PropertySymbol.getAttribute]()
			: this[PropertySymbol.attributeValue];
		const match = attributeValue.match(ATTRIBUTE_REGEXP);

		if (!match) {
			return SVGUnitTypeEnum.unknown;
		}

		if (isNaN(parseFloat(match[1]))) {
			return SVGUnitTypeEnum.unknown;
		}

		switch (match[2]) {
			case '':
				return SVGUnitTypeEnum.number;
			case 'px':
				return SVGUnitTypeEnum.px;
			case 'cm':
				return SVGUnitTypeEnum.cm;
			case 'mm':
				return SVGUnitTypeEnum.mm;
			case 'in':
				return SVGUnitTypeEnum.in;
			case 'pt':
				return SVGUnitTypeEnum.pt;
			case 'pc':
				return SVGUnitTypeEnum.pc;
			case 'em':
			case 'ex':
			case '%':
				throw new this[PropertySymbol.window].TypeError(
					`Failed to execute 'value' on 'SVGLength': Could not resolve relative length.`
				);
			default:
				return SVGUnitTypeEnum.unknown;
		}
	}

	/**
	 * Returns value.
	 *
	 * @returns Value.
	 */
	public get value(): number {
		const attributeValue = this[PropertySymbol.getAttribute]
			? this[PropertySymbol.getAttribute]()
			: this[PropertySymbol.attributeValue];
		const match = attributeValue.match(ATTRIBUTE_REGEXP);

		if (!match) {
			return 0;
		}

		const parsedValue = parseFloat(match[1]);

		if (isNaN(parsedValue)) {
			return 0;
		}

		switch (match[2]) {
			case '':
				return parsedValue;
			case 'px':
				return parsedValue;
			case 'cm':
				return (parsedValue / 2.54) * 96;
			case 'mm':
				return (parsedValue / 25.4) * 96;
			case 'in':
				return parsedValue * 96;
			case 'pt':
				return parsedValue * 72;
			case 'pc':
				return parsedValue * 6;
			case 'em':
			case 'ex':
			case '%':
				throw new this[PropertySymbol.window].TypeError(
					`Failed to execute 'value' on 'SVGLength': Could not resolve relative length.`
				);
			default:
				return 0;
		}
	}

	/**
	 * Sets value.
	 *
	 * @param value Value in pixels.
	 */
	public set value(value: number) {
		if (this[PropertySymbol.readOnly]) {
			throw new this[PropertySymbol.window].TypeError(
				`Failed to set the 'value' property on 'SVGLength': The object is read-only.`
			);
		}

		// Value in pixels
		value = typeof value !== 'number' ? parseFloat(String(value)) : value;
		if (isNaN(value)) {
			throw new this[PropertySymbol.window].TypeError(
				`Failed to set the 'value' property on 'SVGLength': The provided float value is non-finite.`
			);
		}
		let unitType = '';
		let valueInSpecifiedUnits = value;
		switch (this.unitType) {
			case SVGUnitTypeEnum.number:
				valueInSpecifiedUnits = value;
				unitType = '';
				break;
			case SVGUnitTypeEnum.px:
				valueInSpecifiedUnits = value;
				unitType = 'px';
				break;
			case SVGUnitTypeEnum.cm:
				valueInSpecifiedUnits = (value / 96) * 2.54;
				unitType = 'cm';
				break;
			case SVGUnitTypeEnum.mm:
				valueInSpecifiedUnits = (value / 96) * 25.4;
				unitType = 'mm';
				break;
			case SVGUnitTypeEnum.in:
				valueInSpecifiedUnits = value / 96;
				unitType = 'in';
				break;
			case SVGUnitTypeEnum.pt:
				valueInSpecifiedUnits = value / 72;
				unitType = 'pt';
				break;
			case SVGUnitTypeEnum.pc:
				valueInSpecifiedUnits = value / 6;
				unitType = 'pc';
				break;
			case SVGUnitTypeEnum.percentage:
			case SVGUnitTypeEnum.ems:
			case SVGUnitTypeEnum.exs:
				throw new this[PropertySymbol.window].TypeError(
					`Failed to set the 'value' property on 'SVGLength': Could not resolve relative length.`
				);
			default:
				break;
		}

		this[PropertySymbol.attributeValue] = String(valueInSpecifiedUnits) + unitType;

		if (this[PropertySymbol.setAttribute]) {
			this[PropertySymbol.setAttribute](this[PropertySymbol.attributeValue]);
		}
	}

	/**
	 * Returns value as string.
	 *
	 * @returns Value as string.
	 */
	public get valueAsString(): string {
		return this[PropertySymbol.getAttribute]
			? this[PropertySymbol.getAttribute]() || '0'
			: this[PropertySymbol.attributeValue] || '0';
	}

	/**
	 * Returns value in specified units.
	 *
	 * @returns Value in specified units.
	 */
	public get valueInSpecifiedUnits(): number {
		const attributeValue = this.valueAsString;
		return parseFloat(attributeValue) || 0;
	}

	/**
	 * New value specific units.
	 *
	 * @param unitType
	 * @param value
	 */
	public newValueSpecifiedUnits(unitType: number, value: number): void {
		if (this[PropertySymbol.readOnly]) {
			throw new this[PropertySymbol.window].TypeError(
				`Failed to execute 'newValueSpecifiedUnits' on 'SVGLength': The object is read-only.`
			);
		}

		if (typeof unitType !== 'number') {
			throw new this[PropertySymbol.window].TypeError(
				`Failed to execute 'newValueSpecifiedUnits' on 'SVGLength': parameter 1 ('unitType') is not of type 'number'.`
			);
		}

		value = typeof value !== 'number' ? parseFloat(String(value)) : value;

		if (isNaN(value)) {
			throw new this[PropertySymbol.window].TypeError(
				`Failed to execute 'newValueSpecifiedUnits' on 'SVGLength': The provided float value is non-finite.`
			);
		}

		let unit = '';
		switch (unitType) {
			case SVGUnitTypeEnum.number:
				unit = '';
				break;
			case SVGUnitTypeEnum.px:
				unit = 'px';
				break;
			case SVGUnitTypeEnum.cm:
				unit = 'cm';
				break;
			case SVGUnitTypeEnum.mm:
				unit = 'mm';
				break;
			case SVGUnitTypeEnum.in:
				unit = 'in';
				break;
			case SVGUnitTypeEnum.pt:
				unit = 'pt';
				break;
			case SVGUnitTypeEnum.pc:
				unit = 'pc';
				break;
			case SVGUnitTypeEnum.ems:
			case SVGUnitTypeEnum.exs:
			case SVGUnitTypeEnum.percentage:
				throw new this[PropertySymbol.window].TypeError(
					`Failed to executute 'newValueSpecifiedUnits' on 'SVGLength': Could not resolve relative length.`
				);
			default:
				break;
		}

		this[PropertySymbol.attributeValue] = String(value) + unit;

		if (this[PropertySymbol.setAttribute]) {
			this[PropertySymbol.setAttribute](this[PropertySymbol.attributeValue]);
		}
	}

	/**
	 * Convert to specific units.
	 * @param unitType
	 */
	public convertToSpecifiedUnits(unitType: SVGUnitTypeEnum): void {
		if (this[PropertySymbol.readOnly]) {
			throw new this[PropertySymbol.window].TypeError(
				`Failed to execute 'convertToSpecifiedUnits' on 'SVGLength': The object is read-only.`
			);
		}

		if (typeof unitType !== 'number') {
			throw new this[PropertySymbol.window].TypeError(
				`Failed to execute 'convertToSpecifiedUnits' on 'SVGLength': parameter 1 ('unitType') is not of type 'number'.`
			);
		}

		let value = this.value;
		let unit = '';

		switch (unitType) {
			case SVGUnitTypeEnum.number:
				unit = '';
				break;
			case SVGUnitTypeEnum.px:
				unit = 'px';
				break;
			case SVGUnitTypeEnum.cm:
				value = (value / 96) * 2.54;
				unit = 'cm';
				break;
			case SVGUnitTypeEnum.mm:
				value = (value / 96) * 25.4;
				unit = 'mm';
				break;
			case SVGUnitTypeEnum.in:
				value = value / 96;
				unit = 'in';
				break;
			case SVGUnitTypeEnum.pt:
				value = value / 72;
				unit = 'pt';
				break;
			case SVGUnitTypeEnum.pc:
				value = value / 6;
				unit = 'pc';
				break;
			case SVGUnitTypeEnum.percentage:
			case SVGUnitTypeEnum.ems:
			case SVGUnitTypeEnum.exs:
				throw new this[PropertySymbol.window].TypeError(
					`Failed to executute 'convertToSpecifiedUnits' on 'SVGLength': Could not resolve relative length.`
				);
			default:
				break;
		}

		this[PropertySymbol.attributeValue] = String(value) + unit;

		if (this[PropertySymbol.setAttribute]) {
			this[PropertySymbol.setAttribute](this[PropertySymbol.attributeValue]);
		}
	}
}
