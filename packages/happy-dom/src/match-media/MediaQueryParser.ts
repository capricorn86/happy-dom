import IMediaQueryItem from './IMediaQueryItem';
import MediaQueryDeviceEnum from './MediaQueryDeviceEnum';

/**
 * Utility for parsing a selection string.
 */
export default class MediaQueryParser {
	/**
	 * Parses a media query string.
	 *
	 * @param mediaQuery Selector.
	 * @returns Media query items.
	 */
	public static getMediaQueryItems(mediaQuery: string): IMediaQueryItem[] {
		const mediaQueryItems: IMediaQueryItem[] = [];

		for (const item of mediaQuery.split(',')) {
			const trimmedItem = item.trim();

			if (!trimmedItem) {
				return [];
			}

			const parts = trimmedItem.split(' ');
			const mediaQueryItem: IMediaQueryItem = {
				device: MediaQueryDeviceEnum.all,
				not: false,
				rule: null
			};

			for (const part of parts) {
				const trimmedPart = part.trim();
				if (!trimmedPart) {
					return [];
				}

				if (trimmedPart === 'not') {
					mediaQueryItem.not = true;
				} else if (trimmedPart === 'and') {
					// Do nothing.
				} else if (trimmedPart === 'all') {
					mediaQueryItem.device = MediaQueryDeviceEnum.all;
				} else if (trimmedPart === 'print') {
					mediaQueryItem.device = MediaQueryDeviceEnum.print;
				} else if (trimmedPart === 'screen') {
					mediaQueryItem.device = MediaQueryDeviceEnum.screen;
				} else if (trimmedPart.startsWith('(')) {
					const parsedRule = trimmedPart.replace('(', '').replace(')', '').trim().toLowerCase();
					if (!parsedRule) {
						return [];
					}
					const [key, value] = parsedRule.split(':');
					if (!key) {
						return [];
					}
					mediaQueryItem.rule = { key, value: value || null };
				} else {
					return [];
				}
			}

			mediaQueryItems.push(mediaQueryItem);
		}

		return mediaQueryItems;
	}
}
