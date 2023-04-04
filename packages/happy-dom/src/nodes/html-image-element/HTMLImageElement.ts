import HTMLElement from '../html-element/HTMLElement';
import IHTMLImageElement from './IHTMLImageElement';

/**
 * HTML Image Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement.
 */
export default class HTMLImageElement extends HTMLElement implements IHTMLImageElement {
	public readonly tagName: string = 'IMG';
	public readonly complete = false;
	public readonly naturalHeight = 0;
	public readonly naturalWidth = 0;
	public crossOrigin = null;
	public decoding = 'auto';
	public loading = 'auto';
	public readonly x = 0;
	public readonly y = 0;

	/**
	 * Returns alt.
	 *
	 * @returns Alt.
	 */
	public get alt(): string {
		return this.getAttribute('alt') || '';
	}

	/**
	 * Sets alt.
	 *
	 * @param alt Alt.
	 */
	public set alt(alt: string) {
		this.setAttribute('alt', alt);
	}

	/**
	 * Returns current src.
	 *
	 * @returns Current src.
	 */
	public get currentSrc(): string {
		return this.src;
	}

	/**
	 * Returns height.
	 *
	 * @returns Height.
	 */
	public get height(): number {
		const height = this.getAttribute('height');
		return height !== null ? Number(height) : 0;
	}

	/**
	 * Sets height.
	 *
	 * @param height Height.
	 */
	public set height(height: number) {
		this.setAttribute('height', String(height));
	}

	/**
	 * Returns is map.
	 *
	 * @returns Is map.
	 */
	public get isMap(): boolean {
		return this.getAttribute('ismap') !== null;
	}

	/**
	 * Sets is map.
	 *
	 * @param ismap Is map.
	 */
	public set isMap(isMap: boolean) {
		if (!isMap) {
			this.removeAttribute('ismap');
		} else {
			this.setAttribute('ismap', '');
		}
	}

	/**
	 * Returns referrer policy.
	 *
	 * @returns Referrer policy.
	 */
	public get referrerPolicy(): string {
		return this.getAttribute('referrerpolicy') || '';
	}

	/**
	 * Sets referrer policy.
	 *
	 * @param referrerPolicy Referrer policy.
	 */
	public set referrerPolicy(referrerPolicy: string) {
		this.setAttribute('referrerpolicy', referrerPolicy);
	}

	/**
	 * Returns sizes.
	 *
	 * @returns Sizes.
	 */
	public get sizes(): string {
		return this.getAttribute('sizes') || '';
	}

	/**
	 * Sets sizes.
	 *
	 * @param sizes Sizes.
	 */
	public set sizes(sizes: string) {
		this.setAttribute('sizes', sizes);
	}

	/**
	 * Returns source.
	 *
	 * @returns Source.
	 */
	public get src(): string {
		return this.getAttribute('src') || '';
	}

	/**
	 * Sets source.
	 *
	 * @param source Source.
	 */
	public set src(src: string) {
		this.setAttribute('src', src);
	}

	/**
	 * Returns srcset.
	 *
	 * @returns Source.
	 */
	public get srcset(): string {
		return this.getAttribute('srcset') || '';
	}

	/**
	 * Sets src set.
	 *
	 * @param srcset Src set.
	 */
	public set srcset(srcset: string) {
		this.setAttribute('srcset', srcset);
	}

	/**
	 * Returns use map.
	 *
	 * @returns Use map.
	 */
	public get useMap(): string {
		return this.getAttribute('usemap') || '';
	}

	/**
	 * Sets is map.
	 *
	 * @param useMap Is map.
	 */
	public set useMap(useMap: string) {
		this.setAttribute('usemap', useMap);
	}

	/**
	 * Returns width.
	 *
	 * @returns Width.
	 */
	public get width(): number {
		const width = this.getAttribute('width');
		return width !== null ? Number(width) : 0;
	}

	/**
	 * Sets width.
	 *
	 * @param width Width.
	 */
	public set width(width: number) {
		this.setAttribute('width', String(width));
	}

	/**
	 * The decode() method of the HTMLImageElement interface returns a Promise that resolves when the image is decoded and it is safe to append the image to the DOM.
	 *
	 * @returns Promise.
	 */
	public decode(): Promise<void> {
		return Promise.resolve();
	}

	/**
	 * Clones a node.
	 *
	 * @override
	 * @param [deep=false] "true" to clone deep.
	 * @returns Cloned node.
	 */
	public cloneNode(deep = false): IHTMLImageElement {
		return <IHTMLImageElement>super.cloneNode(deep);
	}
}
