import Document from '../document/Document.js';
import HTMLAudioElement from './HTMLAudioElement.js';

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
	 * @param [ownerDocument] Owner document.
	 * @param [url] source URL.
	 */
	constructor(ownerDocument?: Document, url: string = null) {
		super(ownerDocument);

		if (url !== null) {
			this.src = url;
		}
	}
}
