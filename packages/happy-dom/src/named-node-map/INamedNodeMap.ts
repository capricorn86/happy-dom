import IAttr from '../nodes/attr/IAttr';

/**
 * NamedNodeMap.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap.
 */
export default interface INamedNodeMap extends Iterable<IAttr> {
	[index: number]: IAttr;
	[Symbol.toStringTag]: string;
	readonly length: number;

	/**
	 * Returns attribute by index.
	 *
	 * @param index Index.
	 */
	item: (index: number) => IAttr;

	/**
	 * Returns attribute by name.
	 *
	 * @param qualifiedName Name.
	 * @returns Attribute.
	 */
	getNamedItem: (qualifiedName: string) => IAttr;

	/**
	 * Returns attribute by name and namespace.
	 *
	 * @param namespace Namespace.
	 * @param localName Local name of the attribute.
	 * @returns Attribute.
	 */
	getNamedItemNS: (namespace: string, localName: string) => IAttr;

	/**
	 * Adds a new attribute node.
	 *
	 * @param attr Attribute.
	 * @returns Replaced attribute.
	 */
	setNamedItem: (attr: IAttr) => IAttr;

	/**
	 * Adds a new namespaced attribute node.
	 *
	 * @param attr Attribute.
	 * @returns Replaced attribute.
	 */
	setNamedItemNS: (attr: IAttr) => IAttr;

	/**
	 * Removes an attribute.
	 *
	 * @param qualifiedName Name of the attribute.
	 * @returns Removed attribute.
	 */
	removeNamedItem: (qualifiedName: string) => IAttr;

	/**
	 * Removes a namespaced attribute.
	 *
	 * @param namespace Namespace.
	 * @param localName Local name of the attribute.
	 * @returns Removed attribute.
	 */
	removeNamedItemNS: (namespace: string, localName: string) => IAttr;
}
