import IWindow from '../window/IWindow';
import IMediaQueryRange from './IMediaQueryRange';
import IMediaQueryRule from './IMediaQueryRule';
import MediaQueryTypeEnum from './MediaQueryTypeEnum';

/**
 * Media query this.
 */
export default class MediaQueryItem {
	public mediaTypes: MediaQueryTypeEnum[];
	public not: boolean;
	public rules: IMediaQueryRule[];
	public ranges: IMediaQueryRange[];
	private ownerWindow: IWindow;

	/**
	 * Constructor.
	 *
	 * @param ownerWindow Window.
	 * @param [options] Options.
	 * @param [options.mediaTypes] Media types.
	 * @param [options.not] Not.
	 * @param [options.rules] Rules.
	 * @param options.ranges
	 */
	constructor(
		ownerWindow: IWindow,
		options?: {
			mediaTypes?: MediaQueryTypeEnum[];
			not?: boolean;
			rules?: IMediaQueryRule[];
			ranges?: IMediaQueryRange[];
		}
	) {
		this.ownerWindow = ownerWindow;
		this.mediaTypes = (options && options.mediaTypes) || [];
		this.not = (options && options.not) || false;
		this.rules = (options && options.rules) || [];
		this.ranges = (options && options.ranges) || [];
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
		return (
			mediaType ===
			<MediaQueryTypeEnum>(<unknown>this.ownerWindow.happyDOM.settings.device.mediaType)
		);
	}

	/**
	 * Returns "true" if the range matches.
	 *
	 * @param range Range.
	 * @returns "true" if the range matches.
	 */
	private matchesRange(range: IMediaQueryRange): boolean {
		const size =
			range.type === 'width' ? this.ownerWindow.innerWidth : this.ownerWindow.innerHeight;

		if (range.before) {
			const beforeValue = parseInt(range.before.value, 10);
			if (!isNaN(beforeValue)) {
				switch (range.before.operator) {
					case '<':
						if (beforeValue >= size) {
							return false;
						}
						break;
					case '<=':
						if (beforeValue > size) {
							return false;
						}
						break;
					case '>':
						if (beforeValue <= size) {
							return false;
						}
						break;
					case '>=':
						if (beforeValue < size) {
							return false;
						}
						break;
				}
			}
		}

		if (range.after) {
			const afterValue = parseInt(range.after.value, 10);
			if (!isNaN(afterValue)) {
				switch (range.after.operator) {
					case '<':
						if (size >= afterValue) {
							return false;
						}
						break;
					case '<=':
						if (size > afterValue) {
							return false;
						}
						break;
					case '>':
						if (size <= afterValue) {
							return false;
						}
						break;
					case '>=':
						if (size < afterValue) {
							return false;
						}
						break;
				}
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
				const minWidth = parseInt(rule.value, 10);
				return !isNaN(minWidth) && this.ownerWindow.innerWidth >= minWidth;
			case 'max-width':
				const maxWidth = parseInt(rule.value, 10);
				return !isNaN(maxWidth) && this.ownerWindow.innerWidth <= maxWidth;
			case 'min-height':
				const minHeight = parseInt(rule.value, 10);
				return !isNaN(minHeight) && this.ownerWindow.innerHeight >= minHeight;
			case 'max-height':
				const maxHeight = parseInt(rule.value, 10);
				return !isNaN(maxHeight) && this.ownerWindow.innerHeight <= maxHeight;
			case 'orientation':
				return rule.value === 'landscape'
					? this.ownerWindow.innerWidth > this.ownerWindow.innerHeight
					: this.ownerWindow.innerWidth < this.ownerWindow.innerHeight;
			case 'prefers-color-scheme':
				return rule.value === this.ownerWindow.happyDOM.settings.device.prefersColorScheme;
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
				const width = parseInt(aspectRatio[0], 10);
				const height = parseInt(aspectRatio[1], 10);

				if (isNaN(width) || isNaN(height)) {
					return false;
				}

				switch (rule.name) {
					case 'min-aspect-ratio':
						return width / height <= this.ownerWindow.innerWidth / this.ownerWindow.innerHeight;
					case 'max-aspect-ratio':
						return width / height >= this.ownerWindow.innerWidth / this.ownerWindow.innerHeight;
					case 'aspect-ratio':
						return width / height === this.ownerWindow.innerWidth / this.ownerWindow.innerHeight;
				}
		}

		return false;
	}
}
