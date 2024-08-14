import HTMLElement from '../html-element/HTMLElement.js';
import TextTrack from './TextTrack.js';
import * as PropertySymbol from '../../PropertySymbol.js';

/**
 * HTMLTrackElement
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLTrackElement
 */
export default class HTMLTrackElement extends HTMLElement {
	public [PropertySymbol.track]: TextTrack | null = null;

	// Events
	public oncuechange: (event: Event) => void = null;

	/**
	 * Returns kind.
	 *
	 * @returns Kind.
	 */
	public get kind(): string {
		return this.getAttribute('kind') || '';
	}

	/**
	 * Sets kind.
	 *
	 * @param value Value.
	 */
	public set kind(value: string) {
		this.setAttribute('kind', value);
	}

	/**
	 * Returns source.
	 *
	 * @returns Source.
	 */
	public get src(): string {
		if (!this.hasAttribute('src')) {
			return '';
		}

		try {
			return new URL(this.getAttribute('src'), this[PropertySymbol.ownerDocument].location.href)
				.href;
		} catch (e) {
			return this.getAttribute('src');
		}
	}

	/**
	 * Sets source.
	 *
	 * @param src Source.
	 */
	public set src(src: string) {
		this.setAttribute('src', src);
	}

	/**
	 * Returns the TextTrack object corresponding to the track element.
	 *
	 * @returns TextTrack
	 */
	public get track(): TextTrack {
		if (!this[PropertySymbol.track]) {
			this[PropertySymbol.track] = new TextTrack();
		}
		return this[PropertySymbol.track];
	}
}
