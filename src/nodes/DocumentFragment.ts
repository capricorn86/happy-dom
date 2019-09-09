import Node from './Node';
import Element from './Element';
import QuerySelector from '../html-element/QuerySelector';
import NodeType from './NodeType';

/**
 * DocumentFragment.
 */
export default class DocumentFragment extends Node {
	public nodeType = NodeType.DOCUMENT_FRAGMENT_NODE;
	public mode: string = 'open';

	/**
	 * Returns children.
	 *
	 * @return {Element[]} Children.
	 */
	public get children(): Element[] {
		return <Element[]>this.childNodes.filter(childNode => childNode instanceof Element);
	}

	/**
	 * Query CSS selector to find matching nodes.
	 *
	 * @param  {string} selector CSS selector.
	 * @return {Element[]} Matching elements.
	 */
	public querySelectorAll(selector: string): Element[] {
		return QuerySelector.querySelectorAll(this, selector);
	}

	/**
	 * Query CSS Selector to find matching node.
	 *
	 * @param  {string} selector CSS selector.
	 * @return {Element} Matching node.
	 */
	public querySelector(selector: string): Element {
		return QuerySelector.querySelector(this, selector);
	}

	/**
	 * Returns an element by ID.
	 *
	 * @param {string} id ID.
	 * @return {Element} Matching node.
	 */
	public getElementById(id: string): Element {
		return this.querySelector('[id="' + id + '"]');
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
