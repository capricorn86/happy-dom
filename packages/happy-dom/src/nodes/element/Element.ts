import Node from '../node/Node.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import ShadowRoot from '../shadow-root/ShadowRoot.js';
import DOMRect from './DOMRect.js';
import DOMTokenList from '../../dom-token-list/DOMTokenList.js';
import QuerySelector from '../../query-selector/QuerySelector.js';
import XMLParser from '../../xml-parser/XMLParser.js';
import XMLSerializer from '../../xml-serializer/XMLSerializer.js';
import ChildNodeUtility from '../child-node/ChildNodeUtility.js';
import ParentNodeUtility from '../parent-node/ParentNodeUtility.js';
import NonDocumentChildNodeUtility from '../child-node/NonDocumentChildNodeUtility.js';
import DOMException from '../../exception/DOMException.js';
import HTMLCollection from './HTMLCollection.js';
import NodeList from '../node/NodeList.js';
import Text from '../text/Text.js';
import DOMRectList from './DOMRectList.js';
import Attr from '../attr/Attr.js';
import NamedNodeMap from '../../named-node-map/NamedNodeMap.js';
import Event from '../../event/Event.js';
import ElementUtility from './ElementUtility.js';
import EventPhaseEnum from '../../event/EventPhaseEnum.js';
import CSSStyleDeclaration from '../../css/declaration/CSSStyleDeclaration.js';
import DocumentFragment from '../document-fragment/DocumentFragment.js';
import ElementNamedNodeMap from './ElementNamedNodeMap.js';
import WindowErrorUtility from '../../window/WindowErrorUtility.js';
import WindowBrowserSettingsReader from '../../window/WindowBrowserSettingsReader.js';
import BrowserErrorCaptureEnum from '../../browser/enums/BrowserErrorCaptureEnum.js';
import NodeFactory from '../NodeFactory.js';
import NodeTypeEnum from '../node/NodeTypeEnum.js';
import IHTMLElementTagNameMap from '../../config/IHTMLElementTagNameMap.js';
import ISVGElementTagNameMap from '../../config/ISVGElementTagNameMap.js';
import IChildNode from '../child-node/IChildNode.js';
import INonDocumentTypeChildNode from '../child-node/INonDocumentTypeChildNode.js';
import IParentNode from '../parent-node/IParentNode.js';

type InsertAdjacentPosition = 'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend';

/**
 * Element.
 */
export default class Element
	extends Node
	implements IChildNode, INonDocumentTypeChildNode, IParentNode
{
	// ObservedAttributes should only be called once by CustomElementRegistry (see #117)
	// CustomElementRegistry will therefore populate "[PropertySymbol.observedAttributes]" when CustomElementRegistry.define() is called
	public static [PropertySymbol.observedAttributes]: string[];
	public static [PropertySymbol.tagName]: string | null = null;
	public static [PropertySymbol.localName]: string | null = null;
	public static [PropertySymbol.namespaceURI]: string | null = null;
	public static observedAttributes: string[];
	public cloneNode: (deep?: boolean) => Element;

	// Events
	public oncancel: (event: Event) => void | null = null;
	public onerror: (event: Event) => void | null = null;
	public onscroll: (event: Event) => void | null = null;
	public onselect: (event: Event) => void | null = null;
	public onwheel: (event: Event) => void | null = null;
	public oncopy: (event: Event) => void | null = null;
	public oncut: (event: Event) => void | null = null;
	public onpaste: (event: Event) => void | null = null;
	public oncompositionend: (event: Event) => void | null = null;
	public oncompositionstart: (event: Event) => void | null = null;
	public oncompositionupdate: (event: Event) => void | null = null;
	public onblur: (event: Event) => void | null = null;
	public onfocus: (event: Event) => void | null = null;
	public onfocusin: (event: Event) => void | null = null;
	public onfocusout: (event: Event) => void | null = null;
	public onfullscreenchange: (event: Event) => void | null = null;
	public onfullscreenerror: (event: Event) => void | null = null;
	public onkeydown: (event: Event) => void | null = null;
	public onkeyup: (event: Event) => void | null = null;
	public onauxclick: (event: Event) => void | null = null;
	public onclick: (event: Event) => void | null = null;
	public oncontextmenu: (event: Event) => void | null = null;
	public ondblclick: (event: Event) => void | null = null;
	public onmousedown: (event: Event) => void | null = null;
	public onmouseenter: (event: Event) => void | null = null;
	public onmouseleave: (event: Event) => void | null = null;
	public onmousemove: (event: Event) => void | null = null;
	public onmouseout: (event: Event) => void | null = null;
	public onmouseover: (event: Event) => void | null = null;
	public onmouseup: (event: Event) => void | null = null;
	public ontouchcancel: (event: Event) => void | null = null;
	public ontouchend: (event: Event) => void | null = null;
	public ontouchmove: (event: Event) => void | null = null;
	public ontouchstart: (event: Event) => void | null = null;

	// Internal properties
	public [PropertySymbol.children]: HTMLCollection<Element> = new HTMLCollection<Element>();
	public [PropertySymbol.classList]: DOMTokenList = null;
	public [PropertySymbol.isValue]: string | null = null;
	public [PropertySymbol.computedStyle]: CSSStyleDeclaration | null = null;
	public [PropertySymbol.nodeType] = NodeTypeEnum.elementNode;
	public [PropertySymbol.tagName]: string | null = this.constructor[PropertySymbol.tagName] || null;
	public [PropertySymbol.localName]: string | null =
		this.constructor[PropertySymbol.localName] || null;
	public [PropertySymbol.prefix]: string | null = null;
	public [PropertySymbol.shadowRoot]: ShadowRoot | null = null;
	public [PropertySymbol.scrollHeight] = 0;
	public [PropertySymbol.scrollWidth] = 0;
	public [PropertySymbol.scrollTop] = 0;
	public [PropertySymbol.scrollLeft] = 0;
	public [PropertySymbol.attributes]: NamedNodeMap = new ElementNamedNodeMap(this);
	public [PropertySymbol.namespaceURI]: string | null =
		this.constructor[PropertySymbol.namespaceURI] || null;

	/**
	 * Returns tag name.
	 *
	 * @returns Tag name.
	 */
	public get tagName(): string {
		return <string>this[PropertySymbol.tagName];
	}

	/**
	 * Returns prefix.
	 *
	 * @returns Prefix.
	 */
	public get prefix(): string | null {
		return <string>this[PropertySymbol.prefix];
	}

	/**
	 * Returns shadow root.
	 *
	 * @returns Shadow root.
	 */
	public get shadowRoot(): ShadowRoot | null {
		const shadowRoot = this[PropertySymbol.shadowRoot];
		return shadowRoot && shadowRoot[PropertySymbol.mode] === 'open' ? shadowRoot : null;
	}

	/**
	 * Returns scroll height.
	 *
	 * @returns Scroll height.
	 */
	public get scrollHeight(): number {
		return this[PropertySymbol.scrollHeight];
	}

	/**
	 * Returns scroll width.
	 *
	 * @returns Scroll width.
	 */
	public get scrollWidth(): number {
		return this[PropertySymbol.scrollWidth];
	}

	/**
	 * Returns scroll top.
	 *
	 * @returns Scroll top.
	 */
	public get scrollTop(): number {
		return this[PropertySymbol.scrollTop];
	}

	/**
	 * Sets scroll top.
	 *
	 * @param value Scroll top.
	 */
	public set scrollTop(value: number) {
		this[PropertySymbol.scrollTop] = value;
	}

	/**
	 * Returns scroll left.
	 *
	 * @returns Scroll left.
	 */
	public get scrollLeft(): number {
		return this[PropertySymbol.scrollLeft];
	}

	/**
	 * Sets scroll left.
	 *
	 * @param value Scroll left.
	 */
	public set scrollLeft(value: number) {
		this[PropertySymbol.scrollLeft] = value;
	}

	/**
	 * Returns attributes.
	 *
	 * @returns Attributes.
	 */
	public get attributes(): NamedNodeMap {
		return this[PropertySymbol.attributes];
	}

	/**
	 * Returns namespace URI.
	 *
	 * @returns Namespace URI.
	 */
	public get namespaceURI(): string | null {
		return this[PropertySymbol.namespaceURI];
	}

	/**
	 * Returns element children.
	 */
	public get children(): HTMLCollection<Element> {
		return this[PropertySymbol.children];
	}

	/**
	 * Returns class list.
	 *
	 * @returns Class list.
	 */
	public get classList(): DOMTokenList {
		if (!this[PropertySymbol.classList]) {
			this[PropertySymbol.classList] = new DOMTokenList(this, 'class');
		}
		return <DOMTokenList>this[PropertySymbol.classList];
	}

	/**
	 * Returns ID.
	 *
	 * @returns ID.
	 */
	public get id(): string {
		return this.getAttribute('id') || '';
	}

	/**
	 * Sets ID.
	 *
	 * @param id ID.
	 */
	public set id(id: string) {
		this.setAttribute('id', id);
	}

	/**
	 * Returns class name.
	 *
	 * @returns Class name.
	 */
	public get className(): string {
		return this.getAttribute('class') || '';
	}

	/**
	 * Sets class name.
	 *
	 * @param className Class name.
	 */
	public set className(className: string) {
		this.setAttribute('class', className);
	}

	/**
	 * Node name.
	 *
	 * @returns Node name.
	 */
	public get nodeName(): string {
		return this[PropertySymbol.tagName];
	}

	/**
	 * Local name.
	 *
	 * @returns Local name.
	 */
	public get localName(): string {
		return this[PropertySymbol.localName];
	}

	/**
	 * Returns role.
	 *
	 * @returns Role.
	 */
	public get role(): string {
		return this.getAttribute('role') || '';
	}

	/**
	 * Sets role.
	 *
	 * @param role Role.
	 */
	public set role(role: string) {
		this.setAttribute('role', role);
	}

	/**
	 * Previous element sibling.
	 *
	 * @returns Element.
	 */
	public get previousElementSibling(): Element {
		return NonDocumentChildNodeUtility.previousElementSibling(this);
	}

	/**
	 * Next element sibling.
	 *
	 * @returns Element.
	 */
	public get nextElementSibling(): Element {
		return NonDocumentChildNodeUtility.nextElementSibling(this);
	}

	/**
	 * Get text value of children.
	 *
	 * @returns Text content.
	 */
	public get textContent(): string {
		let result = '';
		for (const childNode of this[PropertySymbol.childNodes]) {
			if (
				childNode[PropertySymbol.nodeType] === NodeTypeEnum.elementNode ||
				childNode[PropertySymbol.nodeType] === NodeTypeEnum.textNode
			) {
				result += childNode.textContent;
			}
		}
		return result;
	}

	/**
	 * Sets text content.
	 *
	 * @param textContent Text content.
	 */
	public set textContent(textContent: string) {
		for (const child of this[PropertySymbol.childNodes].slice()) {
			this.removeChild(child);
		}
		if (textContent) {
			this.appendChild(this[PropertySymbol.ownerDocument].createTextNode(textContent));
		}
	}

	/**
	 * Returns inner HTML.
	 *
	 * @returns HTML.
	 */
	public get innerHTML(): string {
		return this.getInnerHTML();
	}

	/**
	 * Sets inner HTML.
	 *
	 * @param html HTML.
	 */
	public set innerHTML(html: string) {
		for (const child of this[PropertySymbol.childNodes].slice()) {
			this.removeChild(child);
		}

		XMLParser.parse(this[PropertySymbol.ownerDocument], html, { rootNode: this });
	}

	/**
	 * Returns outer HTML.
	 *
	 * @returns HTML.
	 */
	public get outerHTML(): string {
		return new XMLSerializer({ escapeEntities: false }).serializeToString(this);
	}

	/**
	 * Returns outer HTML.
	 *
	 * @param html HTML.
	 */
	public set outerHTML(html: string) {
		this.replaceWith(html);
	}

	/**
	 * First element child.
	 *
	 * @returns Element.
	 */
	public get firstElementChild(): Element {
		return this[PropertySymbol.children][0] ?? null;
	}

	/**
	 * Last element child.
	 *
	 * @returns Element.
	 */
	public get lastElementChild(): Element {
		return this[PropertySymbol.children][this[PropertySymbol.children].length - 1] ?? null;
	}

	/**
	 * Last element child.
	 *
	 * @returns Element.
	 */
	public get childElementCount(): number {
		return this[PropertySymbol.children].length;
	}

	/**
	 * Returns slot.
	 *
	 * @returns Slot.
	 */
	public get slot(): string {
		return this.getAttributeNS(null, 'slot') || '';
	}

	/**
	 * Returns slot.
	 *
	 * @param slot Slot.
	 */
	public set slot(title: string) {
		this.setAttribute('slot', title);
	}

	/**
	 * Attribute changed callback.
	 *
	 * @param name Name.
	 * @param oldValue Old value.
	 * @param newValue New value.
	 */
	public attributeChangedCallback?(name: string, oldValue: string, newValue: string): void;

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
	public getInnerHTML(options?: { includeShadowRoots?: boolean }): string {
		const xmlSerializer = new XMLSerializer({
			includeShadowRoots: options && options.includeShadowRoots,
			escapeEntities: false
		});
		let xml = '';
		for (const node of this[PropertySymbol.childNodes]) {
			xml += xmlSerializer.serializeToString(node);
		}
		return xml;
	}

	/**
	 * @override
	 */
	public override [PropertySymbol.cloneNode](deep = false): Element {
		const clone = <Element>super[PropertySymbol.cloneNode](deep);

		clone[PropertySymbol.tagName] = this[PropertySymbol.tagName];
		clone[PropertySymbol.localName] = this[PropertySymbol.localName];
		clone[PropertySymbol.namespaceURI] = this[PropertySymbol.namespaceURI];

		for (let i = 0, max = this[PropertySymbol.attributes].length; i < max; i++) {
			const attribute = this[PropertySymbol.attributes][i];
			clone[PropertySymbol.attributes].setNamedItem(
				Object.assign(
					this[PropertySymbol.ownerDocument].createAttributeNS(
						attribute[PropertySymbol.namespaceURI],
						attribute[PropertySymbol.name]
					),
					attribute
				)
			);
		}

		if (deep) {
			for (const node of clone[PropertySymbol.childNodes]) {
				if (node[PropertySymbol.nodeType] === NodeTypeEnum.elementNode) {
					clone[PropertySymbol.children].push(<Element>node);
				}
			}
		}

		return <Element>clone;
	}

	/**
	 * @override
	 */
	public override [PropertySymbol.appendChild](node: Node): Node {
		// We do not call super here as this will be handled by ElementUtility to improve performance by avoiding validation and other checks.
		return ElementUtility.appendChild(this, node);
	}

	/**
	 * @override
	 */
	public override [PropertySymbol.removeChild](node: Node): Node {
		// We do not call super here as this will be handled by ElementUtility to improve performance by avoiding validation and other checks.
		return ElementUtility.removeChild(this, node);
	}

	/**
	 * @override
	 */
	public override [PropertySymbol.insertBefore](newNode: Node, referenceNode: Node | null): Node {
		// We do not call super here as this will be handled by ElementUtility to improve performance by avoiding validation and other checks.
		return ElementUtility.insertBefore(this, newNode, referenceNode);
	}

	/**
	 * Removes the node from its parent.
	 */
	public remove(): void {
		ChildNodeUtility.remove(this);
	}

	/**
	 * The Node.replaceWith() method replaces this Node in the children list of its parent with a set of Node or DOMString objects.
	 *
	 * @param nodes List of Node or DOMString.
	 */
	public replaceWith(...nodes: (Node | string)[]): void {
		ChildNodeUtility.replaceWith(this, ...nodes);
	}

	/**
	 * Inserts a set of Node or DOMString objects in the children list of this ChildNode's parent, just before this ChildNode. DOMString objects are inserted as equivalent Text nodes.
	 *
	 * @param nodes List of Node or DOMString.
	 */
	public before(...nodes: (string | Node)[]): void {
		ChildNodeUtility.before(this, ...nodes);
	}

	/**
	 * Inserts a set of Node or DOMString objects in the children list of this ChildNode's parent, just after this ChildNode. DOMString objects are inserted as equivalent Text nodes.
	 *
	 * @param nodes List of Node or DOMString.
	 */
	public after(...nodes: (string | Node)[]): void {
		ChildNodeUtility.after(this, ...nodes);
	}

	/**
	 * Inserts a set of Node objects or DOMString objects after the last child of the ParentNode. DOMString objects are inserted as equivalent Text nodes.
	 *
	 * @param nodes List of Node or DOMString.
	 */
	public append(...nodes: (string | Node)[]): void {
		ParentNodeUtility.append(this, ...nodes);
	}

	/**
	 * Inserts a set of Node objects or DOMString objects before the first child of the ParentNode. DOMString objects are inserted as equivalent Text nodes.
	 *
	 * @param nodes List of Node or DOMString.
	 */
	public prepend(...nodes: (string | Node)[]): void {
		ParentNodeUtility.prepend(this, ...nodes);
	}

	/**
	 * Replaces the existing children of a node with a specified new set of children.
	 *
	 * @param nodes List of Node or DOMString.
	 */
	public replaceChildren(...nodes: (string | Node)[]): void {
		ParentNodeUtility.replaceChildren(this, ...nodes);
	}

	/**
	 * Inserts a node to the given position.
	 *
	 * @param position Position to insert element.
	 * @param element Node to insert.
	 * @returns Inserted node or null if couldn't insert.
	 */
	public insertAdjacentElement(position: InsertAdjacentPosition, element: Node): Node | null {
		if (position === 'beforebegin') {
			if (!this.parentElement) {
				return null;
			}

			this.parentElement.insertBefore(element, this);
		} else if (position === 'afterbegin') {
			this.insertBefore(element, this.firstChild);
		} else if (position === 'beforeend') {
			this.appendChild(element);
		} else if (position === 'afterend') {
			if (!this.parentElement) {
				return null;
			}

			this.parentElement.insertBefore(element, this.nextSibling);
		}

		return element;
	}

	/**
	 * Inserts an HTML string to the given position.
	 *
	 * @param position Position to insert text.
	 * @param text HTML string to insert.
	 */
	public insertAdjacentHTML(position: InsertAdjacentPosition, text: string): void {
		for (const node of (<DocumentFragment>(
			XMLParser.parse(this[PropertySymbol.ownerDocument], text)
		))[PropertySymbol.childNodes].slice()) {
			this.insertAdjacentElement(position, node);
		}
	}

	/**
	 * Inserts text to the given position.
	 *
	 * @param position Position to insert text.
	 * @param text String to insert.
	 */
	public insertAdjacentText(position: InsertAdjacentPosition, text: string): void {
		if (!text) {
			return;
		}
		const textNode = <Text>this[PropertySymbol.ownerDocument].createTextNode(text);
		this.insertAdjacentElement(position, textNode);
	}

	/**
	 * Sets an attribute.
	 *
	 * @param name Name.
	 * @param value Value.
	 */
	public setAttribute(name: string, value: string): void {
		const attribute = this[PropertySymbol.ownerDocument].createAttributeNS(null, name);
		attribute[PropertySymbol.value] = String(value);
		this.setAttributeNode(attribute);
	}

	/**
	 * Sets a namespace attribute.
	 *
	 * @param namespaceURI Namespace URI.
	 * @param name Name.
	 * @param value Value.
	 */
	public setAttributeNS(namespaceURI: string, name: string, value: string): void {
		const attribute = this[PropertySymbol.ownerDocument].createAttributeNS(namespaceURI, name);
		attribute[PropertySymbol.value] = String(value);
		this.setAttributeNode(attribute);
	}

	/**
	 * Returns attribute names.
	 *
	 * @returns Attribute names.
	 */
	public getAttributeNames(): string[] {
		const attributeNames = [];
		for (let i = 0, max = this[PropertySymbol.attributes].length; i < max; i++) {
			attributeNames.push(this[PropertySymbol.attributes][i][PropertySymbol.name]);
		}
		return attributeNames;
	}

	/**
	 * Returns attribute value.
	 *
	 * @param name Name.
	 */
	public getAttribute(name: string): string {
		const attribute = this.getAttributeNode(name);
		if (attribute) {
			return attribute[PropertySymbol.value];
		}
		return null;
	}

	/**
	 * Toggle an attribute.
	 * Returns `true` if attribute name is eventually present, and `false` otherwise.
	 *
	 * @param name A DOMString specifying the name of the attribute to be toggled.
	 * @param force A boolean value to determine whether the attribute should be added or removed, no matter whether the attribute is present or not at the moment.
	 */
	public toggleAttribute(name: string, force?: boolean): boolean {
		name = name.toLowerCase();
		const attribute = this.getAttributeNode(name);
		if (attribute) {
			if (force === true) {
				return true;
			}
			this.removeAttributeNode(attribute);
			return false;
		}
		if (force === false) {
			return false;
		}
		this.setAttribute(name, '');
		return true;
	}

	/**
	 * Returns namespace attribute value.
	 *
	 * @param namespace Namespace URI.
	 * @param localName Local name.
	 */
	public getAttributeNS(namespace: string | null, localName: string): string {
		const attribute = this.getAttributeNodeNS(namespace, localName);
		if (attribute) {
			return attribute[PropertySymbol.value];
		}
		return null;
	}

	/**
	 * Returns a boolean value indicating whether the specified element has the attribute or not.
	 *
	 * @param name Attribute name.
	 * @returns True if attribute exists, false otherwise.
	 */
	public hasAttribute(name: string): boolean {
		return !!this.getAttributeNode(name);
	}

	/**
	 * Returns a boolean value indicating whether the specified element has the namespace attribute or not.
	 *
	 * @param namespace Namespace URI.
	 * @param localName Local name.
	 * @returns True if attribute exists, false otherwise.
	 */
	public hasAttributeNS(namespace: string | null, localName: string): boolean {
		return this[PropertySymbol.attributes].getNamedItemNS(namespace, localName) !== null;
	}

	/**
	 * Returns "true" if the element has attributes.
	 *
	 * @returns "true" if the element has attributes.
	 */
	public hasAttributes(): boolean {
		return this[PropertySymbol.attributes].length > 0;
	}

	/**
	 * Removes an attribute.
	 *
	 * @param name Name.
	 */
	public removeAttribute(name: string): void {
		try {
			this[PropertySymbol.attributes].removeNamedItem(name);
		} catch (error) {
			// Ignore DOMException when the attribute does not exist.
		}
	}

	/**
	 * Removes a namespace attribute.
	 *
	 * @param namespace Namespace URI.
	 * @param localName Local name.
	 */
	public removeAttributeNS(namespace: string | null, localName: string): void {
		this[PropertySymbol.attributes].removeNamedItemNS(namespace, localName);
	}

	/**
	 * Attaches a shadow root.
	 *
	 * @param init Shadow root init.
	 * @param init.mode Shadow root mode.
	 * @returns Shadow root.
	 */
	public attachShadow(init: { mode: string }): ShadowRoot {
		if (this[PropertySymbol.shadowRoot]) {
			throw new DOMException('Shadow root has already been attached.');
		}

		const shadowRoot = NodeFactory.createNode<ShadowRoot>(
			this[PropertySymbol.ownerDocument],
			this[PropertySymbol.ownerDocument][PropertySymbol.ownerWindow].ShadowRoot
		);

		this[PropertySymbol.shadowRoot] = shadowRoot;

		shadowRoot[PropertySymbol.host] = this;
		shadowRoot[PropertySymbol.mode] = init.mode;
		(<ShadowRoot>shadowRoot)[PropertySymbol.connectToNode](this);

		return this[PropertySymbol.shadowRoot];
	}

	/**
	 * Converts to string.
	 *
	 * @returns String.
	 */
	public toString(): string {
		return this.outerHTML;
	}

	/**
	 * Returns the size of an element and its position relative to the viewport.
	 *
	 * @returns DOM rect.
	 */
	public getBoundingClientRect(): DOMRect {
		// TODO: Not full implementation
		return new DOMRect();
	}

	/**
	 * Returns a collection of DOMRect objects that indicate the bounding rectangles for each CSS border box in a client.
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/getClientRects
	 * @returns DOM rect list.
	 */
	public getClientRects(): DOMRectList {
		// TODO: Not full implementation
		const domRectList = new DOMRectList();
		domRectList.push(this.getBoundingClientRect());
		return domRectList;
	}

	/**
	 * The matches() method checks to see if the Element would be selected by the provided selectorString.
	 *
	 * @param selector Selector.
	 * @returns "true" if matching.
	 */
	public matches(selector: string): boolean {
		return !!QuerySelector.matches(this, selector);
	}

	/**
	 * Traverses the Element and its parents (heading toward the document root) until it finds a node that matches the provided selector string.
	 *
	 * @param selector Selector.
	 * @returns Closest matching element.
	 */
	public closest(selector: string): Element {
		// eslint-disable-next-line
		let parent: Element = this;

		while (parent) {
			if (QuerySelector.matches(parent, selector)) {
				return parent;
			}
			parent = parent.parentElement;
		}

		return null;
	}

	/**
	 * Query CSS selector to find matching nodes.
	 *
	 * @param selector CSS selector.
	 * @returns Matching elements.
	 */
	public querySelectorAll<K extends keyof IHTMLElementTagNameMap>(
		selector: K
	): NodeList<IHTMLElementTagNameMap[K]>;

	/**
	 * Query CSS selector to find matching elments.
	 *
	 * @param selector CSS selector.
	 * @returns Matching elements.
	 */
	public querySelectorAll<K extends keyof ISVGElementTagNameMap>(
		selector: K
	): NodeList<ISVGElementTagNameMap[K]>;

	/**
	 * Query CSS selector to find matching elments.
	 *
	 * @param selector CSS selector.
	 * @returns Matching elements.
	 */
	public querySelectorAll(selector: string): NodeList<Element>;

	/**
	 * Query CSS selector to find matching elments.
	 *
	 * @param selector CSS selector.
	 * @returns Matching elements.
	 */
	public querySelectorAll(selector: string): NodeList<Element> {
		return QuerySelector.querySelectorAll(this, selector);
	}

	/**
	 * Query CSS Selector to find matching node.
	 *
	 * @param selector CSS selector.
	 * @returns Matching element.
	 */
	public querySelector<K extends keyof IHTMLElementTagNameMap>(
		selector: K
	): IHTMLElementTagNameMap[K] | null;

	/**
	 * Query CSS Selector to find matching node.
	 *
	 * @param selector CSS selector.
	 * @returns Matching element.
	 */
	public querySelector<K extends keyof ISVGElementTagNameMap>(
		selector: K
	): ISVGElementTagNameMap[K] | null;

	/**
	 * Query CSS Selector to find matching node.
	 *
	 * @param selector CSS selector.
	 * @returns Matching element.
	 */
	public querySelector(selector: string): Element | null;

	/**
	 * Query CSS Selector to find matching node.
	 *
	 * @param selector CSS selector.
	 * @returns Matching element.
	 */
	public querySelector(selector: string): Element | null {
		return QuerySelector.querySelector(this, selector);
	}

	/**
	 * Returns an elements by class name.
	 *
	 * @param className Tag name.
	 * @returns Matching element.
	 */
	public getElementsByClassName(className: string): HTMLCollection<Element> {
		return ParentNodeUtility.getElementsByClassName(this, className);
	}

	/**
	 * Returns an elements by tag name.
	 *
	 * @param tagName Tag name.
	 * @returns Matching element.
	 */
	public getElementsByTagName<K extends keyof IHTMLElementTagNameMap>(
		tagName: K
	): HTMLCollection<IHTMLElementTagNameMap[K]>;

	/**
	 * Returns an elements by tag name.
	 *
	 * @param tagName Tag name.
	 * @returns Matching element.
	 */
	public getElementsByTagName<K extends keyof ISVGElementTagNameMap>(
		tagName: K
	): HTMLCollection<ISVGElementTagNameMap[K]>;

	/**
	 * Returns an elements by tag name.
	 *
	 * @param tagName Tag name.
	 * @returns Matching element.
	 */
	public getElementsByTagName(tagName: string): HTMLCollection<Element>;

	/**
	 * Returns an elements by tag name.
	 *
	 * @param tagName Tag name.
	 * @returns Matching element.
	 */
	public getElementsByTagName(tagName: string): HTMLCollection<Element> {
		return ParentNodeUtility.getElementsByTagName(this, tagName);
	}

	/**
	 * Returns an elements by tag name and namespace.
	 *
	 * @param namespaceURI Namespace URI.
	 * @param tagName Tag name.
	 * @returns Matching element.
	 */
	public getElementsByTagNameNS<K extends keyof IHTMLElementTagNameMap>(
		namespaceURI: 'http://www.w3.org/1999/xhtml',
		tagName: K
	): HTMLCollection<IHTMLElementTagNameMap[K]>;

	/**
	 * Returns an elements by tag name and namespace.
	 *
	 * @param namespaceURI Namespace URI.
	 * @param tagName Tag name.
	 * @returns Matching element.
	 */
	public getElementsByTagNameNS<K extends keyof ISVGElementTagNameMap>(
		namespaceURI: 'http://www.w3.org/2000/svg',
		tagName: K
	): HTMLCollection<ISVGElementTagNameMap[K]>;

	/**
	 * Returns an elements by tag name and namespace.
	 *
	 * @param namespaceURI Namespace URI.
	 * @param tagName Tag name.
	 * @returns Matching element.
	 */
	public getElementsByTagNameNS(namespaceURI: string, tagName: string): HTMLCollection<Element>;

	/**
	 * Returns an elements by tag name and namespace.
	 *
	 * @param namespaceURI Namespace URI.
	 * @param tagName Tag name.
	 * @returns Matching element.
	 */
	public getElementsByTagNameNS(namespaceURI: string, tagName: string): HTMLCollection<Element> {
		return ParentNodeUtility.getElementsByTagNameNS(this, namespaceURI, tagName);
	}

	/**
	 * The setAttributeNode() method adds a new Attr node to the specified element.
	 *
	 * @param attribute Attribute.
	 * @returns Replaced attribute.
	 */
	public setAttributeNode(attribute: Attr): Attr | null {
		return this[PropertySymbol.attributes].setNamedItem(attribute);
	}

	/**
	 * The setAttributeNodeNS() method adds a new Attr node to the specified element.
	 *
	 * @param attribute Attribute.
	 * @returns Replaced attribute.
	 */
	public setAttributeNodeNS(attribute: Attr): Attr | null {
		return this[PropertySymbol.attributes].setNamedItemNS(attribute);
	}

	/**
	 * Returns an Attr node.
	 *
	 * @param name Name.
	 * @returns Replaced attribute.
	 */
	public getAttributeNode(name: string): Attr | null {
		return this[PropertySymbol.attributes].getNamedItem(name);
	}

	/**
	 * Returns a namespaced Attr node.
	 *
	 * @param namespace Namespace.
	 * @param localName Name.
	 * @returns Replaced attribute.
	 */
	public getAttributeNodeNS(namespace: string | null, localName: string): Attr | null {
		return this[PropertySymbol.attributes].getNamedItemNS(namespace, localName);
	}

	/**
	 * Removes an Attr node.
	 *
	 * @param attribute Attribute.
	 * @returns Removed attribute.
	 */
	public removeAttributeNode(attribute: Attr): Attr | null {
		return this[PropertySymbol.attributes].removeNamedItem(attribute[PropertySymbol.name]);
	}

	/**
	 * Removes an Attr node.
	 *
	 * @param attribute Attribute.
	 * @returns Removed attribute.
	 */
	public removeAttributeNodeNS(attribute: Attr): Attr | null {
		return this[PropertySymbol.attributes].removeNamedItemNS(
			attribute[PropertySymbol.namespaceURI],
			attribute.localName
		);
	}

	/**
	 * Scrolls to a particular set of coordinates.
	 *
	 * @param x X position or options object.
	 * @param y Y position.
	 */
	public scroll(x: { top?: number; left?: number; behavior?: string } | number, y?: number): void {
		if (typeof x === 'object') {
			if (x.behavior === 'smooth') {
				this[PropertySymbol.ownerDocument][PropertySymbol.ownerWindow].setTimeout(() => {
					if (x.top !== undefined) {
						(<number>this.scrollTop) = x.top;
					}
					if (x.left !== undefined) {
						(<number>this.scrollLeft) = x.left;
					}
				});
			} else {
				if (x.top !== undefined) {
					(<number>this.scrollTop) = x.top;
				}
				if (x.left !== undefined) {
					(<number>this.scrollLeft) = x.left;
				}
			}
		} else if (x !== undefined && y !== undefined) {
			(<number>this.scrollLeft) = x;
			(<number>this.scrollTop) = y;
		}
	}

	/**
	 * Scrolls to a particular set of coordinates.
	 *
	 * @param x X position or options object.
	 * @param y Y position.
	 */
	public scrollTo(
		x: { top?: number; left?: number; behavior?: string } | number,
		y?: number
	): void {
		this.scroll(x, y);
	}

	/**
	 * Scrolls the element's ancestor containers such that the element on which scrollIntoView() is called is visible to the user.
	 *
	 * @param [_options] Options.
	 */
	public scrollIntoView(
		_options?:
			| boolean
			| {
					behavior?: 'smooth' | 'instant' | 'auto';
					block?: 'start' | 'center' | 'end' | 'nearest';
					inline?: 'start' | 'center' | 'end' | 'nearest';
			  }
	): void {
		// Do nothing
	}

	/**
	 * @override
	 */
	public override dispatchEvent(event: Event): boolean {
		const returnValue = super.dispatchEvent(event);
		const browserSettings = WindowBrowserSettingsReader.getSettings(
			this[PropertySymbol.ownerDocument][PropertySymbol.ownerWindow]
		);

		if (
			browserSettings &&
			!browserSettings.disableJavaScriptEvaluation &&
			(event.eventPhase === EventPhaseEnum.atTarget ||
				event.eventPhase === EventPhaseEnum.bubbling) &&
			!event[PropertySymbol.immediatePropagationStopped]
		) {
			const attribute = this.getAttribute('on' + event.type);

			if (attribute && !event[PropertySymbol.immediatePropagationStopped]) {
				const code = `//# sourceURL=${
					this[PropertySymbol.ownerDocument][PropertySymbol.ownerWindow].location.href
				}\n${attribute}`;

				if (
					browserSettings.disableErrorCapturing ||
					browserSettings.errorCapture !== BrowserErrorCaptureEnum.tryAndCatch
				) {
					this[PropertySymbol.ownerDocument][PropertySymbol.ownerWindow].eval(code);
				} else {
					WindowErrorUtility.captureError(
						this[PropertySymbol.ownerDocument][PropertySymbol.ownerWindow],
						() => this[PropertySymbol.ownerDocument][PropertySymbol.ownerWindow].eval(code)
					);
				}
			}
		}

		return returnValue;
	}
}
