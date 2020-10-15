import IShadowRoot from '../shadow-root/IShadowRoot';
import Attr from '../../../attribute/Attr';
import DOMRect from './DOMRect';
import Range from './Range';
import ClassList from './ClassList';
import IChildNode from '../child-node/IChildNode';
import IParentNode from '../parent-node/IParentNode';
import INonDocumentTypeChildNode from '../child-node/INonDocumentTypeChildNode';

/**
 * Element.
 */
export default interface IElement extends IChildNode, INonDocumentTypeChildNode, IParentNode {
	readonly tagName: string;
	readonly shadowRoot: IShadowRoot;
	readonly classList: ClassList;
	readonly namespaceURI: string;
	scrollTop: number;
	scrollLeft: number;
	id: string;
	className: string;
	innerHTML: string;
	readonly outerHTML: string;
	readonly attributes: { [k: string]: Attr | number };

	/**
	 * Attribute changed callback.
	 *
	 * @param name Name.
	 * @param oldValue Old value.
	 * @param newValue New value.
	 */
	attributeChangedCallback?(name: string, oldValue: string, newValue: string): void;

	/**
	 * Sets an attribute.
	 *
	 * @param name Name.
	 * @param value Value.
	 */
	setAttribute(name: string, value: string): void;

	/**
	 * Sets a namespace attribute.
	 *
	 * @param namespaceURI Namespace URI.
	 * @param name Name.
	 * @param value Value.
	 */
	setAttributeNS(namespaceURI: string, name: string, value: string): void;

	/**
	 * Returns attribute value.
	 *
	 * @param name Name.
	 */
	getAttribute(name: string): string;

	/**
	 * Returns namespace attribute value.
	 *
	 * @param namespace Namespace URI.
	 * @param localName Local name.
	 */
	getAttributeNS(namespace: string, localName: string): string;

	/**
	 * Returns a boolean value indicating whether the specified element has the attribute or not.
	 *
	 * @param name Attribute name.
	 * @returns True if attribute exists, false otherwise.
	 */
	hasAttribute(name: string): boolean;

	/**
	 * Returns a boolean value indicating whether the specified element has the namespace attribute or not.
	 *
	 * @param namespace Namespace URI.
	 * @param localName Local name.
	 * @returns True if attribute exists, false otherwise.
	 */
	hasAttributeNS(namespace: string, localName: string): boolean;

	/**
	 * Returns "true" if the element has attributes.
	 *
	 * @return "true" if the element has attributes.
	 */
	hasAttributes(): boolean;

	/**
	 * Removes an attribute.
	 *
	 * @param name Name.
	 */
	removeAttribute(name: string): void;

	/**
	 * Removes a namespace attribute.
	 *
	 * @param namespace Namespace URI.
	 * @param localName Local name.
	 */
	removeAttributeNS(namespace: string, localName: string): void;

	/**
	 * Attaches a shadow root.
	 *
	 * @param _shadowRootInit Shadow root init.
	 * @returns Shadow root.
	 */
	attachShadow(_shadowRootInit: { mode: string }): IShadowRoot;

	/**
	 * Scrolls to a particular set of coordinates in the document.
	 *
	 * @note This method has not been implemented. It is just here for compatibility.
	 */
	scrollTo(): void;

	/**
	 * Returns the size of an element and its position relative to the viewport.
	 *
	 * @returns DOM rect.
	 */
	getBoundingClientRect(): DOMRect;

	/**
	 * Returns a range.
	 *
	 * @returns Range.
	 */
	createTextRange(): Range;

	/**
	 * Returns an elements by tag name.
	 *
	 * @param tagName Tag name.
	 * @returns Matching elements.
	 */
	getElementsByTagName(tagName: string): IElement[];

	/**
	 * Returns an elements by tag name.
	 *
	 * @param namespaceURI Namespace URI.
	 * @param tagName Tag name.
	 * @returns Matching nodes.
	 */
	getElementsByTagNameNS(namespaceURI: string, tagName: string): IElement[];

	/**
	 * Returns an elements by class name.
	 *
	 * @param className Tag name.
	 * @returns Matching nodes.
	 */
	getElementsByClassName(className: string): IElement[];

	/**
	 * The setAttributeNode() method adds a new Attr node to the specified element.
	 *
	 * @param attribute Attribute.
	 * @returns Replaced attribute.
	 */
	setAttributeNode(attribute: Attr): Attr;

	/**
	 * Returns an Attr node.
	 *
	 * @param name Name.
	 * @returns Replaced attribute.
	 */
	getAttributeNode(name: string): Attr;

	/**
	 * Removes an Attr node.
	 *
	 * @param attribute Attribute.
	 */
	removeAttributeNode(attribute: Attr): void;
}
