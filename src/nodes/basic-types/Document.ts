import Element from './Element';
import HTMLElement from './HTMLElement';
import HTMLTemplateElement from '../elements/HTMLTemplateElement';
import HTMLFormElement from '../elements/HTMLFormElement';
import HTMLInputElement from '../elements/HTMLInputElement';
import HTMLTextAreaElement from '../elements/HTMLTextAreaElement';
import SVGSVGElement from '../elements/SVGSVGElement';
import TextNode from './TextNode';
import CommentNode from './CommentNode';
import Window from '../../Window';
import Node from './Node';
import NodeType from './NodeType';
import TreeWalker from '../../tree-walker/TreeWalker';
import DocumentFragment from './DocumentFragment';
import HTMLParser from '../../html-parser/HTMLParser';
import Event from '../../event/Event';
import DOMImplementation from '../../implementation/DOMImplementation';

/**
 * Document.
 */
export default class Document extends DocumentFragment {
	public documentElement: Element;
	public body: Element;
	public head: Element;
	public defaultView: Window;
	public nodeType = NodeType.DOCUMENT_NODE;
	protected elementsById: { [k: string]: Element[] } = {};
	protected _isConnected = true;
	public implementation: DOMImplementation;

	/**
	 * Creates an instance of Document.
	 *
	 * @param {Window} window Window instance.
	 */
	constructor(window: Window) {
		super();

		this.defaultView = window;
		this.implementation = new DOMImplementation(window);
		this.documentElement = this.createElement('html');
		this.body = this.createElement('body');
		this.head = this.createElement('head');
		this.documentElement.appendChild(this.head);
		this.documentElement.appendChild(this.body);
		this.documentElement.isConnected = true;
		this.appendChild(this.documentElement);
	}

	/**
	 * Node name.
	 *
	 * @return {string} Node name.
	 */
	public get nodeName(): string {
		return '#document';
	}

	/**
	 * Replaces the document HTML with new HTML.
	 *
	 * @param {string} html HTML.
	 */
	public write(html: string): void {
		const root = HTMLParser.parse(this, html);
		for (const child of this.childNodes.slice()) {
			this.removeChild(child);
		}
		for (const child of root.childNodes.slice()) {
			this.appendChild(child);
		}
		this.documentElement = this.querySelector('html');
		this.body = this.documentElement.querySelector('body');
		this.head = this.documentElement.querySelector('head');
	}

	/**
	 * Opens the document.
	 */
	public open(): void {}

	/**
	 * Closes the document.
	 */
	public close(): void {}

	/**
	 * Creates an element.
	 *
	 * @param  {string} tagName Tag name.
	 * @return {Element} Element.
	 */
	public createElement(tagName: string): Element {
		const customElementClass = this.defaultView.customElements.get(tagName);
		const elementClass = customElementClass ? customElementClass : this.getElementClass(tagName);

		elementClass.ownerDocument = this;

		const element = new elementClass();
		element.tagName = tagName.toUpperCase();
		element.ownerDocument = this;

		return element;
	}

	/**
	 * Creates a text node.
	 *
	 * @param  {string} data Text data.
	 * @return {TextNode} Text node.
	 */
	public createTextNode(data: string): TextNode {
		TextNode.ownerDocument = this;
		const textNode = new TextNode();
		textNode.textContent = data;
		return textNode;
	}

	/**
	 * Creates a comment node.
	 *
	 * @param  {string} data Text data.
	 * @return {TextNode} Text node.
	 */
	public createComment(data: string): CommentNode {
		CommentNode.ownerDocument = this;
		const commentNode = new CommentNode();
		commentNode.textContent = data;
		return commentNode;
	}

	/**
	 * Creates a document fragment.
	 *
	 * @return {DocumentFragment} Document fragment.
	 */
	public createDocumentFragment(): DocumentFragment {
		DocumentFragment.ownerDocument = this;
		const documentFragment = new DocumentFragment();
		return documentFragment;
	}

	/**
	 * Creates a Tree Walker.
	 *
	 * @param {Node} root Root.
	 * @param {number} [whatToShow] What to show.
	 * @param {(node: Node) => number} [filter] Filter.
	 */
	public createTreeWalker(root: Node, whatToShow: number = -1, filter: (node: Node) => number = null): TreeWalker {
		return new TreeWalker(root, whatToShow, filter);
	}

	/**
	 * Creates an event.
	 *
	 * @legacy
	 * @param {string} type Type.
	 * @return {Event} Event.
	 */
	public createEvent(type: string): Event {
		return new Event(type);
	}

	/**
	 * Imports a node.
	 *
	 * @param {Node} node Node to import.
	 * @param {Node} Imported node.
	 */
	public importNode(node: Node): Node {
		if (!(node instanceof Node)) {
			throw new Error('Parameter 1 was not of type Node.');
		}
		return node.cloneNode(true);
	}

	/**
	 * Returns the element class for a tag name.
	 *
	 * @param {string} tagName Tag name.
	 * @return {typeof Element} Element class.
	 */
	private getElementClass(tagName: string): typeof Element {
		switch (tagName) {
			case 'template':
				return HTMLTemplateElement;
			case 'form':
				return HTMLFormElement;
			case 'input':
				return HTMLInputElement;
			case 'textarea':
				return HTMLTextAreaElement;
			case 'svg':
				return SVGSVGElement;
		}
		return HTMLElement;
	}
}
