import IHTMLCollection from '../element/IHTMLCollection.js';
import IElement from '../element/IElement.js';
import INode from '../node/INode.js';
import INodeList from '../node/INodeList.js';
import IElementTagNameMap from '../../config/IElementTagNameMap.js';
import ISVGElementTagNameMap from '../../config/ISVGElementTagNameMap.js';

export default interface IParentNode extends INode {
	readonly childElementCount: number;
	readonly firstElementChild: IElement;
	readonly lastElementChild: IElement;
	readonly children: IHTMLCollection<IElement>;

	/**
	 * Inserts a set of Node objects or DOMString objects after the last child of the ParentNode. DOMString objects are inserted as equivalent Text nodes.
	 *
	 * @param nodes List of Node or DOMString.
	 */
	append(...nodes: (INode | string)[]): void;

	/**
	 * Inserts a set of Node objects or DOMString objects before the first child of the ParentNode. DOMString objects are inserted as equivalent Text nodes.
	 *
	 * @param nodes List of Node or DOMString.
	 */
	prepend(...nodes: (INode | string)[]): void;

	/**
	 * Query CSS Selector to find matching node.
	 *
	 * @param selector CSS selector.
	 * @returns Matching element.
	 */
	querySelector<K extends keyof IElementTagNameMap>(selector: K): IElementTagNameMap[K] | null;
	querySelector<K extends keyof ISVGElementTagNameMap>(
		selector: K
	): ISVGElementTagNameMap[K] | null;
	querySelector(selector: string): IElement | null;

	/**
	 * Query CSS selector to find matching nodes.
	 *
	 * @param selector CSS selector.
	 * @returns Matching elements.
	 */
	querySelectorAll<K extends keyof IElementTagNameMap>(
		selector: K
	): INodeList<IElementTagNameMap[K]>;
	querySelectorAll<K extends keyof ISVGElementTagNameMap>(
		selector: K
	): INodeList<ISVGElementTagNameMap[K]>;
	querySelectorAll<K extends keyof IElement>(selector: K): INodeList<IElement>;

	/**
	 * Query CSS selector to find matching nodes.
	 *
	 * @param selector CSS selector.
	 * @returns Matching elements.
	 */
	querySelectorAll(selector: string): INodeList<IElement>;

	/**
	 * Returns an elements by class name.
	 *
	 * @param className Tag name.
	 * @returns Matching element.
	 */
	getElementsByClassName(className: string): IHTMLCollection<IElement>;

	/**
	 * Returns an elements by tag name.
	 *
	 * @param tagName Tag name.
	 * @returns Matching element.
	 */
	getElementsByTagName(tagName: string): IHTMLCollection<IElement>;

	/**
	 * Returns an elements by tag name and namespace.
	 *
	 * @param namespaceURI Namespace URI.
	 * @param tagName Tag name.
	 * @returns Matching element.
	 */
	getElementsByTagNameNS(namespaceURI: string, tagName: string): IHTMLCollection<IElement>;

	/**
	 * Replaces the existing children of a node with a specified new set of children.
	 *
	 * @param nodes List of Node or DOMString.
	 */
	replaceChildren(...nodes: (INode | string)[]): void;
}
