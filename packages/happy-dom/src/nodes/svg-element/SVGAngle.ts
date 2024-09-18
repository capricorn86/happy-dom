import SVGAngleTypeEnum from './SVGAngleTypeEnum.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import BrowserWindow from '../../window/BrowserWindow.js';

const ATTRIBUTE_REGEXP = /^(\d+|\d+\.\d+)(deg|rad|grad|turn|)$/;

/**
 * SVG angle.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGAngle
 */
export default class SVGAngle {
	// Static properties
	public static SVG_ANGLETYPE_UNKNOWN = SVGAngleTypeEnum.unknown;
	public static SVG_ANGLETYPE_UNSPECIFIED = SVGAngleTypeEnum.unspecified;
	public static SVG_ANGLETYPE_DEG = SVGAngleTypeEnum.deg;
	public static SVG_ANGLETYPE_RAD = SVGAngleTypeEnum.rad;
	public static SVG_ANGLETYPE_GRAD = SVGAngleTypeEnum.grad;

	// Internal properties
	public [PropertySymbol.window]: BrowserWindow;
	public [PropertySymbol.getAttribute]: () => string | null = null;
	public [PropertySymbol.setAttribute]: (value: string) => void | null = null;
	public [PropertySymbol.readOnly]: boolean = false;
	public [PropertySymbol.value]: number = 0;
	public [PropertySymbol.unitType]: SVGAngleTypeEnum = SVGAngleTypeEnum.unspecified;

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
	public get unitType(): SVGAngleTypeEnum {
		if (!this[PropertySymbol.getAttribute]) {
			return this[PropertySymbol.unitType];
		}

		const attributeValue = this[PropertySymbol.getAttribute]();
		const match = attributeValue.match(ATTRIBUTE_REGEXP);

		if (!match) {
			return SVGAngleTypeEnum.unknown;
		}

		if (isNaN(parseFloat(match[1]))) {
			return SVGAngleTypeEnum.unknown;
		}

		switch (match[2]) {
			case '':
				return SVGAngleTypeEnum.unspecified;
			case 'deg':
				return SVGAngleTypeEnum.deg;
			case 'rad':
				return SVGAngleTypeEnum.rad;
			case 'grad':
				return SVGAngleTypeEnum.grad;
			case 'turn':
				return SVGAngleTypeEnum.unknown;
			default:
				return SVGAngleTypeEnum.unspecified;
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
			case 'deg':
				return parsedValue;
			case 'rad':
				return parsedValue * (180 / Math.PI);
			case 'grad':
				return parsedValue * (180 / 200);
			case 'turn':
				return parsedValue * 360;
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
				`Failed to set the 'value' property on 'SVGAngle': The object is read-only.`
			);
		}

		// Value in pixels
		value = typeof value !== 'number' ? parseFloat(String(value)) : value;
		if (isNaN(value)) {
			throw new this[PropertySymbol.window].TypeError(
				`Failed to set the 'value' property on 'SVGAngle': The provided float value is non-finite.`
			);
		}
		if (!this[PropertySymbol.getAttribute]) {
			this[PropertySymbol.value] = value;
			return;
		}

		let unitType = '';
		let valueInSpecifiedUnits = value;

		switch (this.unitType) {
			case SVGAngleTypeEnum.unspecified:
				valueInSpecifiedUnits = value;
				unitType = '';
				break;
			case SVGAngleTypeEnum.deg:
				valueInSpecifiedUnits = value;
				unitType = 'deg';
				break;
			case SVGAngleTypeEnum.rad:
				valueInSpecifiedUnits = value / (180 / Math.PI);
				unitType = 'rad';
				break;
			case SVGAngleTypeEnum.grad:
				valueInSpecifiedUnits = value / (180 / 200);
				unitType = 'grad';
				break;
			case SVGAngleTypeEnum.unknown:
				valueInSpecifiedUnits = value / 360;
				unitType = 'turn';
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
		return this.value.toString() + this.unitType;
	}

	/**
	 * Returns value in specified units.
	 *
	 * @returns Value in specified units.
	 */
	public get valueInSpecifiedUnits(): number {
		switch (this.unitType) {
			case SVGAngleTypeEnum.unspecified:
				return this.value;
			case SVGAngleTypeEnum.deg:
				return this.value;
			case SVGAngleTypeEnum.rad:
				return this.value / (180 / Math.PI);
			case SVGAngleTypeEnum.grad:
				return this.value / (180 / 200);
			case SVGAngleTypeEnum.unknown:
				return this.value / 360;
			default:
				return 0;
		}
	}

	/**
	 * New value specific units.
	 * @param unitType
	 * @param value
	 */
	public newValueSpecifiedUnits(unitType: number, value: number): void {
		if (this[PropertySymbol.readOnly]) {
			throw new this[PropertySymbol.window].TypeError(
				`Failed to execute 'newValueSpecifiedUnits' on 'SVGAngle': The object is read-only.`
			);
		}

		if (typeof unitType !== 'number') {
			throw new this[PropertySymbol.window].TypeError(
				`Failed to execute 'newValueSpecifiedUnits' on 'SVGAngle': parameter 1 ('unitType') is not of type 'number'.`
			);
		}

		value = typeof value !== 'number' ? parseFloat(String(value)) : value;

		if (isNaN(value)) {
			throw new this[PropertySymbol.window].TypeError(
				`Failed to execute 'newValueSpecifiedUnits' on 'SVGAngle': The provided float value is non-finite.`
			);
		}

		if (this[PropertySymbol.getAttribute]) {
			let unitTypeString = '';
			switch (unitType) {
				case SVGAngleTypeEnum.unspecified:
					unitTypeString = '';
					break;
				case SVGAngleTypeEnum.deg:
					unitTypeString = 'deg';
					break;
				case SVGAngleTypeEnum.rad:
					unitTypeString = 'rad';
					value = value / (180 / Math.PI);
					break;
				case SVGAngleTypeEnum.grad:
					unitTypeString = 'grad';
					value = value / (180 / 200);
					break;
				case SVGAngleTypeEnum.unknown:
					unitTypeString = 'turn';
					value = value / 360;
					break;
				default:
					break;
			}
			this[PropertySymbol.setAttribute](String(value) + unitTypeString);
			return;
		}

		this[PropertySymbol.unitType] = unitType;

		switch (unitType) {
			case SVGAngleTypeEnum.unspecified:
				this[PropertySymbol.value] = value;
				break;
			case SVGAngleTypeEnum.deg:
				this[PropertySymbol.value] = value;
				break;
			case SVGAngleTypeEnum.rad:
				this[PropertySymbol.value] = value * (180 / Math.PI);
				break;
			case SVGAngleTypeEnum.grad:
				this[PropertySymbol.value] = value * (180 / 200);
				break;
			case SVGAngleTypeEnum.unknown:
				this[PropertySymbol.value] = value * 360;
				break;
			default:
				break;
		}
	}

	/**
	 * Convert to specific units.
	 * @param unitType
	 */
	public convertToSpecifiedUnits(unitType: SVGAngleTypeEnum): void {
		if (this[PropertySymbol.readOnly]) {
			throw new this[PropertySymbol.window].TypeError(
				`Failed to execute 'convertToSpecifiedUnits' on 'SVGAngle': The object is read-only.`
			);
		}

		if (typeof unitType !== 'number') {
			throw new this[PropertySymbol.window].TypeError(
				`Failed to execute 'convertToSpecifiedUnits' on 'SVGAngle': parameter 1 ('unitType') is not of type 'number'.`
			);
		}

		if (!this[PropertySymbol.getAttribute]) {
			this[PropertySymbol.unitType] = unitType;
			return;
		}

		let value = this.value;
		let unitTypeString = '';

		switch (unitType) {
			case SVGAngleTypeEnum.unspecified:
				unitTypeString = '';
				break;
			case SVGAngleTypeEnum.deg:
				unitTypeString = 'deg';
				break;
			case SVGAngleTypeEnum.rad:
				unitTypeString = 'rad';
				value = value / (180 / Math.PI);
				break;
			case SVGAngleTypeEnum.grad:
				unitTypeString = 'grad';
				value = value / (180 / 200);
				break;
			case SVGAngleTypeEnum.unknown:
				unitTypeString = 'turn';
				value = value / 360;
				break;
			default:
				break;
		}

		this[PropertySymbol.setAttribute](String(value) + unitTypeString);
	}
}
