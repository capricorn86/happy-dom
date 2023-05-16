import IWindow from '../window/IWindow';
import MediaQueryDeviceEnum from './MediaQueryDeviceEnum';

/**
 * Media query this.
 */
export default class MediaQueryItem {
	public devices: MediaQueryDeviceEnum[];
	public not: boolean;
	public rules: Array<{ name: string; value: string | null }>;
	private ownerWindow: IWindow;

	/**
	 * Constructor.
	 *
	 * @param ownerWindow Window.
	 * @param [options] Options.
	 * @param [options.devices] Devices.
	 * @param [options.not] Not.
	 * @param [options.rules] Rules.
	 */
	constructor(
		ownerWindow: IWindow,
		options?: {
			devices?: MediaQueryDeviceEnum[];
			not?: boolean;
			rules?: Array<{ name: string; value: string | null }>;
		}
	) {
		this.ownerWindow = ownerWindow;
		this.devices = (options && options.devices) || [];
		this.not = (options && options.not) || false;
		this.rules = (options && options.rules) || [];
	}

	/**
	 * Returns media string.
	 */
	public toString(): string {
		return `${this.not ? 'not ' : ''}${this.devices.join(', ')}${
			(this.not || this.devices.length > 0) && !!this.rules.length ? ' and ' : ''
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
		if (!!this.devices.length) {
			let isDeviceMatch = false;
			for (const device of this.devices) {
				if (this.matchesDevice(device)) {
					isDeviceMatch = true;
					break;
				}
			}

			if (!isDeviceMatch) {
				return false;
			}
		}

		for (const rule of this.rules) {
			if (!this.matchesRule(rule)) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Returns "true" if the device matches.
	 *
	 * @param device Device.
	 * @returns "true" if the device matches.
	 */
	private matchesDevice(device: MediaQueryDeviceEnum): boolean {
		switch (device) {
			case MediaQueryDeviceEnum.all:
				return true;
			case MediaQueryDeviceEnum.screen:
				return true;
			case MediaQueryDeviceEnum.print:
				return false;
		}
	}

	/**
	 * Returns "true" if the rule matches.
	 *
	 * @param rule Rule.
	 * @param rule.name Rule name.
	 * @param rule.value Rule value.
	 * @returns "true" if the rule matches.
	 */
	private matchesRule(rule: { name: string; value: string | null }): boolean {
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
				return rule.value === this.ownerWindow.happyDOM.settings.colorScheme;
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
