import IShadowRoot from '../shadow-root/IShadowRoot';
import IAttr from '../attr/IAttr';
import INamedNodeMap from '../../named-node-map/INamedNodeMap';
import DOMRect from './DOMRect';
import IDOMTokenList from '../../dom-token-list/IDOMTokenList';
import INode from './../node/INode';
import IChildNode from '../child-node/IChildNode';
import IParentNode from '../parent-node/IParentNode';
import INonDocumentTypeChildNode from '../child-node/INonDocumentTypeChildNode';
import IDOMRectList from './IDOMRectList';
import Event from '../../event/Event';

export type TInsertAdjacentPositions = 'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend';

/**
 * Element.
 */
export default interface IElement extends IChildNode, INonDocumentTypeChildNode, IParentNode {
	readonly tagName: string;
	readonly shadowRoot: IShadowRoot;
	readonly classList: IDOMTokenList;
	readonly namespaceURI: string;
	prefix: string | null;
	scrollTop: number;
	scrollLeft: number;
	id: string;
	className: string;
	role: string;
	innerHTML: string;
	outerHTML: string;
	slot: string;
	readonly nodeName: string;
	readonly localName: string;
	readonly attributes: INamedNodeMap;

	// Events
	oncancel: (event: Event) => void | null;
	onerror: (event: Event) => void | null;
	onscroll: (event: Event) => void | null;
	onselect: (event: Event) => void | null;
	onwheel: (event: Event) => void | null;
	oncopy: (event: Event) => void | null;
	oncut: (event: Event) => void | null;
	onpaste: (event: Event) => void | null;
	oncompositionend: (event: Event) => void | null;
	oncompositionstart: (event: Event) => void | null;
	oncompositionupdate: (event: Event) => void | null;
	onblur: (event: Event) => void | null;
	onfocus: (event: Event) => void | null;
	onfocusin: (event: Event) => void | null;
	onfocusout: (event: Event) => void | null;
	onfullscreenchange: (event: Event) => void | null;
	onfullscreenerror: (event: Event) => void | null;
	onkeydown: (event: Event) => void | null;
	onkeyup: (event: Event) => void | null;
	onauxclick: (event: Event) => void | null;
	onclick: (event: Event) => void | null;
	oncontextmenu: (event: Event) => void | null;
	ondblclick: (event: Event) => void | null;
	onmousedown: (event: Event) => void | null;
	onmouseenter: (event: Event) => void | null;
	onmouseleave: (event: Event) => void | null;
	onmousemove: (event: Event) => void | null;
	onmouseout: (event: Event) => void | null;
	onmouseover: (event: Event) => void | null;
	onmouseup: (event: Event) => void | null;
	ontouchcancel: (event: Event) => void | null;
	ontouchend: (event: Event) => void | null;
	ontouchmove: (event: Event) => void | null;
	ontouchstart: (event: Event) => void | null;

	/**
	 * Attribute changed callback.
	 *
	 * @param name Name.
	 * @param oldValue Old value.
	 * @param newValue New value.
	 */
	attributeChangedCallback?(name: string, oldValue: string, newValue: string): void;

	/**
	 * Returns inner HTML and optionally the content of shadow roots.
	 *
	 * This is a feature implemented in Chromium, but not supported by Mozilla yet.
	 *
	 * @see https://web.dev/declarative-shadow-dom/
	 * @see https://chromestatus.com/feature/5191745052606464
	 * @param [options] Options.
	 * @param [options.includeShadowRoots] Set to "true" to include shadow roots.
	 * @returns HTML.
	 */
	getInnerHTML(options?: { includeShadowRoots?: boolean }): string;

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
	 * Returns attribute names.
	 *
	 * @returns Attribute names.
	 */
	getAttributeNames(): string[];

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
	 * @returns "true" if the element has attributes.
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
	 * Toggle an attribute.
	 *
	 * @param name A DOMString specifying the name of the attribute to be toggled.
	 * @param force A boolean value to determine whether the attribute should be added or removed, no matter whether the attribute is present or not at the moment.
	 */
	toggleAttribute(name: string, force?: boolean): boolean;

	/**
	 * Attaches a shadow root.
	 *
	 * @param _shadowRootInit Shadow root init.
	 * @returns Shadow root.
	 */
	attachShadow(_shadowRootInit: { mode: string }): IShadowRoot;

	/**
	 * Scrolls to a particular set of coordinates.
	 *
	 * @param x X position or options object.
	 * @param y Y position.
	 */
	scroll(x: { top?: number; left?: number; behavior?: string } | number, y: number): void;

	/**
	 * Scrolls to a particular set of coordinates.
	 *
	 * @param x X position or options object.
	 * @param y Y position.
	 */
	scrollTo(x: { top?: number; left?: number; behavior?: string } | number, y: number): void;

	/**
	 * Returns the size of an element and its position relative to the viewport.
	 *
	 * @returns DOM rect.
	 */
	getBoundingClientRect(): DOMRect;

	/**
	 * Returns a collection of DOMRect objects that indicate the bounding rectangles for each CSS border box in a client.
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/getClientRects
	 * @returns DOM rect list.
	 */
	getClientRects(): IDOMRectList<DOMRect>;

	/**
	 * The matches() method checks to see if the Element would be selected by the provided selectorString.
	 *
	 * @param selector Selector.
	 * @returns "true" if matching.
	 */
	matches(selector: string): boolean;

	/**
	 * Traverses the Element and its parents (heading toward the document root) until it finds a node that matches the provided selector string.
	 *
	 * @param selector Selector.
	 * @returns Closest matching element.
	 */
	closest(selector: string): IElement;

	/**
	 * The setAttributeNode() method adds a new Attr node to the specified element.
	 *
	 * @param attribute Attribute.
	 * @returns Replaced attribute.
	 */
	setAttributeNode(attribute: IAttr): IAttr;

	/**
	 * The setAttributeNodeNS() method adds a new Attr node to the specified element.
	 *
	 * @param attribute Attribute.
	 * @returns Replaced attribute.
	 */
	setAttributeNodeNS(attribute: IAttr): IAttr;

	/**
	 * Returns an Attr node.
	 *
	 * @param name Name.
	 * @returns Replaced attribute.
	 */
	getAttributeNode(name: string): IAttr;

	/**
	 * Returns a namespaced Attr node.
	 *
	 * @param namespace Namespace.
	 * @param nodeName Node name.
	 * @returns Replaced attribute.
	 */
	getAttributeNodeNS(namespace: string, nodeName: string): IAttr;

	/**
	 * Removes an Attr node.
	 *
	 * @param attribute Attribute.
	 * @returns Removed attribute.
	 */
	removeAttributeNode(attribute: IAttr): IAttr;

	/**
	 * Removes an Attr node.
	 *
	 * @param attribute Attribute.
	 * @returns Removed attribute.
	 */
	removeAttributeNodeNS(attribute: IAttr): IAttr;

	/**
	 * Clones a node.
	 *
	 * @override
	 * @param [deep=false] "true" to clone deep.
	 * @returns Cloned node.
	 */
	cloneNode(deep?: boolean): IElement;

	/**
	 * Inserts a node to the given position.
	 *
	 * @param position Position to insert element.
	 * @param element Node to insert.
	 * @returns Inserted node or null if couldn't insert.
	 */
	insertAdjacentElement(position: TInsertAdjacentPositions, node: INode): INode | null;

	/**
	 * Inserts an HTML string to the given position.
	 *
	 * @param position Position to insert text.
	 * @param text HTML string to insert.
	 */
	insertAdjacentHTML(position: TInsertAdjacentPositions, text: string): void;

	/**
	 * Inserts text to the given position.
	 *
	 * @param position Position to insert text.
	 * @param text String to insert.
	 */
	insertAdjacentText(position: TInsertAdjacentPositions, text: string): void;
}
