import type Element from '../nodes/element/Element';
import IAttr from '../nodes/attr/IAttr';
import type { INamedNodeMapProps } from './INamedNodeMap';

/**
 * NamedNodeMap.
 *
 * Reference: https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap.
 */
export default class NamedNodeMap implements INamedNodeMapProps {
	/**
	 * Reference to the element.
	 */
	private _ownerElement: Element;

	/**
	 * Constructor.
	 *
	 * @param element Associated element.
	 */
	constructor(element: Element) {
		Object.defineProperty(this, '_ownerElement', {
			enumerable: false,
			value: element
		});
	}

	/**
	 * Returns `Symbol.toStringTag`.
	 *
	 * @returns `Symbol.toStringTag`.
	 */
	public get [Symbol.toStringTag](): string {
		return this.constructor.name;
	}

	/**
	 * Length.
	 */
	public get length(): number {
		return Object.keys(this._ownerElement._attributes).length;
	}

	/**
	 * Returns attribute by index.
	 *
	 * @param index Index.
	 */
	public item(index: number): IAttr | null {
		if (index < 0) {
			return null;
		}
		const attr = Object.values(this._ownerElement._attributes)[index];
		return attr ? attr : null;
	}

	/**
	 * Returns attribute by name.
	 *
	 * @param qualifiedName Name.
	 */
	public getNamedItem(qualifiedName: string): IAttr | null {
		return this._ownerElement.getAttributeNode(qualifiedName);
	}

	/**
	 * Returns attribute by name and namespace.
	 *
	 * @param namespace Namespace.
	 * @param localName Local name of the attribute.
	 */
	public getNamedItemNS(namespace: string, localName: string): IAttr | null {
		return this._ownerElement.getAttributeNodeNS(namespace, localName);
	}

	/**
	 * Adds a new attribute node.
	 *
	 * @param attr Attribute.
	 * @returns Replaced attribute.
	 */
	public setNamedItem(attr: IAttr): IAttr {
		return this._ownerElement.setAttributeNode(attr);
	}

	/**
	 * Adds a new namespaced attribute node.
	 *
	 * @param attr Attribute.
	 * @returns Replaced attribute.
	 */
	public setNamedItemNS(attr: IAttr): IAttr {
		return this._ownerElement.setAttributeNodeNS(attr);
	}

	/**
	 * Removes an attribute.
	 *
	 * @param qualifiedName Name of the attribute.
	 * @returns Removed attribute.
	 */
	public removeNamedItem(qualifiedName: string): IAttr | null {
		const attr = this.getNamedItem(qualifiedName);

		if (attr) {
			this._ownerElement.removeAttributeNode(attr);
		}
		return attr;
	}

	/**
	 * Removes a namespaced attribute.
	 *
	 * @param namespace Namespace.
	 * @param localName Local name of the attribute.
	 * @returns Removed attribute.
	 */
	public removeNamedItemNS(namespace: string, localName: string): IAttr | null {
		const attr = this.getNamedItemNS(namespace, localName);

		if (attr) {
			this._ownerElement.removeAttributeNode(attr);
		}
		return attr;
	}

	/**
	 * Iterator.
	 */
	public [Symbol.iterator](): Iterator<IAttr> {
		let index = -1;
		return {
			next: () => {
				index++;
				return { value: this.item(index), done: index >= this.length };
			}
		};
	}
}
