import Node from '../node/Node';
import TextNode from '../text-node/TextNode';
import NodeType from '../node/NodeType';
import ShadowRoot from '../shadow-root/ShadowRoot';
import Attribute from './Attribute';
import DOMRect from './DOMRect';
import Range from './Range';
import HTMLParser from '../../../html-parser/HTMLParser';
import { decode, encode } from 'he';
import ClassList from './ClassList';
import QuerySelector from '../../../query-selector/QuerySelector';
import ElementRenderer from '../../../html-renderer/ElementRenderer';
import MutationRecord from '../../../mutation-observer/MutationRecord';
import MutationTypeConstant from '../../../mutation-observer/MutationType';

const ATTRIBUTE_REGEXP = /([^\s=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+)))/gi;

/**
 * Element.
 */
export default class Element extends Node {
	public tagName: string = null;
	public nodeType = NodeType.ELEMENT_NODE;
	public shadowRoot: ShadowRoot = null;
	public classList = new ClassList(this);
	public scrollTop = 0;
	public scrollLeft = 0;
	public _attributesMap: { [k: string]: string } = {};

	/**
	 * Returns ID.
	 *
	 * @return {string} ID.
	 */
	public get id(): string {
		return this.getAttribute('id');
	}

	/**
	 * Sets ID.
	 *
	 * @param {string} id ID.
	 * @return {string} HTML.
	 */
	public set id(id: string) {
		this.setAttribute('id', id);
	}

	/**
	 * Returns class name.
	 *
	 * @return {string} Class name.
	 */
	public get className(): string {
		return this.getAttribute('class');
	}

	/**
	 * Sets class name.
	 *
	 * @param {string} className Class name.
	 * @return {string} Class name.
	 */
	public set className(className: string) {
		this.setAttribute('class', className);
	}

	/**
	 * Returns children.
	 *
	 * @return {Element[]} Children.
	 */
	public get children(): Element[] {
		return <Element[]>this.childNodes.filter(childNode => childNode instanceof Element);
	}

	/**
	 * Node name.
	 *
	 * @return {string} Node name.
	 */
	public get nodeName(): string {
		return this.tagName;
	}

	/**
	 * Get text value of children.
	 *
	 * @return {string} Text content.
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
	 * @param {string} textContent Text content.
	 */
	public set textContent(textContent: string) {
		for (const child of this.childNodes) {
			this.removeChild(child);
		}
		this.appendChild(this.ownerDocument.createTextNode(textContent));
	}

	/**
	 * Returns inner HTML.
	 *
	 * @return {string} HTML.
	 */
	public get innerHTML(): string {
		return ElementRenderer.renderInnerHTML(this).html;
	}

	/**
	 * Sets inner HTML.
	 *
	 * @param {string} html HTML.
	 */
	public set innerHTML(html: string) {
		const root = HTMLParser.parse(this.ownerDocument, html);
		for (const child of this.childNodes.slice()) {
			this.removeChild(child);
		}
		for (const child of root.childNodes.slice()) {
			this.appendChild(child);
		}
	}

	/**
	 * Returns outer HTML.
	 *
	 * @return {string} HTML.
	 */
	public get outerHTML(): string {
		return ElementRenderer.renderOuterHTML(this).html;
	}

	/**
	 * Returns attributes.
	 *
	 * @return {{ [k: string]: Attribute | number }} Attributes.
	 */
	public get attributes(): { [k: string]: Attribute | number } {
		const names = Object.keys(this._attributesMap);
		const attributes = { length: names.length };
		for (let i = 0, max = names.length; i < max; i++) {
			const name = names[i];
			const attribute = new Attribute();
			attribute.name = name;
			attribute.value = this._attributesMap[name];
			attributes[name] = attribute;
			attributes[i] = attribute;
		}
		return attributes;
	}

	/**
	 * Get first child node.
	 *
	 * @return {Node} first child node
	 */
	public get firstChild(): Node {
		return this.childNodes[0] || null;
	}

	/**
	 * Get last child node.
	 *
	 * @return {Node} last child node
	 */
	public get lastChild(): Node {
		return this.childNodes[this.childNodes.length - 1] || null;
	}

	/**
	 * Attribute changed callback.
	 *
	 * @param {string} name Name.
	 * @param {string} oldValue Old value.
	 * @param {string} newValue New value.
	 */
	public attributeChangedCallback?(name: string, oldValue: string, newValue: string): void;

	/**
	 * Returns "true" if the node has attributes.
	 *
	 * @override
	 * @return {boolean} "true" if the node has attributes.
	 */
	public hasAttributes(): boolean {
		return Object.keys(this._attributesMap).length > 0;
	}

	/**
	 * Sets an attribute.
	 *
	 * @param {string} name Name.
	 * @param {string} value Value.
	 */
	public setAttribute(name: string, value: string): void {
		const lowerName = name.toLowerCase();
		const oldValue = this._attributesMap[lowerName] !== undefined ? this._attributesMap[lowerName] : null;
		this._attributesMap[lowerName] = String(value);

		if (this.attributeChangedCallback) {
			this.attributeChangedCallback(name, oldValue, value);
		}

		// MutationObserver
		if (this._observers.length > 0) {
			for (const observer of this._observers) {
				if (
					observer.options.attributes &&
					(!observer.options.attributeFilter || observer.options.attributeFilter.includes(lowerName))
				) {
					const record = new MutationRecord();
					record.type = MutationTypeConstant.attributes;
					record.attributeName = lowerName;
					record.oldValue = observer.options.attributeOldValue ? oldValue : null;
					observer.callback([record]);
				}
			}
		}
	}

	/**
	 * Returns attribute value.
	 *
	 * @param {string} name Name.
	 */
	public getAttribute(name: string): string {
		const lowerName = name.toLowerCase();
		return this.hasAttribute(name) ? this._attributesMap[lowerName] : null;
	}

	/**
	 * Returns a boolean value indicating whether the specified element has the attribute or not.
	 *
	 * @param {string} name Attribute name.
	 * @returns {boolean} True if attribute exists, false otherwise.
	 */
	public hasAttribute(name: string): boolean {
		const lowerName = name.toLowerCase();
		return this._attributesMap[lowerName] !== undefined;
	}

	/**
	 * Removes an attribute.
	 *
	 * @param {string} name Name.
	 */
	public removeAttribute(name: string): void {
		const lowerName = name.toLowerCase();
		const oldValue = this._attributesMap[lowerName] !== undefined ? this._attributesMap[lowerName] : null;
		delete this._attributesMap[lowerName];

		// MutationObserver
		if (this._observers.length > 0) {
			for (const observer of this._observers) {
				if (
					observer.options.attributes &&
					(!observer.options.attributeFilter || observer.options.attributeFilter.includes(lowerName))
				) {
					const record = new MutationRecord();
					record.type = MutationTypeConstant.attributes;
					record.attributeName = lowerName;
					record.oldValue = observer.options.attributeOldValue ? oldValue : null;
					observer.callback([record]);
				}
			}
		}
	}

	/**
	 * Sets raw attributes.
	 *
	 * @param {string} rawAttributes Raw attributes.
	 */
	public _setRawAttributes(rawAttributes: string): void {
		rawAttributes = rawAttributes.trim();
		if (rawAttributes) {
			const regExp = new RegExp(ATTRIBUTE_REGEXP, 'gi');
			let match: RegExpExecArray;

			// Attributes with value
			while ((match = regExp.exec(rawAttributes))) {
				const name = match[1].toLowerCase();
				this._attributesMap[name] = decode(match[2] || match[3] || match[4] || '');
			}

			// Attributes with no value
			for (const name of rawAttributes
				.replace(ATTRIBUTE_REGEXP, '')
				.trim()
				.split(' ')) {
				this._attributesMap[name.trim().toLowerCase()] = '';
			}
		}
	}

	/**
	 * Returns raw attributes.
	 */
	public _getRawAttributes(): string {
		const attributes = [];
		for (const name of Object.keys(this._attributesMap)) {
			if (this._attributesMap[name]) {
				attributes.push(name + '="' + encode(this._attributesMap[name]) + '"');
			}
		}
		return attributes.join(' ');
	}

	/**
	 * Attaches a shadow root.
	 *
	 * @return {ShadowRoot} Shadow root.
	 */
	public attachShadow(): ShadowRoot {
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
	 * @return {string} String.
	 */
	public toString(): string {
		return this.outerHTML;
	}

	/**
	 * Returns the size of an element and its position relative to the viewport.
	 *
	 * @return {DOMRect} DOM rect.
	 */
	public getBoundingClientRect(): DOMRect {
		return new DOMRect();
	}

	/**
	 * Returns a range.
	 *
	 * @return {Range} Range.
	 */
	public createTextRange(): Range {
		return new Range();
	}

	/**
	 * Query CSS selector to find matching nodes.
	 *
	 * @param {string} selector CSS selector.
	 * @return {Element[]} Matching elements.
	 */
	public querySelectorAll(selector: string): Element[] {
		return QuerySelector.querySelectorAll(this, selector);
	}

	/**
	 * Query CSS Selector to find matching node.
	 *
	 * @param {string} selector CSS selector.
	 * @return {Element} Matching node.
	 */
	public querySelector(selector: string): Element {
		return QuerySelector.querySelector(this, selector);
	}

	/**
	 * Returns an elements by tag name.
	 *
	 * @param {string} tagName Tag name.
	 * @return {Element[]} Matching nodes.
	 */
	public getElementsByTagName(tagName: string): Element[] {
		return this.querySelectorAll(tagName);
	}

	/**
	 * Returns an elements by class name.
	 *
	 * @param {string} className Tag name.
	 * @return {Element[]} Matching nodes.
	 */
	public getElementsByClassName(className: string): Element[] {
		return this.querySelectorAll('.' + className.split(' ').join('.'));
	}
}
