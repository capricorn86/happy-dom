import Node from '../node/Node.js';
import ShadowRoot from '../shadow-root/ShadowRoot.js';
import Attr from '../attr/Attr.js';
import DOMRect from './DOMRect.js';
import DOMTokenList from '../../dom-token-list/DOMTokenList.js';
import IDOMTokenList from '../../dom-token-list/IDOMTokenList.js';
import QuerySelector from '../../query-selector/QuerySelector.js';
import NamespaceURI from '../../config/NamespaceURI.js';
import XMLParser from '../../xml-parser/XMLParser.js';
import XMLSerializer from '../../xml-serializer/XMLSerializer.js';
import ChildNodeUtility from '../child-node/ChildNodeUtility.js';
import ParentNodeUtility from '../parent-node/ParentNodeUtility.js';
import NonDocumentChildNodeUtility from '../child-node/NonDocumentChildNodeUtility.js';
import IElement from './IElement.js';
import DOMException from '../../exception/DOMException.js';
import IShadowRoot from '../shadow-root/IShadowRoot.js';
import INode from '../node/INode.js';
import IDocument from '../document/IDocument.js';
import IHTMLCollection from './IHTMLCollection.js';
import INodeList from '../node/INodeList.js';
import { TInsertAdjacentPositions } from './IElement.js';
import IText from '../text/IText.js';
import IDOMRectList from './IDOMRectList.js';
import DOMRectListFactory from './DOMRectListFactory.js';
import IAttr from '../attr/IAttr.js';
import INamedNodeMap from '../../named-node-map/INamedNodeMap.js';
import Event from '../../event/Event.js';
import ElementUtility from './ElementUtility.js';
import HTMLCollection from './HTMLCollection.js';
import EventPhaseEnum from '../../event/EventPhaseEnum.js';
import CSSStyleDeclaration from '../../css/declaration/CSSStyleDeclaration.js';
import DocumentFragment from '../document-fragment/DocumentFragment.js';
import ElementNamedNodeMap from './ElementNamedNodeMap.js';
import WindowErrorUtility from '../../window/WindowErrorUtility.js';

/**
 * Element.
 */
export default class Element extends Node implements IElement {
	// ObservedAttributes should only be called once by CustomElementRegistry (see #117)
	// CustomElementRegistry will therefore populate _observedAttributes when CustomElementRegistry.define() is called
	public static _observedAttributes: string[];
	public static observedAttributes: string[];
	public tagName: string = null;
	public nodeType = Node.ELEMENT_NODE;
	public shadowRoot: IShadowRoot | null = null;
	public prefix: string = null;

	public scrollHeight = 0;
	public scrollWidth = 0;
	public scrollTop = 0;
	public scrollLeft = 0;
	public readonly namespaceURI: string = null;

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

	public readonly _children: IHTMLCollection<IElement> = new HTMLCollection<IElement>();

	// Used for being able to access closed shadow roots
	public _shadowRoot: IShadowRoot = null;
	public readonly attributes: INamedNodeMap = new ElementNamedNodeMap(this);

	public _classList: DOMTokenList = null;
	public _isValue?: string | null = null;
	public _computedStyle: CSSStyleDeclaration | null = null;

	/**
	 * Returns element children.
	 */
	public get children(): IHTMLCollection<IElement> {
		return this._children;
	}

	/**
	 * Returns class list.
	 *
	 * @returns Class list.
	 */
	public get classList(): IDOMTokenList {
		if (!this._classList) {
			this._classList = new DOMTokenList(this, 'class');
		}
		return <IDOMTokenList>this._classList;
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
		return this.tagName;
	}

	/**
	 * Local name.
	 *
	 * @returns Local name.
	 */
	public get localName(): string {
		return this.tagName ? this.tagName.toLowerCase() : 'unknown';
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
	public get previousElementSibling(): IElement {
		return NonDocumentChildNodeUtility.previousElementSibling(this);
	}

	/**
	 * Next element sibling.
	 *
	 * @returns Element.
	 */
	public get nextElementSibling(): IElement {
		return NonDocumentChildNodeUtility.nextElementSibling(this);
	}

	/**
	 * Get text value of children.
	 *
	 * @returns Text content.
	 */
	public get textContent(): string {
		let result = '';
		for (const childNode of this._childNodes) {
			if (childNode.nodeType === Node.ELEMENT_NODE || childNode.nodeType === Node.TEXT_NODE) {
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
		for (const child of this._childNodes.slice()) {
			this.removeChild(child);
		}
		if (textContent) {
			this.appendChild(this.ownerDocument.createTextNode(textContent));
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
		for (const child of this._childNodes.slice()) {
			this.removeChild(child);
		}

		XMLParser.parse(this.ownerDocument, html, { rootNode: this });
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
	public get firstElementChild(): IElement {
		return this._children[0] ?? null;
	}

	/**
	 * Last element child.
	 *
	 * @returns Element.
	 */
	public get lastElementChild(): IElement {
		return this._children[this._children.length - 1] ?? null;
	}

	/**
	 * Last element child.
	 *
	 * @returns Element.
	 */
	public get childElementCount(): number {
		return this._children.length;
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
		for (const node of this._childNodes) {
			xml += xmlSerializer.serializeToString(node);
		}
		return xml;
	}

	/**
	 * Clones a node.
	 *
	 * @override
	 * @param [deep=false] "true" to clone deep.
	 * @returns Cloned node.
	 */
	public cloneNode(deep = false): IElement {
		const clone = <Element>super.cloneNode(deep);

		Attr._ownerDocument = this.ownerDocument;

		for (let i = 0, max = this.attributes.length; i < max; i++) {
			const attribute = this.attributes[i];
			clone.attributes.setNamedItem(Object.assign(new Attr(), attribute));
		}

		if (deep) {
			for (const node of clone._childNodes) {
				if (node.nodeType === Node.ELEMENT_NODE) {
					clone._children.push(<IElement>node);
				}
			}
		}

		(<string>clone.tagName) = this.tagName;
		(<string>clone.namespaceURI) = this.namespaceURI;

		return <IElement>clone;
	}

	/**
	 * @override
	 */
	public override appendChild(node: INode): INode {
		// We do not call super here as this will be handled by ElementUtility to improve performance by avoiding validation and other checks.
		return ElementUtility.appendChild(this, node);
	}

	/**
	 * @override
	 */
	public override removeChild(node: INode): INode {
		// We do not call super here as this will be handled by ElementUtility to improve performance by avoiding validation and other checks.
		return ElementUtility.removeChild(this, node);
	}

	/**
	 * @override
	 */
	public override insertBefore(newNode: INode, referenceNode: INode | null): INode {
		if (arguments.length < 2) {
			throw new TypeError(
				`Failed to execute 'insertBefore' on 'Node': 2 arguments required, but only ${arguments.length} present.`
			);
		}

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
	public replaceWith(...nodes: (INode | string)[]): void {
		ChildNodeUtility.replaceWith(this, ...nodes);
	}

	/**
	 * Inserts a set of Node or DOMString objects in the children list of this ChildNode's parent, just before this ChildNode. DOMString objects are inserted as equivalent Text nodes.
	 *
	 * @param nodes List of Node or DOMString.
	 */
	public before(...nodes: (string | INode)[]): void {
		ChildNodeUtility.before(this, ...nodes);
	}

	/**
	 * Inserts a set of Node or DOMString objects in the children list of this ChildNode's parent, just after this ChildNode. DOMString objects are inserted as equivalent Text nodes.
	 *
	 * @param nodes List of Node or DOMString.
	 */
	public after(...nodes: (string | INode)[]): void {
		ChildNodeUtility.after(this, ...nodes);
	}

	/**
	 * Inserts a set of Node objects or DOMString objects after the last child of the ParentNode. DOMString objects are inserted as equivalent Text nodes.
	 *
	 * @param nodes List of Node or DOMString.
	 */
	public append(...nodes: (string | INode)[]): void {
		ParentNodeUtility.append(this, ...nodes);
	}

	/**
	 * Inserts a set of Node objects or DOMString objects before the first child of the ParentNode. DOMString objects are inserted as equivalent Text nodes.
	 *
	 * @param nodes List of Node or DOMString.
	 */
	public prepend(...nodes: (string | INode)[]): void {
		ParentNodeUtility.prepend(this, ...nodes);
	}

	/**
	 * Replaces the existing children of a node with a specified new set of children.
	 *
	 * @param nodes List of Node or DOMString.
	 */
	public replaceChildren(...nodes: (string | INode)[]): void {
		ParentNodeUtility.replaceChildren(this, ...nodes);
	}

	/**
	 * Inserts a node to the given position.
	 *
	 * @param position Position to insert element.
	 * @param element Node to insert.
	 * @returns Inserted node or null if couldn't insert.
	 */
	public insertAdjacentElement(position: TInsertAdjacentPositions, element: INode): INode | null {
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
	public insertAdjacentHTML(position: TInsertAdjacentPositions, text: string): void {
		for (const node of (<DocumentFragment>(
			XMLParser.parse(this.ownerDocument, text)
		))._childNodes.slice()) {
			this.insertAdjacentElement(position, node);
		}
	}

	/**
	 * Inserts text to the given position.
	 *
	 * @param position Position to insert text.
	 * @param text String to insert.
	 */
	public insertAdjacentText(position: TInsertAdjacentPositions, text: string): void {
		if (!text) {
			return;
		}
		const textNode = <IText>this.ownerDocument.createTextNode(text);
		this.insertAdjacentElement(position, textNode);
	}

	/**
	 * Sets an attribute.
	 *
	 * @param name Name.
	 * @param value Value.
	 */
	public setAttribute(name: string, value: string): void {
		const attribute = this.ownerDocument.createAttributeNS(null, name);
		attribute.value = String(value);
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
		const attribute = this.ownerDocument.createAttributeNS(namespaceURI, name);
		attribute.value = String(value);
		this.setAttributeNode(attribute);
	}

	/**
	 * Returns attribute names.
	 *
	 * @returns Attribute names.
	 */
	public getAttributeNames(): string[] {
		const attributeNames = [];
		for (let i = 0, max = this.attributes.length; i < max; i++) {
			attributeNames.push(this.attributes[i].name);
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
			return attribute.value;
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
			return attribute.value;
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
		return this.attributes.getNamedItemNS(namespace, localName) !== null;
	}

	/**
	 * Returns "true" if the element has attributes.
	 *
	 * @returns "true" if the element has attributes.
	 */
	public hasAttributes(): boolean {
		return this.attributes.length > 0;
	}

	/**
	 * Removes an attribute.
	 *
	 * @param name Name.
	 */
	public removeAttribute(name: string): void {
		try {
			this.attributes.removeNamedItem(name);
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
		this.attributes.removeNamedItemNS(namespace, localName);
	}

	/**
	 * Attaches a shadow root.
	 *
	 * @param _shadowRootInit Shadow root init.
	 * @param shadowRootInit
	 * @param shadowRootInit.mode
	 * @returns Shadow root.
	 */
	public attachShadow(shadowRootInit: { mode: string }): IShadowRoot {
		if (this._shadowRoot) {
			throw new DOMException('Shadow root has already been attached.');
		}

		(<IShadowRoot>this._shadowRoot) = new ShadowRoot();
		(<IDocument>this._shadowRoot.ownerDocument) = this.ownerDocument;
		(<Element>this._shadowRoot.host) = this;
		(<string>this._shadowRoot.mode) = shadowRootInit.mode;
		(<ShadowRoot>this._shadowRoot)._connectToNode(this);

		if (this._shadowRoot.mode === 'open') {
			(<IShadowRoot>this.shadowRoot) = this._shadowRoot;
		}

		return this._shadowRoot;
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
	public getClientRects(): IDOMRectList<DOMRect> {
		// TODO: Not full implementation
		return DOMRectListFactory.create([this.getBoundingClientRect()]);
	}

	/**
	 * The matches() method checks to see if the Element would be selected by the provided selectorString.
	 *
	 * @param selector Selector.
	 * @returns "true" if matching.
	 */
	public matches(selector: string): boolean {
		return !!QuerySelector.match(this, selector);
	}

	/**
	 * Traverses the Element and its parents (heading toward the document root) until it finds a node that matches the provided selector string.
	 *
	 * @param selector Selector.
	 * @returns Closest matching element.
	 */
	public closest(selector: string): IElement {
		// eslint-disable-next-line
		let parent: IElement = this;

		while (parent) {
			if (QuerySelector.match(parent, selector)) {
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
	public querySelectorAll(selector: string): INodeList<IElement> {
		return QuerySelector.querySelectorAll(this, selector);
	}

	/**
	 * Query CSS Selector to find matching node.
	 *
	 * @param selector CSS selector.
	 * @returns Matching element.
	 */
	public querySelector(selector: string): IElement {
		return QuerySelector.querySelector(this, selector);
	}

	/**
	 * Returns an elements by class name.
	 *
	 * @param className Tag name.
	 * @returns Matching element.
	 */
	public getElementsByClassName(className: string): IHTMLCollection<IElement> {
		return ParentNodeUtility.getElementsByClassName(this, className);
	}

	/**
	 * Returns an elements by tag name.
	 *
	 * @param tagName Tag name.
	 * @returns Matching element.
	 */
	public getElementsByTagName(tagName: string): IHTMLCollection<IElement> {
		return ParentNodeUtility.getElementsByTagName(this, tagName);
	}

	/**
	 * Returns an elements by tag name and namespace.
	 *
	 * @param namespaceURI Namespace URI.
	 * @param tagName Tag name.
	 * @returns Matching element.
	 */
	public getElementsByTagNameNS(namespaceURI: string, tagName: string): IHTMLCollection<IElement> {
		return ParentNodeUtility.getElementsByTagNameNS(this, namespaceURI, tagName);
	}

	/**
	 * The setAttributeNode() method adds a new Attr node to the specified element.
	 *
	 * @param attribute Attribute.
	 * @returns Replaced attribute.
	 */
	public setAttributeNode(attribute: IAttr): IAttr | null {
		return this.attributes.setNamedItem(attribute);
	}

	/**
	 * The setAttributeNodeNS() method adds a new Attr node to the specified element.
	 *
	 * @param attribute Attribute.
	 * @returns Replaced attribute.
	 */
	public setAttributeNodeNS(attribute: IAttr): IAttr | null {
		return this.attributes.setNamedItemNS(attribute);
	}

	/**
	 * Returns an Attr node.
	 *
	 * @param name Name.
	 * @returns Replaced attribute.
	 */
	public getAttributeNode(name: string): IAttr | null {
		return this.attributes.getNamedItem(name);
	}

	/**
	 * Returns a namespaced Attr node.
	 *
	 * @param namespace Namespace.
	 * @param localName Name.
	 * @returns Replaced attribute.
	 */
	public getAttributeNodeNS(namespace: string | null, localName: string): IAttr | null {
		return this.attributes.getNamedItemNS(namespace, localName);
	}

	/**
	 * Removes an Attr node.
	 *
	 * @param attribute Attribute.
	 * @returns Removed attribute.
	 */
	public removeAttributeNode(attribute: IAttr): IAttr | null {
		return this.attributes.removeNamedItem(attribute.name);
	}

	/**
	 * Removes an Attr node.
	 *
	 * @param attribute Attribute.
	 * @returns Removed attribute.
	 */
	public removeAttributeNodeNS(attribute: IAttr): IAttr | null {
		return this.attributes.removeNamedItemNS(attribute.namespaceURI, attribute.localName);
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
				this.ownerDocument.defaultView.setTimeout(() => {
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
	 * @override
	 */
	public override dispatchEvent(event: Event): boolean {
		const returnValue = super.dispatchEvent(event);

		if (
			(event.eventPhase === EventPhaseEnum.atTarget ||
				event.eventPhase === EventPhaseEnum.bubbling) &&
			!event._immediatePropagationStopped
		) {
			const attribute = this.getAttribute('on' + event.type);

			if (attribute && !event._immediatePropagationStopped) {
				if (this.ownerDocument.defaultView.happyDOM.settings.disableErrorCapturing) {
					this.ownerDocument.defaultView.eval(attribute);
				} else {
					WindowErrorUtility.captureError(this.ownerDocument.defaultView, () =>
						this.ownerDocument.defaultView.eval(attribute)
					);
				}
			}
		}

		return returnValue;
	}

	/**
	 * Returns attribute name.
	 *
	 * @param name Name.
	 * @returns Attribute name based on namespace.
	 */
	protected _getAttributeName(name): string {
		if (this.namespaceURI === NamespaceURI.svg) {
			return name;
		}
		return name.toLowerCase();
	}
}
