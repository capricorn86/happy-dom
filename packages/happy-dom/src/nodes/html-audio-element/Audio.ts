import HTMLAudioElement from './HTMLAudioElement';

/**
 * Image as constructor.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement/Audio.
 */
export default class Audio extends HTMLAudioElement {
	/**
	 * Constructor.
	 *
	 * @param [url] source URL.
	 */
	constructor(url: string = null) {
		super();

		if (url !== null) {
			this.src = url;
		}
	}
}
