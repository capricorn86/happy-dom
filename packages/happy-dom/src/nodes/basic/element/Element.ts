import Node from '../node/Node';
import TextNode from '../text-node/TextNode';
import ShadowRoot from '../shadow-root/ShadowRoot';
import Attr from '../../../attribute/Attr';
import DOMRect from './DOMRect';
import Range from './Range';
import HTMLParser from '../../../html-parser/HTMLParser';
import ClassList from './ClassList';
import QuerySelector from '../../../query-selector/QuerySelector';
import HTMLRenderer from '../../../html-renderer/HTMLRenderer';
import MutationRecord from '../../../mutation-observer/MutationRecord';
import MutationTypeConstant from '../../../mutation-observer/MutationType';
import NamespaceURI from '../../../html-config/NamespaceURI';

/**
 * Element.
 */
export default class Element extends Node {
	public tagName: string = null;
	public nodeType = Node.ELEMENT_NODE;
	public shadowRoot: ShadowRoot = null;
	public readonly classList = new ClassList(this);
	public scrollTop = 0;
	public scrollLeft = 0;
	public children: Element[] = [];
	public _attributes: { [k: string]: Attr } = {};
	public _namespaceURI: string = null;

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
	 * Returns the namespace URI.
	 *
	 * @return Namespace URI.
	 */
	public get namespaceURI(): string {
		return this._namespaceURI;
	}

	/**
	 * Get text value of children.
	 *
	 * @return Text content.
	 */
	public get textContent(): string {
		let result = '';
		for (const childNode of this.childNodes) {
			if (childNode instanceof Element || childNode instanceof TextNode) {
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
		return HTMLRenderer.getInnerHTML(this);
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

		for (const node of HTMLParser.parse(this.ownerDocument, html).childNodes.slice()) {
			this.appendChild(node);
		}
	}

	/**
	 * Returns outer HTML.
	 *
	 * @return HTML.
	 */
	public get outerHTML(): string {
		return HTMLRenderer.getOuterHTML(this);
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
	public cloneNode(deep = false): Node {
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
		clone._namespaceURI = this._namespaceURI;

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
		if (node !== this && node instanceof Element) {
			this.children.push(node);
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
		if (node instanceof Element) {
			const index = this.children.indexOf(node);
			if (index !== -1) {
				this.children.splice(index, 1);
			}
		}

		super.removeChild(node);
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
	public attachShadow(_shadowRootInit: { mode: string }): ShadowRoot {
		if (this.shadowRoot) {
			throw new Error('Shadow root has already been attached.');
		}
		this.shadowRoot = new ShadowRoot();
		this.shadowRoot.ownerDocument = this.ownerDocument;
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
	 * @return Matching node.
	 */
	public querySelector(selector: string): Element {
		return QuerySelector.querySelector(this, selector);
	}

	/**
	 * Returns an elements by tag name.
	 *
	 * @param tagName Tag name.
	 * @returns Matching nodes.
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
		return this.querySelectorAll(tagName).filter(element => element._namespaceURI === namespaceURI);
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
			for (const part of attribute.value.split(';')) {
				const [key, value] = part.split(':');
				if (key && value) {
					this['style'][this._kebabToCamelCase(key.trim())] = value.trim();
				}
			}
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
		if (this._namespaceURI === NamespaceURI.svg) {
			return name;
		}
		return name.toLowerCase();
	}

	/**
	 * Kebab case to words.
	 *
	 * @param string String to convert.
	 * @returns Text as kebab case.
	 */
	private _kebabToCamelCase(string): string {
		string = string.split('-');
		for (let i = 0, max = string.length; i < max; i++) {
			const firstWord = i > 0 ? string[i].charAt(0).toUpperCase() : string[i].charAt(0);
			string[i] = firstWord + string[i].slice(1);
		}
		return string.join('');
	}
}
