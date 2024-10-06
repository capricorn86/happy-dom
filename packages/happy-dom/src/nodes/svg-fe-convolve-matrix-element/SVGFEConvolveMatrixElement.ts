import SVGElement from '../svg-element/SVGElement.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import SVGAnimatedLength from '../../svg/SVGAnimatedLength.js';
import SVGAnimatedEnumeration from '../../svg/SVGAnimatedEnumeration.js';
import SVGAnimatedString from '../../svg/SVGAnimatedString.js';
import SVGAnimatedNumberList from '../../svg/SVGAnimatedNumberList.js';
import SVGAnimatedNumber from '../../svg/SVGAnimatedNumber.js';
import SVGAnimatedBoolean from '../../svg/SVGAnimatedBoolean.js';
import SVGAnimatedInteger from '../../svg/SVGAnimatedInteger.js';

/**
 * SVGFEConvolveMatrixElement.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGFEConvolveMatrixElement
 */
export default class SVGFEConvolveMatrixElement extends SVGElement {
	// Static properties
	public static SVG_EDGEMODE_UNKNOWN = 0;
	public static SVG_EDGEMODE_DUPLICATE = 1;
	public static SVG_EDGEMODE_WRAP = 2;
	public static SVG_EDGEMODE_NONE = 3;

	// Internal properties
	public [PropertySymbol.bias]: SVGAnimatedNumber | null = null;
	public [PropertySymbol.divisor]: SVGAnimatedNumber | null = null;
	public [PropertySymbol.edgeMode]: SVGAnimatedEnumeration | null = null;
	public [PropertySymbol.height]: SVGAnimatedLength | null = null;
	public [PropertySymbol.in1]: SVGAnimatedString | null = null;
	public [PropertySymbol.kernelMatrix]: SVGAnimatedNumberList | null = null;
	public [PropertySymbol.kernelUnitLengthX]: SVGAnimatedNumber | null = null;
	public [PropertySymbol.kernelUnitLengthY]: SVGAnimatedNumber | null = null;
	public [PropertySymbol.orderX]: SVGAnimatedInteger | null = null;
	public [PropertySymbol.orderY]: SVGAnimatedInteger | null = null;
	public [PropertySymbol.preserveAlpha]: SVGAnimatedBoolean | null = null;
	public [PropertySymbol.result]: SVGAnimatedString | null = null;
	public [PropertySymbol.targetX]: SVGAnimatedInteger | null = null;
	public [PropertySymbol.targetY]: SVGAnimatedInteger | null = null;
	public [PropertySymbol.width]: SVGAnimatedLength | null = null;
	public [PropertySymbol.x]: SVGAnimatedLength | null = null;
	public [PropertySymbol.y]: SVGAnimatedLength | null = null;

	/**
	 * Returns bias.
	 *
	 * @returns Bias.
	 */
	public get bias(): SVGAnimatedNumber {
		if (!this[PropertySymbol.bias]) {
			this[PropertySymbol.bias] = new SVGAnimatedNumber(
				PropertySymbol.illegalConstructor,
				this[PropertySymbol.window],
				{
					getAttribute: () => this.getAttribute('bias'),
					setAttribute: (value) =>
						value ? this.setAttribute('bias', value) : this.removeAttribute('bias')
				}
			);
		}
		return this[PropertySymbol.bias];
	}

	/**
	 * Returns divisor.
	 *
	 * @returns Divisor.
	 */
	public get divisor(): SVGAnimatedNumber {
		if (!this[PropertySymbol.divisor]) {
			this[PropertySymbol.divisor] = new SVGAnimatedNumber(
				PropertySymbol.illegalConstructor,
				this[PropertySymbol.window],
				{
					getAttribute: () => this.getAttribute('divisor'),
					setAttribute: (value) =>
						value ? this.setAttribute('divisor', value) : this.removeAttribute('divisor')
				}
			);
		}
		return this[PropertySymbol.divisor];
	}

	/**
	 * Returns edge mode.
	 *
	 * @returns Edge mode.
	 */
	public get edgeMode(): SVGAnimatedEnumeration {
		if (!this[PropertySymbol.edgeMode]) {
			this[PropertySymbol.edgeMode] = new SVGAnimatedEnumeration(
				PropertySymbol.illegalConstructor,
				this[PropertySymbol.window],
				{
					getAttribute: () => this.getAttribute('edgeMode'),
					setAttribute: (value) =>
						value ? this.setAttribute('edgeMode', value) : this.removeAttribute('edgeMode'),
					values: ['duplicate', 'wrap', 'none'],
					defaultValue: 'duplicate'
				}
			);
		}
		return this[PropertySymbol.edgeMode];
	}

	/**
	 * Returns height.
	 *
	 * @returns Height.
	 */
	public get height(): SVGAnimatedLength {
		if (!this[PropertySymbol.height]) {
			this[PropertySymbol.height] = new SVGAnimatedLength(
				PropertySymbol.illegalConstructor,
				this[PropertySymbol.window],
				{
					getAttribute: () => this.getAttribute('height'),
					setAttribute: (value) =>
						value ? this.setAttribute('height', value) : this.removeAttribute('height')
				}
			);
		}
		return this[PropertySymbol.height];
	}

	/**
	 * Returns in1.
	 *
	 * @returns In1.
	 */
	public get in1(): SVGAnimatedString {
		if (!this[PropertySymbol.in1]) {
			this[PropertySymbol.in1] = new SVGAnimatedString(
				PropertySymbol.illegalConstructor,
				this[PropertySymbol.window],
				{
					getAttribute: () => this.getAttribute('in'),
					setAttribute: (value) =>
						value ? this.setAttribute('in', value) : this.removeAttribute('in')
				}
			);
		}
		return this[PropertySymbol.in1];
	}

	/**
	 * Returns kernel matrix.
	 *
	 * @returns Kernel matrix.
	 */
	public get kernelMatrix(): SVGAnimatedNumberList {
		if (!this[PropertySymbol.kernelMatrix]) {
			this[PropertySymbol.kernelMatrix] = new SVGAnimatedNumberList(
				PropertySymbol.illegalConstructor,
				this[PropertySymbol.window],
				{
					getAttribute: () => this.getAttribute('kernelMatrix'),
					setAttribute: (value) =>
						value ? this.setAttribute('kernelMatrix', value) : this.removeAttribute('kernelMatrix')
				}
			);
		}
		return this[PropertySymbol.kernelMatrix];
	}

	/**
	 * Returns kernel unit length x.
	 *
	 * @returns Kernel unit length x.
	 */
	public get kernelUnitLengthX(): SVGAnimatedNumber {
		if (!this[PropertySymbol.kernelUnitLengthX]) {
			this[PropertySymbol.kernelUnitLengthX] = new SVGAnimatedNumber(
				PropertySymbol.illegalConstructor,
				this[PropertySymbol.window],
				{
					getAttribute: () => this.getAttribute('kernelUnitLengthX'),
					setAttribute: (value) =>
						value
							? this.setAttribute('kernelUnitLengthX', value)
							: this.removeAttribute('kernelUnitLengthX')
				}
			);
		}
		return this[PropertySymbol.kernelUnitLengthX];
	}

	/**
	 * Returns kernel unit length y.
	 *
	 * @returns Kernel unit length y.
	 */
	public get kernelUnitLengthY(): SVGAnimatedNumber {
		if (!this[PropertySymbol.kernelUnitLengthY]) {
			this[PropertySymbol.kernelUnitLengthY] = new SVGAnimatedNumber(
				PropertySymbol.illegalConstructor,
				this[PropertySymbol.window],
				{
					getAttribute: () => this.getAttribute('kernelUnitLengthY'),
					setAttribute: (value) =>
						value
							? this.setAttribute('kernelUnitLengthY', value)
							: this.removeAttribute('kernelUnitLengthY')
				}
			);
		}
		return this[PropertySymbol.kernelUnitLengthY];
	}

	/**
	 * Returns order x.
	 *
	 * @returns Order x.
	 */
	public get orderX(): SVGAnimatedInteger {
		if (!this[PropertySymbol.orderX]) {
			this[PropertySymbol.orderX] = new SVGAnimatedInteger(
				PropertySymbol.illegalConstructor,
				this[PropertySymbol.window],
				{
					getAttribute: () => this.getAttribute('orderX'),
					setAttribute: (value) =>
						value ? this.setAttribute('orderX', value) : this.removeAttribute('orderX')
				}
			);
		}
		return this[PropertySymbol.orderX];
	}

	/**
	 * Returns order y.
	 *
	 * @returns Order y.
	 */
	public get orderY(): SVGAnimatedInteger {
		if (!this[PropertySymbol.orderY]) {
			this[PropertySymbol.orderY] = new SVGAnimatedInteger(
				PropertySymbol.illegalConstructor,
				this[PropertySymbol.window],
				{
					getAttribute: () => this.getAttribute('orderY'),
					setAttribute: (value) =>
						value ? this.setAttribute('orderY', value) : this.removeAttribute('orderY')
				}
			);
		}
		return this[PropertySymbol.orderY];
	}

	/**
	 * Returns preserve alpha.
	 *
	 * @returns Preserve alpha.
	 */
	public get preserveAlpha(): SVGAnimatedBoolean {
		if (!this[PropertySymbol.preserveAlpha]) {
			this[PropertySymbol.preserveAlpha] = new SVGAnimatedBoolean(
				PropertySymbol.illegalConstructor,
				this[PropertySymbol.window],
				{
					getAttribute: () => this.getAttribute('preserveAlpha'),
					setAttribute: (value) =>
						value
							? this.setAttribute('preserveAlpha', value)
							: this.removeAttribute('preserveAlpha')
				}
			);
		}
		return this[PropertySymbol.preserveAlpha];
	}

	/**
	 * Returns result.
	 *
	 * @returns Result.
	 */
	public get result(): SVGAnimatedString {
		if (!this[PropertySymbol.result]) {
			this[PropertySymbol.result] = new SVGAnimatedString(
				PropertySymbol.illegalConstructor,
				this[PropertySymbol.window],
				{
					getAttribute: () => this.getAttribute('result'),
					setAttribute: (value) =>
						value ? this.setAttribute('result', value) : this.removeAttribute('result')
				}
			);
		}
		return this[PropertySymbol.result];
	}

	/**
	 * Returns target x.
	 *
	 * @returns Target x.
	 */
	public get targetX(): SVGAnimatedInteger {
		if (!this[PropertySymbol.targetX]) {
			this[PropertySymbol.targetX] = new SVGAnimatedInteger(
				PropertySymbol.illegalConstructor,
				this[PropertySymbol.window],
				{
					getAttribute: () => this.getAttribute('targetX'),
					setAttribute: (value) =>
						value ? this.setAttribute('targetX', value) : this.removeAttribute('targetX')
				}
			);
		}
		return this[PropertySymbol.targetX];
	}

	/**
	 * Returns target y.
	 *
	 * @returns Target y.
	 */
	public get targetY(): SVGAnimatedInteger {
		if (!this[PropertySymbol.targetY]) {
			this[PropertySymbol.targetY] = new SVGAnimatedInteger(
				PropertySymbol.illegalConstructor,
				this[PropertySymbol.window],
				{
					getAttribute: () => this.getAttribute('targetY'),
					setAttribute: (value) =>
						value ? this.setAttribute('targetY', value) : this.removeAttribute('targetY')
				}
			);
		}
		return this[PropertySymbol.targetY];
	}

	/**
	 * Returns type.
	 *
	 * @returns Type.
	 */
	public get type(): SVGAnimatedEnumeration {
		if (!this[PropertySymbol.type]) {
			this[PropertySymbol.type] = new SVGAnimatedEnumeration(
				PropertySymbol.illegalConstructor,
				this[PropertySymbol.window],
				{
					getAttribute: () => this.getAttribute('type'),
					setAttribute: (value) =>
						value ? this.setAttribute('type', value) : this.removeAttribute('type'),
					values: ['matrix', 'saturate', 'huerotate', 'luminancetoalpha'],
					defaultValue: 'matrix'
				}
			);
		}
		return this[PropertySymbol.type];
	}

	/**
	 * Returns values.
	 *
	 * @returns Values.
	 */
	public get values(): SVGAnimatedNumberList {
		if (!this[PropertySymbol.values]) {
			this[PropertySymbol.values] = new SVGAnimatedNumberList(
				PropertySymbol.illegalConstructor,
				this[PropertySymbol.window],
				{
					getAttribute: () => this.getAttribute('values'),
					setAttribute: (value) =>
						value ? this.setAttribute('values', value) : this.removeAttribute('values')
				}
			);
		}
		return this[PropertySymbol.values];
	}

	/**
	 * Returns width.
	 *
	 * @returns Width.
	 */
	public get width(): SVGAnimatedLength {
		if (!this[PropertySymbol.width]) {
			this[PropertySymbol.width] = new SVGAnimatedLength(
				PropertySymbol.illegalConstructor,
				this[PropertySymbol.window],
				{
					getAttribute: () => this.getAttribute('width'),
					setAttribute: (value) =>
						value ? this.setAttribute('width', value) : this.removeAttribute('width')
				}
			);
		}
		return this[PropertySymbol.width];
	}

	/**
	 * Returns x position.
	 *
	 * @returns X position.
	 */
	public get x(): SVGAnimatedLength {
		if (!this[PropertySymbol.x]) {
			this[PropertySymbol.x] = new SVGAnimatedLength(
				PropertySymbol.illegalConstructor,
				this[PropertySymbol.window],
				{
					getAttribute: () => this.getAttribute('x'),
					setAttribute: (value) =>
						value ? this.setAttribute('x', value) : this.removeAttribute('x')
				}
			);
		}
		return this[PropertySymbol.x];
	}

	/**
	 * Returns y position.
	 *
	 * @returns Y position.
	 */
	public get y(): SVGAnimatedLength {
		if (!this[PropertySymbol.y]) {
			this[PropertySymbol.y] = new SVGAnimatedLength(
				PropertySymbol.illegalConstructor,
				this[PropertySymbol.window],
				{
					getAttribute: () => this.getAttribute('y'),
					setAttribute: (value) =>
						value ? this.setAttribute('y', value) : this.removeAttribute('y')
				}
			);
		}
		return this[PropertySymbol.y];
	}
}
