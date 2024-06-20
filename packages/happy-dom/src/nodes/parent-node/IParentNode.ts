import IHTMLCollection from '../element/IHTMLCollection.js';
import Element from '../element/Element.js';
import Node from '../node/Node.js';
import INodeList from '../node/INodeList.js';
import IHTMLElementTagNameMap from '../../config/IHTMLElementTagNameMap.js';
import ISVGElementTagNameMap from '../../config/ISVGElementTagNameMap.js';

export default interface IParentNode extends Node {
	readonly childElementCount: number;
	readonly firstElementChild: Element;
	readonly lastElementChild: Element;
	readonly children: IHTMLCollection<Element>;

	/**
	 * Inserts a set of Node objects or DOMString objects after the last child of the ParentNode. DOMString objects are inserted as equivalent Text nodes.
	 *
	 * @param nodes List of Node or DOMString.
	 */
	append(...nodes: (Node | string)[]): void;

	/**
	 * Inserts a set of Node objects or DOMString objects before the first child of the ParentNode. DOMString objects are inserted as equivalent Text nodes.
	 *
	 * @param nodes List of Node or DOMString.
	 */
	prepend(...nodes: (Node | string)[]): void;

	/**
	 * Query CSS Selector to find matching node.
	 *
	 * @param selector CSS selector.
	 * @returns Matching element.
	 */
	querySelector<K extends keyof IHTMLElementTagNameMap>(
		selector: K
	): IHTMLElementTagNameMap[K] | null;
	querySelector<K extends keyof ISVGElementTagNameMap>(
		selector: K
	): ISVGElementTagNameMap[K] | null;
	querySelector(selector: string): Element | null;

	/**
	 * Query CSS selector to find matching nodes.
	 *
	 * @param selector CSS selector.
	 * @returns Matching elements.
	 */
	querySelectorAll<K extends keyof IHTMLElementTagNameMap>(
		selector: K
	): INodeList<IHTMLElementTagNameMap[K]>;
	querySelectorAll<K extends keyof ISVGElementTagNameMap>(
		selector: K
	): INodeList<ISVGElementTagNameMap[K]>;
	querySelectorAll(selector: string): INodeList<Element>;

	/**
	 * Query CSS selector to find matching nodes.
	 *
	 * @param selector CSS selector.
	 * @returns Matching elements.
	 */
	querySelectorAll(selector: string): INodeList<Element>;

	/**
	 * Returns an elements by class name.
	 *
	 * @param className Tag name.
	 * @returns Matching element.
	 */
	getElementsByClassName(className: string): IHTMLCollection<Element>;

	/**
	 * Returns an elements by tag name.
	 *
	 * @param tagName Tag name.
	 * @returns Matching element.
	 */
	getElementsByTagName<K extends keyof IHTMLElementTagNameMap>(
		tagName: K
	): IHTMLCollection<IHTMLElementTagNameMap[K]>;
	getElementsByTagName<K extends keyof ISVGElementTagNameMap>(
		tagName: K
	): IHTMLCollection<ISVGElementTagNameMap[K]>;
	getElementsByTagName(tagName: string): IHTMLCollection<Element>;

	/**
	 * Returns an elements by tag name and namespace.
	 *
	 * @param namespaceURI Namespace URI.
	 * @param tagName Tag name.
	 * @returns Matching element.
	 */
	getElementsByTagNameNS<K extends keyof IHTMLElementTagNameMap>(
		namespaceURI: 'http://www.w3.org/1999/xhtml',
		tagName: K
	): IHTMLCollection<IHTMLElementTagNameMap[K]>;
	getElementsByTagNameNS<K extends keyof ISVGElementTagNameMap>(
		namespaceURI: 'http://www.w3.org/2000/svg',
		tagName: K
	): IHTMLCollection<ISVGElementTagNameMap[K]>;
	getElementsByTagNameNS(namespaceURI: string, tagName: string): IHTMLCollection<Element>;

	/**
	 * Replaces the existing children of a node with a specified new set of children.
	 *
	 * @param nodes List of Node or DOMString.
	 */
	replaceChildren(...nodes: (Node | string)[]): void;
}
