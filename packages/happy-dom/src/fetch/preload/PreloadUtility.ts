import IRequestCredentials from '../types/IRequestCredentials.js';
import IRequestMode from '../types/IRequestMode.js';

/**
 * Utility for preloading resources.
 *
 * @see https://html.spec.whatwg.org/multipage/links.html#link-type-preload
 */
export default class PreloadUtility {
	/**
	 * Returns a key for a preload entry.
	 *
	 * @param options Options.
	 * @param options.url URL.
	 * @param options.destination Destination.
	 * @param options.mode Mode.
	 * @param options.credentialsMode Credentials mode.
	 * @returns Key.
	 */
	public static getKey(options: {
		url: string;
		destination: string;
		mode: IRequestMode;
		credentialsMode: IRequestCredentials;
	}): string {
		return JSON.stringify({
			url: options.url,
			destination: options.destination,
			mode: options.mode,
			credentialsMode: options.credentialsMode
		});
	}
}
