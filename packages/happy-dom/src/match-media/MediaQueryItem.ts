import CSSMeasurementConverter from '../css/declaration/measurement-converter/CSSMeasurementConverter.js';
import IBrowserWindow from '../window/IBrowserWindow.js';
import WindowBrowserSettingsReader from '../window/WindowBrowserSettingsReader.js';
import IMediaQueryRange from './IMediaQueryRange.js';
import IMediaQueryRule from './IMediaQueryRule.js';
import MediaQueryTypeEnum from './MediaQueryTypeEnum.js';

/**
 * Media query this.
 */
export default class MediaQueryItem {
	public mediaTypes: MediaQueryTypeEnum[];
	public not: boolean;
	public rules: IMediaQueryRule[];
	public ranges: IMediaQueryRange[];
	private rootFontSize: string | number | null = null;
	private ownerWindow: IBrowserWindow;

	/**
	 * Constructor.
	 *
	 * @param options Options.
	 * @param options.ownerWindow Owner window.
	 * @param [options.rootFontSize] Root font size.
	 * @param [options.mediaTypes] Media types.
	 * @param [options.not] Not.
	 * @param [options.rules] Rules.
	 * @param [options.ranges] Ranges.
	 */
	constructor(options: {
		ownerWindow: IBrowserWindow;
		rootFontSize?: string | number | null;
		mediaTypes?: MediaQueryTypeEnum[];
		not?: boolean;
		rules?: IMediaQueryRule[];
		ranges?: IMediaQueryRange[];
	}) {
		this.ownerWindow = options.ownerWindow;
		this.rootFontSize = options.rootFontSize || null;
		this.mediaTypes = options.mediaTypes || [];
		this.not = options.not || false;
		this.rules = options.rules || [];
		this.ranges = options.ranges || [];
	}

	/**
	 * Returns media string.
	 */
	public toString(): string {
		return `${this.not ? 'not ' : ''}${this.mediaTypes.join(', ')}${
			(this.not || this.mediaTypes.length > 0) && !!this.ranges.length ? ' and ' : ''
		}${this.ranges
			.map(
				(range) =>
					`(${range.before ? `${range.before.value} ${range.before.operator} ` : ''}${range.type}${
						range.after ? ` ${range.after.operator} ${range.after.value}` : ''
					})`
			)
			.join(' and ')}${
			(this.not || this.mediaTypes.length > 0) && !!this.rules.length ? ' and ' : ''
		}${this.rules
			.map((rule) => (rule.value ? `(${rule.name}: ${rule.value})` : `(${rule.name})`))
			.join(' and ')}`;
	}

	/**
	 * Returns "true" if the item matches.
	 */
	public matches(): boolean {
		return this.not ? !this.matchesAll() : this.matchesAll();
	}

	/**
	 * Returns "true" if all matches.
	 *
	 * @returns "true" if all matches.
	 */
	private matchesAll(): boolean {
		if (!!this.mediaTypes.length) {
			let isMediaTypeMatch = false;
			for (const mediaType of this.mediaTypes) {
				if (this.matchesMediaType(mediaType)) {
					isMediaTypeMatch = true;
					break;
				}
			}

			if (!isMediaTypeMatch) {
				return false;
			}
		}

		for (const rule of this.rules) {
			if (!this.matchesRule(rule)) {
				return false;
			}
		}

		for (const range of this.ranges) {
			if (!this.matchesRange(range)) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Returns "true" if the mediaType matches.
	 *
	 * @param mediaType Media type.
	 * @returns "true" if the mediaType matches.
	 */
	private matchesMediaType(mediaType: MediaQueryTypeEnum): boolean {
		if (mediaType === MediaQueryTypeEnum.all) {
			return true;
		}
		return mediaType === WindowBrowserSettingsReader.getSettings(this.ownerWindow).device.mediaType;
	}

	/**
	 * Returns "true" if the range matches.
	 *
	 * @param range Range.
	 * @returns "true" if the range matches.
	 */
	private matchesRange(range: IMediaQueryRange): boolean {
		const windowSize =
			range.type === 'width' ? this.ownerWindow.innerWidth : this.ownerWindow.innerHeight;

		if (range.before) {
			const beforeValue = this.toPixels(range.before.value);

			if (beforeValue === null) {
				return false;
			}

			switch (range.before.operator) {
				case '<':
					if (beforeValue >= windowSize) {
						return false;
					}
					break;
				case '<=':
					if (beforeValue > windowSize) {
						return false;
					}
					break;
				case '>':
					if (beforeValue <= windowSize) {
						return false;
					}
					break;
				case '>=':
					if (beforeValue < windowSize) {
						return false;
					}
					break;
			}
		}

		if (range.after) {
			const afterValue = this.toPixels(range.after.value);

			if (afterValue === null) {
				return false;
			}

			switch (range.after.operator) {
				case '<':
					if (windowSize >= afterValue) {
						return false;
					}
					break;
				case '<=':
					if (windowSize > afterValue) {
						return false;
					}
					break;
				case '>':
					if (windowSize <= afterValue) {
						return false;
					}
					break;
				case '>=':
					if (windowSize < afterValue) {
						return false;
					}
					break;
			}
		}

		return true;
	}

	/**
	 * Returns "true" if the rule matches.
	 *
	 * @param rule Rule.
	 * @returns "true" if the rule matches.
	 */
	private matchesRule(rule: IMediaQueryRule): boolean {
		if (!rule.value) {
			switch (rule.name) {
				case 'min-width':
				case 'max-width':
				case 'min-height':
				case 'max-height':
				case 'width':
				case 'height':
				case 'orientation':
				case 'prefers-color-scheme':
				case 'hover':
				case 'any-hover':
				case 'any-pointer':
				case 'pointer':
				case 'display-mode':
				case 'min-aspect-ratio':
				case 'max-aspect-ratio':
				case 'aspect-ratio':
					return true;
			}
			return false;
		}

		switch (rule.name) {
			case 'min-width':
				const minWidth = this.toPixels(rule.value);
				return minWidth !== null && this.ownerWindow.innerWidth >= minWidth;
			case 'max-width':
				const maxWidth = this.toPixels(rule.value);
				return maxWidth !== null && this.ownerWindow.innerWidth <= maxWidth;
			case 'min-height':
				const minHeight = this.toPixels(rule.value);
				return minHeight !== null && this.ownerWindow.innerHeight >= minHeight;
			case 'max-height':
				const maxHeight = this.toPixels(rule.value);
				return maxHeight !== null && this.ownerWindow.innerHeight <= maxHeight;
			case 'width':
				const width = this.toPixels(rule.value);
				return width !== null && this.ownerWindow.innerWidth === width;
			case 'height':
				const height = this.toPixels(rule.value);
				return height !== null && this.ownerWindow.innerHeight === height;
			case 'orientation':
				return rule.value === 'landscape'
					? this.ownerWindow.innerWidth > this.ownerWindow.innerHeight
					: this.ownerWindow.innerWidth < this.ownerWindow.innerHeight;
			case 'prefers-color-scheme':
				return (
					rule.value ===
					WindowBrowserSettingsReader.getSettings(this.ownerWindow).device.prefersColorScheme
				);
			case 'any-hover':
			case 'hover':
				if (rule.value === 'none') {
					return this.ownerWindow.navigator.maxTouchPoints > 0;
				}
				if (rule.value === 'hover') {
					return this.ownerWindow.navigator.maxTouchPoints === 0;
				}
				return false;
			case 'any-pointer':
			case 'pointer':
				if (rule.value === 'none') {
					return false;
				}

				if (rule.value === 'coarse') {
					return this.ownerWindow.navigator.maxTouchPoints > 0;
				}

				if (rule.value === 'fine') {
					return this.ownerWindow.navigator.maxTouchPoints === 0;
				}

				return false;
			case 'display-mode':
				return rule.value === 'browser';
			case 'min-aspect-ratio':
			case 'max-aspect-ratio':
			case 'aspect-ratio':
				const aspectRatio = rule.value.split('/');
				const aspectRatioWidth = parseInt(aspectRatio[0], 10);
				const aspectRatioHeight = parseInt(aspectRatio[1], 10);

				if (isNaN(aspectRatioWidth) || isNaN(aspectRatioHeight)) {
					return false;
				}

				switch (rule.name) {
					case 'min-aspect-ratio':
						return (
							aspectRatioWidth / aspectRatioHeight <=
							this.ownerWindow.innerWidth / this.ownerWindow.innerHeight
						);
					case 'max-aspect-ratio':
						return (
							aspectRatioWidth / aspectRatioHeight >=
							this.ownerWindow.innerWidth / this.ownerWindow.innerHeight
						);
					case 'aspect-ratio':
						return (
							aspectRatioWidth / aspectRatioHeight ===
							this.ownerWindow.innerWidth / this.ownerWindow.innerHeight
						);
				}
		}

		return false;
	}

	/**
	 * Convert to pixels.
	 *
	 * @param value Value.
	 * @returns Value in pixels.
	 */
	private toPixels(value: string): number | null {
		if (
			!WindowBrowserSettingsReader.getSettings(this.ownerWindow).disableComputedStyleRendering &&
			value.endsWith('em')
		) {
			this.rootFontSize =
				this.rootFontSize ||
				parseFloat(
					this.ownerWindow.getComputedStyle(this.ownerWindow.document.documentElement).fontSize
				);
			return CSSMeasurementConverter.toPixels({
				ownerWindow: this.ownerWindow,
				value,
				rootFontSize: this.rootFontSize,
				parentFontSize: this.rootFontSize
			});
		}
		return CSSMeasurementConverter.toPixels({
			ownerWindow: this.ownerWindow,
			value,
			rootFontSize: 16,
			parentFontSize: 16
		});
	}
}
