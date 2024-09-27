import * as PropertySymbol from '../PropertySymbol.js';
import SVGPreserveAspectRatioMeetOrSliceEnum from './SVGPreserveAspectRatioMeetOrSliceEnum.js';
import SVGPreserveAspectRatioAlignEnum from './SVGPreserveAspectRatioAlignEnum.js';
import BrowserWindow from '../window/BrowserWindow.js';

/**
 * SVG preserve aspect ratio.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGPreserveAspectRatio
 */
export default class SVGPreserveAspectRatio {
	// Static properties
	public static SVG_MEETORSLICE_UNKNOWN = SVGPreserveAspectRatioMeetOrSliceEnum.unknown;
	public static SVG_MEETORSLICE_MEET = SVGPreserveAspectRatioMeetOrSliceEnum.meet;
	public static SVG_MEETORSLICE_SLICE = SVGPreserveAspectRatioMeetOrSliceEnum.slice;
	public static SVG_PRESERVEASPECTRATIO_UNKNOWN = SVGPreserveAspectRatioAlignEnum.unknown;
	public static SVG_PRESERVEASPECTRATIO_NONE = SVGPreserveAspectRatioAlignEnum.none;
	public static SVG_PRESERVEASPECTRATIO_XMINYMIN = SVGPreserveAspectRatioAlignEnum.xMinYMin;
	public static SVG_PRESERVEASPECTRATIO_XMIDYMIN = SVGPreserveAspectRatioAlignEnum.xMidYMin;
	public static SVG_PRESERVEASPECTRATIO_XMAXYMIN = SVGPreserveAspectRatioAlignEnum.xMaxYMin;
	public static SVG_PRESERVEASPECTRATIO_XMINYMID = SVGPreserveAspectRatioAlignEnum.xMinYMid;
	public static SVG_PRESERVEASPECTRATIO_XMIDYMID = SVGPreserveAspectRatioAlignEnum.xMidYMid;
	public static SVG_PRESERVEASPECTRATIO_XMAXYMID = SVGPreserveAspectRatioAlignEnum.xMaxYMid;
	public static SVG_PRESERVEASPECTRATIO_XMINYMAX = SVGPreserveAspectRatioAlignEnum.xMinYMax;
	public static SVG_PRESERVEASPECTRATIO_XMIDYMAX = SVGPreserveAspectRatioAlignEnum.xMidYMax;
	public static SVG_PRESERVEASPECTRATIO_XMAXYMAX = SVGPreserveAspectRatioAlignEnum.xMaxYMax;

	// Internal properties
	public [PropertySymbol.window]: BrowserWindow;
	public [PropertySymbol.getAttribute]: () => string | null = null;
	public [PropertySymbol.setAttribute]: (value: string) => void | null = null;
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
	 * Returns align.
	 *
	 * @returns Align.
	 */
	public get align(): SVGPreserveAspectRatioAlignEnum {
		const attributeValue = this[PropertySymbol.getAttribute]();

		if (!attributeValue) {
			return SVGPreserveAspectRatioAlignEnum.xMidYMid;
		}

		const align = attributeValue.split(/\s+/)[0];

		if (SVGPreserveAspectRatioAlignEnum[align] === undefined) {
			return SVGPreserveAspectRatioAlignEnum.xMidYMid;
		}

		return SVGPreserveAspectRatioAlignEnum[align];
	}

	/**
	 * Sets align.
	 *
	 * @param value Align.
	 */
	public set align(value: SVGPreserveAspectRatioAlignEnum) {
		if (this[PropertySymbol.readOnly]) {
			throw new this[PropertySymbol.window].TypeError(
				`Failed to set the 'align' property on 'SVGPreserveAspectRatio': The object is read-only.`
			);
		}

		const parsedValue = Number(value);

		if (isNaN(parsedValue) || parsedValue < 1 || parsedValue > 10) {
			throw new this[PropertySymbol.window].TypeError(
				`Failed to set the 'align' property on 'SVGPreserveAspectRatio': The alignment provided is invalid.`
			);
		}

		this[PropertySymbol.setAttribute](
			`${Object.keys(SVGPreserveAspectRatioAlignEnum)[parsedValue]} ${
				Object.keys(SVGPreserveAspectRatioMeetOrSliceEnum)[this.meetOrSlice]
			}`
		);
	}

	/**
	 * Returns meet or slice.
	 *
	 * @returns Meet or slice.
	 */
	public get meetOrSlice(): SVGPreserveAspectRatioMeetOrSliceEnum {
		const attributeValue = this[PropertySymbol.getAttribute]();

		if (!attributeValue) {
			return SVGPreserveAspectRatioMeetOrSliceEnum.meet;
		}

		const meetOrSlice = attributeValue.split(/\s+/)[1];

		if (SVGPreserveAspectRatioMeetOrSliceEnum[meetOrSlice] === undefined) {
			return SVGPreserveAspectRatioMeetOrSliceEnum.meet;
		}

		return SVGPreserveAspectRatioMeetOrSliceEnum[meetOrSlice];
	}

	/**
	 * Sets meet or slice.
	 *
	 * @param value Meet or slice.
	 */
	public set meetOrSlice(value: SVGPreserveAspectRatioMeetOrSliceEnum) {
		if (this[PropertySymbol.readOnly]) {
			throw new this[PropertySymbol.window].TypeError(
				`Failed to set the 'meetOrSlice' property on 'SVGPreserveAspectRatio': The object is read-only.`
			);
		}

		const parsedValue = Number(value);

		if (isNaN(parsedValue) || parsedValue < 1 || parsedValue > 2) {
			throw new this[PropertySymbol.window].TypeError(
				`Failed to set the 'meetOrSlice' property on 'SVGPreserveAspectRatio': The meetOrSlice provided is invalid.`
			);
		}

		this[PropertySymbol.setAttribute](
			`${Object.keys(SVGPreserveAspectRatioAlignEnum)[this.align]} ${
				Object.keys(SVGPreserveAspectRatioMeetOrSliceEnum)[parsedValue]
			}`
		);
	}
}
