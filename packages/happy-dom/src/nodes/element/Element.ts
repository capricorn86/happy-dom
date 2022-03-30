import Node from '../node/Node';
import ShadowRoot from '../shadow-root/ShadowRoot';
import Attr from '../../attribute/Attr';
import DOMRect from './DOMRect';
import Range from './Range';
import DOMTokenList from '../../dom-token-list/DOMTokenList';
import IDOMTokenList from '../../dom-token-list/IDOMTokenList';
import QuerySelector from '../../query-selector/QuerySelector';
import SelectorItem from '../../query-selector/SelectorItem';
import MutationRecord from '../../mutation-observer/MutationRecord';
import MutationTypeEnum from '../../mutation-observer/MutationTypeEnum';
import NamespaceURI from '../../config/NamespaceURI';
import XMLParser from '../../xml-parser/XMLParser';
import XMLSerializer from '../../xml-serializer/XMLSerializer';
import ChildNodeUtility from '../child-node/ChildNodeUtility';
import ParentNodeUtility from '../parent-node/ParentNodeUtility';
import NonDocumentChildNodeUtility from '../child-node/NonDocumentChildNodeUtility';
import IElement from './IElement';
import DOMException from '../../exception/DOMException';
import IShadowRoot from '../shadow-root/IShadowRoot';
import INode from '../node/INode';
import IDocument from '../document/IDocument';
import IHTMLCollection from './IHTMLCollection';
import INodeList from '../node/INodeList';
import HTMLCollectionFactory from './HTMLCollectionFactory';
import { TInsertAdjacentPositions } from './IElement';
import IText from '../text/IText';

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
	public shadowRoot: IShadowRoot = null;

	public scrollTop = 0;
	public scrollLeft = 0;
	public children: IHTMLCollection<IElement> = HTMLCollectionFactory.create();
	public readonly namespaceURI: string = null;

	// Used for being able to access closed shadow roots
	public _shadowRoot: IShadowRoot = null;
	public _attributes: { [k: string]: Attr } = {};

	private _classList: DOMTokenList = null;

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
		for (const childNode of this.childNodes) {
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
		for (const child of this.childNodes.slice()) {
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
		const xmlSerializer = new XMLSerializer();
		let xml = '';
		for (const node of this.childNodes) {
			xml += xmlSerializer.serializeToString(node);
		}
		return xml;
	}

	/**
	 * Sets inner HTML.
	 *
	 * @param html HTML.
	 */
	public set innerHTML(html: string) {
		for (const child of this.childNodes.slice()) {
			this.removeChild(child);
		}

		for (const node of XMLParser.parse(this.ownerDocument, html).childNodes.slice()) {
			this.appendChild(node);
		}
	}

	/**
	 * Returns outer HTML.
	 *
	 * @returns HTML.
	 */
	public get outerHTML(): string {
		return new XMLSerializer().serializeToString(this);
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
	 * Returns attributes.
	 *
	 * @returns Attributes.
	 */
	public get attributes(): { [k: string]: Attr | number } {
		const attributes = Object.values(this._attributes);
		return Object.assign({}, this._attributes, attributes, {
			length: attributes.length
		});
	}

	/**
	 * First element child.
	 *
	 * @returns Element.
	 */
	public get firstElementChild(): IElement {
		return this.children ? this.children[0] || null : null;
	}

	/**
	 * Last element child.
	 *
	 * @returns Element.
	 */
	public get lastElementChild(): IElement {
		return this.children ? this.children[this.children.length - 1] || null : null;
	}

	/**
	 * Last element child.
	 *
	 * @returns Element.
	 */
	public get childElementCount(): number {
		return this.children.length;
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
		this.setAttributeNS(null, 'slot', title);
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
		const xmlSerializer = new XMLSerializer();
		let xml = '';
		for (const node of this.childNodes) {
			xml += xmlSerializer.serializeToString(node, options);
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
		const clone = <Element | IElement>super.cloneNode(deep);

		for (const key of Object.keys(this._attributes)) {
			const attr = Object.assign(new Attr(), this._attributes[key]);
			(<IElement>attr.ownerElement) = clone;
			(<Element>clone)._attributes[key] = attr;
		}

		if (deep) {
			for (const node of clone.childNodes) {
				if (node.nodeType === Node.ELEMENT_NODE) {
					clone.children.push(<IElement>node);
				}
			}
		}

		(<string>clone.tagName) = this.tagName;
		clone.scrollLeft = this.scrollLeft;
		clone.scrollTop = this.scrollTop;
		(<string>clone.namespaceURI) = this.namespaceURI;

		return <IElement>clone;
	}

	/**
	 * Append a child node to childNodes.
	 *
	 * @override
	 * @param  node Node to append.
	 * @returns Appended node.
	 */
	public appendChild(node: INode): INode {
		// If the type is DocumentFragment, then the child nodes of if it should be moved instead of the actual node.
		// See: https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment
		if (node.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) {
			if (node.parentNode && node.parentNode['children']) {
				const index = node.parentNode['children'].indexOf(node);
				if (index !== -1) {
					node.parentNode['children'].splice(index, 1);
				}
			}

			if (node !== this && node.nodeType === Node.ELEMENT_NODE) {
				this.children.push(<IElement>node);
			}
		}

		return super.appendChild(node);
	}

	/**
	 * Remove Child element from childNodes array.
	 *
	 * @override
	 * @param node Node to remove.
	 */
	public removeChild(node: INode): INode {
		if (node.nodeType === Node.ELEMENT_NODE) {
			const index = this.children.indexOf(<IElement>node);
			if (index !== -1) {
				this.children.splice(index, 1);
			}
		}

		return super.removeChild(node);
	}

	/**
	 * Removes the node from its parent.
	 */
	public remove(): void {
		ChildNodeUtility.remove(this);
	}

	/**
	 * Inserts a node before another.
	 *
	 * @override
	 * @param newNode Node to insert.
	 * @param [referenceNode] Node to insert before.
	 * @returns Inserted node.
	 */
	public insertBefore(newNode: INode, referenceNode?: INode): INode {
		const returnValue = super.insertBefore(newNode, referenceNode);

		// If the type is DocumentFragment, then the child nodes of if it should be moved instead of the actual node.
		// See: https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment
		if (newNode.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) {
			if (newNode.parentNode && newNode.parentNode['children']) {
				const index = newNode.parentNode['children'].indexOf(newNode);
				if (index !== -1) {
					newNode.parentNode['children'].splice(index, 1);
				}
			}

			this.children.length = 0;

			for (const node of this.childNodes) {
				if (node.nodeType === Node.ELEMENT_NODE) {
					this.children.push(<IElement>node);
				}
			}
		}

		return returnValue;
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
		for (const node of XMLParser.parse(this.ownerDocument, text).childNodes.slice()) {
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
		return Object.keys(this._attributes);
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
	 * Returns namespace attribute value.
	 *
	 * @param namespace Namespace URI.
	 * @param localName Local name.
	 */
	public getAttributeNS(namespace: string, localName: string): string {
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
	public hasAttributeNS(namespace: string, localName: string): boolean {
		for (const name of Object.keys(this._attributes)) {
			const attribute = this._attributes[name];
			if (attribute.namespaceURI === namespace && attribute.localName === localName) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Returns "true" if the element has attributes.
	 *
	 * @returns "true" if the element has attributes.
	 */
	public hasAttributes(): boolean {
		return Object.keys(this._attributes).length > 0;
	}

	/**
	 * Removes an attribute.
	 *
	 * @param name Name.
	 */
	public removeAttribute(name: string): void {
		const attribute = this._attributes[this._getAttributeName(name)];
		if (attribute) {
			this.removeAttributeNode(attribute);
		}
	}

	/**
	 * Removes a namespace attribute.
	 *
	 * @param namespace Namespace URI.
	 * @param localName Local name.
	 */
	public removeAttributeNS(namespace: string, localName: string): void {
		for (const name of Object.keys(this._attributes)) {
			const attribute = this._attributes[name];
			if (attribute.namespaceURI === namespace && attribute.localName === localName) {
				this.removeAttribute(attribute.name);
			}
		}
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
		return new DOMRect();
	}

	/**
	 * Returns a range.
	 *
	 * @returns Range.
	 */
	public createTextRange(): Range {
		return new Range();
	}

	/**
	 * The matches() method checks to see if the Element would be selected by the provided selectorString.
	 *
	 * @param selector Selector.
	 * @returns "true" if matching.
	 */
	public matches(selector: string): boolean {
		for (const part of selector.split(',')) {
			if (new SelectorItem(part.trim()).match(this)) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Traverses the Element and its parents (heading toward the document root) until it finds a node that matches the provided selector string.
	 *
	 * @param selector Selector.
	 * @returns Closest matching element.
	 */
	public closest(selector: string): IElement {
		let rootElement: IElement = this.ownerDocument.documentElement;
		if (!this.isConnected) {
			rootElement = this;
			while (rootElement.parentNode) {
				rootElement = <IElement>rootElement.parentNode;
			}
		}
		const elements = rootElement.querySelectorAll(selector);

		// eslint-disable-next-line
		let parent: IElement = this;
		while (parent) {
			if (elements.includes(parent)) {
				return parent;
			}
			parent = parent.parentElement;
		}

		// QuerySelectorAll() will not match the element it is looking in when searched for
		// Therefore we need to check if it matches the root
		if (rootElement.matches(selector)) {
			return rootElement;
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
	public setAttributeNode(attribute: Attr): Attr {
		const name = this._getAttributeName(attribute.name);
		const replacedAttribute = this._attributes[name];
		const oldValue = replacedAttribute ? replacedAttribute.value : null;

		attribute.name = name;
		(<IElement>attribute.ownerElement) = this;
		(<IDocument>attribute.ownerDocument) = this.ownerDocument;

		this._attributes[name] = attribute;

		this._updateDomListIndices();

		if (
			this.attributeChangedCallback &&
			(<typeof Element>this.constructor)._observedAttributes &&
			(<typeof Element>this.constructor)._observedAttributes.includes(name)
		) {
			this.attributeChangedCallback(name, oldValue, attribute.value);
		}

		// MutationObserver
		if (this._observers.length > 0) {
			for (const observer of this._observers) {
				if (
					observer.options.attributes &&
					(!observer.options.attributeFilter || observer.options.attributeFilter.includes(name))
				) {
					const record = new MutationRecord();
					record.target = this;
					record.type = MutationTypeEnum.attributes;
					record.attributeName = name;
					record.oldValue = observer.options.attributeOldValue ? oldValue : null;
					observer.callback([record]);
				}
			}
		}

		return replacedAttribute || null;
	}

	/**
	 * The setAttributeNodeNS() method adds a new Attr node to the specified element.
	 *
	 * @param attribute Attribute.
	 * @returns Replaced attribute.
	 */
	public setAttributeNodeNS(attribute: Attr): Attr {
		return this.setAttributeNode(attribute);
	}

	/**
	 * Returns an Attr node.
	 *
	 * @param name Name.
	 * @returns Replaced attribute.
	 */
	public getAttributeNode(name: string): Attr {
		return this._attributes[this._getAttributeName(name)] || null;
	}

	/**
	 * Returns a namespaced Attr node.
	 *
	 * @param namespace Namespace.
	 * @param name Name.
	 * @returns Replaced attribute.
	 */
	public getAttributeNodeNS(namespace: string, name: string): Attr {
		const attributeName = this._getAttributeName(name);
		if (
			this._attributes[attributeName] &&
			this._attributes[attributeName].namespaceURI === namespace &&
			this._attributes[attributeName].localName === attributeName
		) {
			return this._attributes[attributeName];
		}
		for (const name of Object.keys(this._attributes)) {
			const attribute = this._attributes[name];
			if (attribute.namespaceURI === namespace && attribute.localName === attributeName) {
				return attribute;
			}
		}
		return null;
	}

	/**
	 * Removes an Attr node.
	 *
	 * @param attribute Attribute.
	 */
	public removeAttributeNode(attribute: Attr): void {
		delete this._attributes[attribute.name];

		this._updateDomListIndices();

		if (
			this.attributeChangedCallback &&
			(<typeof Element>this.constructor)._observedAttributes &&
			(<typeof Element>this.constructor)._observedAttributes.includes(attribute.name)
		) {
			this.attributeChangedCallback(attribute.name, attribute.value, null);
		}

		// MutationObserver
		if (this._observers.length > 0) {
			for (const observer of this._observers) {
				if (
					observer.options.attributes &&
					(!observer.options.attributeFilter ||
						observer.options.attributeFilter.includes(attribute.name))
				) {
					const record = new MutationRecord();
					record.target = this;
					record.type = MutationTypeEnum.attributes;
					record.attributeName = attribute.name;
					record.oldValue = observer.options.attributeOldValue ? attribute.value : null;
					observer.callback([record]);
				}
			}
		}
	}

	/**
	 * Removes an Attr node.
	 *
	 * @param attribute Attribute.
	 */
	public removeAttributeNodeNS(attribute: Attr): void {
		this.removeAttributeNode(attribute);
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

	/**
	 * Updates DOM list indices.
	 */
	protected _updateDomListIndices(): void {
		if (this._classList) {
			this._classList._updateIndices();
		}
	}
}
