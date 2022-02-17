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
		return this.getAttributeNS(null, 'alt') || '';
	}

	/**
	 * Sets alt.
	 *
	 * @param alt Alt.
	 */
	public set alt(alt: string) {
		this.setAttributeNS(null, 'alt', alt);
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
		const height = this.getAttributeNS(null, 'height');
		return height !== null ? Number(height) : 0;
	}

	/**
	 * Sets height.
	 *
	 * @param height Height.
	 */
	public set height(height: number) {
		this.setAttributeNS(null, 'height', String(height));
	}

	/**
	 * Returns is map.
	 *
	 * @returns Is map.
	 */
	public get isMap(): boolean {
		return this.getAttributeNS(null, 'ismap') !== null;
	}

	/**
	 * Sets is map.
	 *
	 * @param ismap Is map.
	 */
	public set isMap(isMap: boolean) {
		if (!isMap) {
			this.removeAttributeNS(null, 'ismap');
		} else {
			this.setAttributeNS(null, 'ismap', '');
		}
	}

	/**
	 * Returns referrer policy.
	 *
	 * @returns Referrer policy.
	 */
	public get referrerPolicy(): string {
		return this.getAttributeNS(null, 'referrerpolicy') || '';
	}

	/**
	 * Sets referrer policy.
	 *
	 * @param referrerPolicy Referrer policy.
	 */
	public set referrerPolicy(referrerPolicy: string) {
		this.setAttributeNS(null, 'referrerpolicy', referrerPolicy);
	}

	/**
	 * Returns sizes.
	 *
	 * @returns Sizes.
	 */
	public get sizes(): string {
		return this.getAttributeNS(null, 'sizes') || '';
	}

	/**
	 * Sets sizes.
	 *
	 * @param sizes Sizes.
	 */
	public set sizes(sizes: string) {
		this.setAttributeNS(null, 'sizes', sizes);
	}

	/**
	 * Returns source.
	 *
	 * @returns Source.
	 */
	public get src(): string {
		return this.getAttributeNS(null, 'src') || '';
	}

	/**
	 * Sets source.
	 *
	 * @param source Source.
	 */
	public set src(src: string) {
		this.setAttributeNS(null, 'src', src);
	}

	/**
	 * Returns srcset.
	 *
	 * @returns Source.
	 */
	public get srcset(): string {
		return this.getAttributeNS(null, 'srcset') || '';
	}

	/**
	 * Sets src set.
	 *
	 * @param srcset Src set.
	 */
	public set srcset(srcset: string) {
		this.setAttributeNS(null, 'srcset', srcset);
	}

	/**
	 * Returns use map.
	 *
	 * @returns Use map.
	 */
	public get useMap(): string {
		return this.getAttributeNS(null, 'usemap') || '';
	}

	/**
	 * Sets is map.
	 *
	 * @param useMap Is map.
	 */
	public set useMap(useMap: string) {
		this.setAttributeNS(null, 'usemap', useMap);
	}

	/**
	 * Returns width.
	 *
	 * @returns Width.
	 */
	public get width(): number {
		const width = this.getAttributeNS(null, 'width');
		return width !== null ? Number(width) : 0;
	}

	/**
	 * Sets width.
	 *
	 * @param width Width.
	 */
	public set width(width: number) {
		this.setAttributeNS(null, 'width', String(width));
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
