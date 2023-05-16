import MediaQueryItem from './MediaQueryItem';
import MediaQueryDeviceEnum from './MediaQueryDeviceEnum';
import IWindow from '../window/IWindow';

/**
 * Media query RegExp.
 *
 * Group 1: "not", "only", "all", "screen", "print".
 * Group 2: Rule.
 * Group 3: Rule end paranthesis (must be present if no value).
 * Group 4: Comma (,).
 * Group 5: "or", "and".
 */
const MEDIA_QUERY_REGEXP = /(not|only|all|screen|print)|\(([^\)]+)(\)){0,1}|(,)| +(or|and) +/g;

/**
 * Resolution RegExp.
 *
 * Group 1: First resolution number.
 * Group 2: First resolution entity.
 * Group 3: First resolution operator.
 * Group 4: Resolution type.
 * Group 5: Second resolution operator.
 * Group 6: Second resolution number.
 * Group 7: Second resolution entity.
 */
const RESOLUTION_REGEXP =
	/(?:([0-9]+)([a-z]+) *(<|<=|>|=>)){0,1} *(width|height) *(?:(<|<=|>|=>) *([0-9]+)([a-z]+)){0,1}/;

/**
 * Utility for parsing a query string.
 */
export default class MediaQueryParser {
	/**
	 * Parses a media query string.
	 *
	 * @param ownerWindow Window.
	 * @param mediaQuery Selector.
	 * @returns Media query items.
	 */
	public static parse(ownerWindow: IWindow, mediaQuery: string): MediaQueryItem[] {
		let currentMediaQueryItem: MediaQueryItem = new MediaQueryItem(ownerWindow);
		const mediaQueryItems: MediaQueryItem[] = [currentMediaQueryItem];
		const regexp = new RegExp(MEDIA_QUERY_REGEXP);
		let match: RegExpExecArray | null = null;

		while ((match = regexp.exec(mediaQuery.toLowerCase()))) {
			if (match[4] === ',' || match[5] === 'or') {
				currentMediaQueryItem = new MediaQueryItem(ownerWindow);
				mediaQueryItems.push(currentMediaQueryItem);
			} else if (match[1] === 'all' || match[1] === 'screen' || match[1] === 'print') {
				currentMediaQueryItem.devices.push(<MediaQueryDeviceEnum>match[1]);
			} else if (match[1] === 'not') {
				currentMediaQueryItem.not = true;
			} else if (match[2]) {
				const resolutionMatch =
					match[2].includes('<') || match[2].includes('>')
						? match[2].match(RESOLUTION_REGEXP)
						: null;
				if (resolutionMatch && (resolutionMatch[1] || resolutionMatch[6])) {
					if (resolutionMatch[1] && resolutionMatch[2] && resolutionMatch[3]) {
						const value = parseInt(resolutionMatch[1], 10);
						const parsedValue =
							resolutionMatch[1] === '<'
								? value - 1
								: resolutionMatch[1] === '>'
								? value + 1
								: value;
						currentMediaQueryItem.rules.push({
							name: `${resolutionMatch[3] === '<' || resolutionMatch[3] === '<=' ? 'max' : 'min'}-${
								resolutionMatch[3]
							}`,
							value: `${parsedValue}${resolutionMatch[2]}`
						});
					} else if (resolutionMatch[4] && resolutionMatch[5] && resolutionMatch[6]) {
						const value = parseInt(resolutionMatch[1], 10);
						const parsedValue =
							resolutionMatch[6] === '<'
								? value + 1
								: resolutionMatch[6] === '>'
								? value - 1
								: value;
						currentMediaQueryItem.rules.push({
							name: `${resolutionMatch[6] === '<' || resolutionMatch[6] === '<=' ? 'min' : 'max'}-${
								resolutionMatch[5]
							}`,
							value: `${parsedValue}${resolutionMatch[5]}`
						});
					}
				} else {
					const [name, value] = match[2].split(':');
					const trimmedValue = value ? value.trim() : null;
					if (!trimmedValue && !match[3]) {
						return [
							new MediaQueryItem(ownerWindow, { not: true, devices: [MediaQueryDeviceEnum.all] })
						];
					}
					currentMediaQueryItem.rules.push({
						name: name.trim(),
						value: trimmedValue
					});
				}
			}
		}

		return mediaQueryItems;
	}
}
