import Node from '../node/Node';
import ShadowRoot from '../shadow-root/ShadowRoot';
import Attr from '../../../attribute/Attr';
import DOMRect from './DOMRect';
import Range from './Range';
import ClassList from './ClassList';
import QuerySelector from '../../../query-selector/QuerySelector';
import MutationRecord from '../../../mutation-observer/MutationRecord';
import MutationTypeConstant from '../../../mutation-observer/MutationType';
import NamespaceURI from '../../../html-config/NamespaceURI';
import XMLParser from '../../../xml-parser/XMLParser';
import XMLSerializer from '../../../xml-serializer/XMLSerializer';
import ChildNodeUtility from '../child-node/ChildNodeUtility';
import ParentNodeUtility from '../parent-node/ParentNodeUtility';
import NonDocumentChildNodeUtility from '../child-node/NonDocumentChildNodeUtility';
import IElement from './IElement';
import CSSStyleDeclarationFactory from '../../../css/CSSStyleDeclarationFactory';

/**
 * Element.
 */
export default class Element extends Node implements IElement {
	public tagName: string = null;
	public nodeType = Node.ELEMENT_NODE;
	public shadowRoot: ShadowRoot = null;
	public readonly classList = new ClassList(this);
	public scrollTop = 0;
	public scrollLeft = 0;
	public children: Element[] = [];
	public _attributes: { [k: string]: Attr } = {};
	public readonly namespaceURI: string = null;

	/**
	 * Returns a list of observed attributes.
	 *
	 * @return Observered attributes.
	 */
	public static get observedAttributes(): string[] {
		return undefined;
	}

	/**
	 * Returns ID.
	 *
	 * @return ID.
	 */
	public get id(): string {
		return this.getAttribute('id') || '';
	}

	/**
	 * Sets ID.
	 *
	 * @param id ID.
	 * @return HTML.
	 */
	public set id(id: string) {
		this.setAttribute('id', id);
	}

	/**
	 * Returns class name.
	 *
	 * @return Class name.
	 */
	public get className(): string {
		return this.getAttribute('class') || '';
	}

	/**
	 * Sets class name.
	 *
	 * @param className Class name.
	 * @return Class name.
	 */
	public set className(className: string) {
		this.setAttribute('class', className);
	}

	/**
	 * Node name.
	 *
	 * @return Node name.
	 */
	public get nodeName(): string {
		return this.tagName;
	}

	/**
	 * Local name.
	 *
	 * @return Local name.
	 */
	public get localName(): string {
		return this.tagName.toLowerCase();
	}

	/**
	 * Previous element sibling.
	 *
	 * @return Element.
	 */
	public get previousElementSibling(): Element {
		return NonDocumentChildNodeUtility.previousElementSibling(this);
	}

	/**
	 * Next element sibling.
	 *
	 * @return Element.
	 */
	public get nextElementSibling(): Element {
		return NonDocumentChildNodeUtility.nextElementSibling(this);
	}

	/**
	 * Get text value of children.
	 *
	 * @return Text content.
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
		this.appendChild(this.ownerDocument.createTextNode(textContent));
	}

	/**
	 * Returns inner HTML.
	 *
	 * @return HTML.
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
	 * @return HTML.
	 */
	public get outerHTML(): string {
		return new XMLSerializer().serializeToString(this);
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
	 * @return Element.
	 */
	public get firstElementChild(): Element {
		return this.children ? this.children[0] || null : null;
	}

	/**
	 * Last element child.
	 *
	 * @return Element.
	 */
	public get lastElementChild(): Element {
		return this.children ? this.children[this.children.length - 1] || null : null;
	}

	/**
	 * Last element child.
	 *
	 * @return Element.
	 */
	public get childElementCount(): number {
		return this.children.length;
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
	 * Clones a node.
	 *
	 * @override
	 * @param [deep=false] "true" to clone deep.
	 * @return Cloned node.
	 */
	public cloneNode(deep = false): Element {
		const clone = <Element>super.cloneNode(deep);

		for (const key of Object.keys(this._attributes)) {
			clone._attributes[key] = Object.assign(new Attr(), this._attributes[key]);
		}

		if (deep) {
			clone.children = <Element[]>(
				clone.childNodes.filter(node => node.nodeType === Node.ELEMENT_NODE)
			);
		}

		clone.tagName = this.tagName;
		clone.scrollLeft = this.scrollLeft;
		clone.scrollTop = this.scrollTop;
		// @ts-ignore
		clone.namespaceURI = this.namespaceURI;

		return clone;
	}

	/**
	 * Append a child node to childNodes.
	 *
	 * @override
	 * @param  node Node to append.
	 * @return Appended node.
	 */
	public appendChild(node: Node): Node {
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
				this.children.push(<Element>node);
			}
		}

		return super.appendChild(node);
	}

	/**
	 * Remove Child element from childNodes array.
	 *
	 * @override
	 * @param node Node to remove
	 */
	public removeChild(node: Node): void {
		if (node.nodeType === Node.ELEMENT_NODE) {
			const index = this.children.indexOf(<Element>node);
			if (index !== -1) {
				this.children.splice(index, 1);
			}
		}

		super.removeChild(node);
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
	 * @return Inserted node.
	 */
	public insertBefore(newNode: Node, referenceNode?: Node): Node {
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

			// @ts-ignore
			this.children = this.childNodes.filter(node => node.nodeType === Node.ELEMENT_NODE);
		}

		return returnValue;
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
		for (const name of Object.keys(this._attributes)) {
			const attribute = this._attributes[name];
			if (attribute.namespaceURI === namespace && attribute.localName === localName) {
				return attribute.value;
			}
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
	 * @return "true" if the element has attributes.
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
	 * @returns Shadow root.
	 */
	public attachShadow(shadowRootInit: { mode: string }): ShadowRoot {
		if (this.shadowRoot) {
			throw new Error('Shadow root has already been attached.');
		}
		this.shadowRoot = new ShadowRoot();
		// @ts-ignore
		this.shadowRoot.ownerDocument = this.ownerDocument;
		// @ts-ignore
		this.shadowRoot.host = this;
		// @ts-ignore
		this.shadowRoot.mode = shadowRootInit.mode;
		this.shadowRoot.isConnected = this.isConnected;
		return this.shadowRoot;
	}

	/**
	 * Scrolls to a particular set of coordinates in the document.
	 *
	 * @note This method has not been implemented. It is just here for compatibility.
	 */
	public scrollTo(): void {}

	/**
	 * Converts to string.
	 *
	 * @return String.
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
	 * Query CSS selector to find matching nodes.
	 *
	 * @param selector CSS selector.
	 * @returns Matching elements.
	 */
	public querySelectorAll(selector: string): Element[] {
		return QuerySelector.querySelectorAll(this, selector);
	}

	/**
	 * Query CSS Selector to find matching node.
	 *
	 * @param selector CSS selector.
	 * @return Matching element.
	 */
	public querySelector(selector: string): Element {
		return QuerySelector.querySelector(this, selector);
	}

	/**
	 * Returns an elements by tag name.
	 *
	 * @param tagName Tag name.
	 * @returns Matching elements.
	 */
	public getElementsByTagName(tagName: string): Element[] {
		return this.querySelectorAll(tagName);
	}

	/**
	 * Returns an elements by tag name.
	 *
	 * @param namespaceURI Namespace URI.
	 * @param tagName Tag name.
	 * @returns Matching nodes.
	 */
	public getElementsByTagNameNS(namespaceURI: string, tagName: string): Element[] {
		return this.querySelectorAll(tagName).filter(element => element.namespaceURI === namespaceURI);
	}

	/**
	 * Returns an elements by class name.
	 *
	 * @param className Tag name.
	 * @returns Matching nodes.
	 */
	public getElementsByClassName(className: string): Element[] {
		return this.querySelectorAll('.' + className.split(' ').join('.'));
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

		this._attributes[name] = attribute;

		// Styles
		if (name === 'style' && this['style']) {
			this['style'] = CSSStyleDeclarationFactory.createCSSStyleDeclaration(attribute.value);
		}

		if (
			this.attributeChangedCallback &&
			(<typeof Element>this.constructor).observedAttributes &&
			(<typeof Element>this.constructor).observedAttributes.includes(name)
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
					record.type = MutationTypeConstant.attributes;
					record.attributeName = name;
					record.oldValue = observer.options.attributeOldValue ? oldValue : null;
					observer.callback([record]);
				}
			}
		}

		return replacedAttribute || null;
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
	 * Removes an Attr node.
	 *
	 * @param attribute Attribute.
	 */
	public removeAttributeNode(attribute: Attr): void {
		delete this._attributes[attribute.name];

		if (
			this.attributeChangedCallback &&
			(<typeof Element>this.constructor).observedAttributes &&
			(<typeof Element>this.constructor).observedAttributes.includes(attribute.name)
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
					record.type = MutationTypeConstant.attributes;
					record.attributeName = attribute.name;
					record.oldValue = observer.options.attributeOldValue ? attribute.value : null;
					observer.callback([record]);
				}
			}
		}
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
