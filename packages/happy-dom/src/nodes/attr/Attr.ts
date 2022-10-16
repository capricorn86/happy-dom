import IElement from '../element/IElement';
import Node from '../node/Node';
import IAttr from './IAttr';

/**
 * Attribute node interface.
 *
 * Reference: https://developer.mozilla.org/en-US/docs/Web/API/Attr.
 */
export default class Attr extends Node implements IAttr {
	public readonly nodeType = Node.ATTRIBUTE_NODE;
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

	/**
	 * @override
	 */
	public get textContent(): string {
		return this.value;
	}
}
