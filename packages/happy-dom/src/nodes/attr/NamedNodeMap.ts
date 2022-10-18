import type Element from '../element/Element';
import IAttr from './IAttr';
import type { INamedNodeMapProps } from './INamedNodeMap';

/**
 * NamedNodeMap.
 *
 * Reference: https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap.
 */
export default class NamedNodeMap implements INamedNodeMapProps {
	private _element: Element;

	/**
	 * Constructor.
	 *
	 * @param element Associated element.
	 */
	constructor(element: Element) {
		Object.defineProperty(this, '_element', { enumerable: false, writable: true, value: element });
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
		return Object.keys(this._element._attributes).length;
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
		const attr = Object.values(this._element._attributes)[index];
		return attr ? attr : null;
	}

	/**
	 * Returns attribute by name.
	 *
	 * @param qualifiedName Name.
	 */
	public getNamedItem(qualifiedName: string): IAttr | null {
		return this._element.getAttributeNode(qualifiedName);
	}

	/**
	 * Returns attribute by name and namespace.
	 *
	 * @param namespace Namespace.
	 * @param localName Local name of the attribute.
	 */
	public getNamedItemNS(namespace: string, localName: string): IAttr | null {
		return this._element.getAttributeNodeNS(namespace, localName);
	}

	/**
	 * Adds a new attribute node.
	 *
	 * @param attr Attribute.
	 * @returns Replaced attribute.
	 */
	public setNamedItem(attr: IAttr): IAttr {
		return this._element.setAttributeNode(attr);
	}

	/**
	 * Adds a new namespaced attribute node.
	 *
	 * @param attr Attribute.
	 * @returns Replaced attribute.
	 */
	public setNamedItemNS(attr: IAttr): IAttr {
		return this._element.setAttributeNodeNS(attr);
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
			this._element.removeAttributeNode(attr);
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
			this._element.removeAttributeNode(attr);
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
