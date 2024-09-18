import * as PropertySymbol from '../../PropertySymbol.js';
import SVGUnitTypeEnum from './SVGUnitTypeEnum.js';
import BrowserWindow from '../../window/BrowserWindow.js';

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
	public [PropertySymbol.readOnly]: boolean = false;
	public [PropertySymbol.value]: number = 0;
	public [PropertySymbol.unitType]: SVGUnitTypeEnum = SVGUnitTypeEnum.number;

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
		if (!this[PropertySymbol.getAttribute]) {
			return this[PropertySymbol.unitType];
		}

		const attributeValue = this[PropertySymbol.getAttribute]();
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
		if (!this[PropertySymbol.getAttribute]) {
			return this[PropertySymbol.value];
		}
		const attributeValue = this[PropertySymbol.getAttribute]();
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
		if (!this[PropertySymbol.getAttribute]) {
			this[PropertySymbol.value] = value;
			return;
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
		this[PropertySymbol.setAttribute](String(valueInSpecifiedUnits) + unitType);
	}

	/**
	 * Returns value as string.
	 *
	 * @returns Value as string.
	 */
	public get valueAsString(): string {
		switch (this.unitType) {
			case SVGUnitTypeEnum.number:
			case SVGUnitTypeEnum.px:
				return this.value + 'px';
			case SVGUnitTypeEnum.cm:
				return (this.value / 96) * 2.54 + 'cm';
			case SVGUnitTypeEnum.mm:
				return (this.value / 96) * 25.4 + 'mm';
			case SVGUnitTypeEnum.in:
				return this.value / 96 + 'in';
			case SVGUnitTypeEnum.pt:
				return this.value / 72 + 'pt';
			case SVGUnitTypeEnum.pc:
				return this.value / 6 + 'pc';
			case SVGUnitTypeEnum.percentage:
			case SVGUnitTypeEnum.ems:
			case SVGUnitTypeEnum.exs:
				throw new this[PropertySymbol.window].TypeError(
					`Failed to executute 'valueInSpecifiedUnits' on 'SVGLength': Could not resolve relative length.`
				);
			default:
				return this.value.toString();
		}
	}

	/**
	 * Returns value in specified units.
	 *
	 * @returns Value in specified units.
	 */
	public get valueInSpecifiedUnits(): number {
		switch (this.unitType) {
			case SVGUnitTypeEnum.number:
			case SVGUnitTypeEnum.px:
				return this.value;
			case SVGUnitTypeEnum.cm:
				return (this.value / 96) * 2.54;
			case SVGUnitTypeEnum.mm:
				return (this.value / 96) * 25.4;
			case SVGUnitTypeEnum.in:
				return this.value / 96;
			case SVGUnitTypeEnum.pt:
				return this.value / 72;
			case SVGUnitTypeEnum.pc:
				return this.value / 6;
			case SVGUnitTypeEnum.percentage:
			case SVGUnitTypeEnum.ems:
			case SVGUnitTypeEnum.exs:
				throw new this[PropertySymbol.window].TypeError(
					`Failed to executute 'valueInSpecifiedUnits' on 'SVGLength': Could not resolve relative length.`
				);
			default:
				return 0;
		}
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

		if (this[PropertySymbol.getAttribute]) {
			let unitTypeString = '';
			switch (unitType) {
				case SVGUnitTypeEnum.number:
					unitTypeString = '';
					break;
				case SVGUnitTypeEnum.px:
					unitTypeString = 'px';
					break;
				case SVGUnitTypeEnum.cm:
					unitTypeString = 'cm';
					break;
				case SVGUnitTypeEnum.mm:
					unitTypeString = 'mm';
					break;
				case SVGUnitTypeEnum.in:
					unitTypeString = 'in';
					break;
				case SVGUnitTypeEnum.pt:
					unitTypeString = 'pt';
					break;
				case SVGUnitTypeEnum.pc:
					unitTypeString = 'pc';
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
			this[PropertySymbol.setAttribute](String(value) + unitTypeString);
			return;
		}

		this[PropertySymbol.unitType] = unitType;

		switch (unitType) {
			case SVGUnitTypeEnum.number:
			case SVGUnitTypeEnum.px:
				this[PropertySymbol.value] = value;
				break;
			case SVGUnitTypeEnum.cm:
				this[PropertySymbol.value] = (value / 2.54) * 96;
				break;
			case SVGUnitTypeEnum.mm:
				this[PropertySymbol.value] = (value / 25.4) * 96;
				break;
			case SVGUnitTypeEnum.in:
				this[PropertySymbol.value] = value * 96;
				break;
			case SVGUnitTypeEnum.pt:
				this[PropertySymbol.value] = value * 72;
				break;
			case SVGUnitTypeEnum.pc:
				this[PropertySymbol.value] = value * 6;
				break;
			case SVGUnitTypeEnum.percentage:
			case SVGUnitTypeEnum.ems:
			case SVGUnitTypeEnum.exs:
				throw new this[PropertySymbol.window].TypeError(
					`Failed to executute 'newValueSpecifiedUnits' on 'SVGLength': Could not resolve relative length.`
				);
			default:
				break;
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

		if (!this[PropertySymbol.getAttribute]) {
			this[PropertySymbol.unitType] = unitType;
			return;
		}

		let value = this.value;
		let unitTypeString = '';

		switch (unitType) {
			case SVGUnitTypeEnum.number:
				unitTypeString = '';
				break;
			case SVGUnitTypeEnum.px:
				unitTypeString = 'px';
				break;
			case SVGUnitTypeEnum.cm:
				value = (value / 96) * 2.54;
				unitTypeString = 'cm';
				break;
			case SVGUnitTypeEnum.mm:
				value = (value / 96) * 25.4;
				unitTypeString = 'mm';
				break;
			case SVGUnitTypeEnum.in:
				value = value / 96;
				unitTypeString = 'in';
				break;
			case SVGUnitTypeEnum.pt:
				value = value / 72;
				unitTypeString = 'pt';
				break;
			case SVGUnitTypeEnum.pc:
				value = value / 6;
				unitTypeString = 'pc';
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

		this[PropertySymbol.setAttribute](String(value) + unitTypeString);
	}
}
