import IDocument from '../nodes/document/IDocument';
import IElement from '../nodes/element/IElement';

/**
 * Attribute node interface.
 *
 * Reference: https://developer.mozilla.org/en-US/docs/Web/API/Attr.
 */
export default class Attr {
	public value: string = null;
	public name: string = null;
	public namespaceURI: string = null;

	/**
	 * @deprecated
	 */
	public readonly ownerElement: IElement = null;

	/**
	 * @deprecated
	 */
	public readonly ownerDocument: IDocument = null;

	/**
	 * @deprecated
	 */
	public readonly specified = true;

	/**
	 * Returns local name.
	 *
	 * @returns Local name.
	 */
	public get localName(): string {
		return this.name ? this.name.split(':').reverse()[0] : null;
	}

	/**
	 * Returns prefix.
	 *
	 * @returns Prefix.
	 */
	public get prefix(): string {
		return this.name ? this.name.split(':')[0] : null;
	}
}
