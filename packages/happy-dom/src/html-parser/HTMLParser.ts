import { parse, parseFragment, type ParserOptions } from 'parse5';
import Document from '../nodes/document/Document.js';
import * as PropertySymbol from '../PropertySymbol.js';
import Element from '../nodes/element/Element.js';
import DocumentFragment from '../nodes/document-fragment/DocumentFragment.js';
import BrowserWindow from '../window/BrowserWindow.js';
import Parse5TreeAdapter, { type IHappyDOMTreeAdapterMap } from './Parse5TreeAdapter.js';
import HTMLHtmlElement from '../nodes/html-html-element/HTMLHtmlElement.js';

/**
 * HTML parser using parse5 for spec-compliant HTML parsing.
 *
 * This parser implements the WHATWG HTML5 parsing algorithm via parse5,
 * ensuring browser-identical behavior for malformed HTML handling.
 */
export default class HTMLParser {
	private window: BrowserWindow;
	private evaluateScripts: boolean = false;

	/**
	 * Constructor.
	 *
	 * @param window Window.
	 * @param [options] Options.
	 * @param [options.evaluateScripts] Set to "true" to enable script execution.
	 * @param [options.isTemplateDocumentFragment] Set to "true" if parsing a template content fragment (unused with parse5).
	 */
	constructor(
		window: BrowserWindow,
		options?: {
			evaluateScripts?: boolean;
			isTemplateDocumentFragment?: boolean;
		}
	) {
		this.window = window;

		if (options?.evaluateScripts) {
			this.evaluateScripts = true;
		}
	}

	/**
	 * Parses HTML and returns a root element containing nodes found.
	 *
	 * @param html HTML string.
	 * @param [rootNode] Root node.
	 * @returns Root node.
	 */
	public parse(
		html: string,
		rootNode?: Element | DocumentFragment | Document
	): Element | DocumentFragment | Document {
		html = String(html);

		// Determine the target node and parsing mode
		const targetNode = rootNode || this.window.document.createDocumentFragment();
		const document = targetNode instanceof Document ? targetNode : this.window.document;

		// Create the tree adapter
		const treeAdapter = new Parse5TreeAdapter(this.window, {
			document,
			evaluateScripts: this.evaluateScripts
		});

		// Parser options
		const parserOptions: ParserOptions<IHappyDOMTreeAdapterMap> = {
			treeAdapter,
			scriptingEnabled: true
		};

		if (targetNode instanceof Document) {
			// Parse as a full document
			return this.parseDocument(html, targetNode, parserOptions);
		} else if (targetNode instanceof this.window.HTMLHtmlElement) {
			// Parse into an <html> element
			return this.parseIntoHtmlElement(html, <HTMLHtmlElement>targetNode, parserOptions);
		} else {
			// Parse as a fragment
			return this.parseFragment(html, targetNode, parserOptions);
		}
	}

	/**
	 * Parses HTML as a full document.
	 *
	 * @param html HTML string.
	 * @param targetDocument Target document.
	 * @param parserOptions Parser options.
	 * @returns Document.
	 */
	private parseDocument(
		html: string,
		targetDocument: Document,
		parserOptions: ParserOptions<IHappyDOMTreeAdapterMap>
	): Document {
		const { documentElement, head, body } = targetDocument;

		if (!documentElement || !head || !body) {
			throw new Error(
				'Failed to parse HTML: The root node must have "documentElement", "head" and "body".\n\nWe should not end up here and it is therefore a bug in Happy DOM. Please report this issue.'
			);
		}

		// Clear existing content from head and body
		while (head[PropertySymbol.nodeArray].length > 0) {
			head[PropertySymbol.removeChild](
				head[PropertySymbol.nodeArray][head[PropertySymbol.nodeArray].length - 1]
			);
		}
		while (body[PropertySymbol.nodeArray].length > 0) {
			body[PropertySymbol.removeChild](
				body[PropertySymbol.nodeArray][body[PropertySymbol.nodeArray].length - 1]
			);
		}

		// Parse the HTML using parse5
		const parsedDoc = parse<IHappyDOMTreeAdapterMap>(html, parserOptions);

		// Transfer parsed content to the target document
		this.transferDocumentContent(parsedDoc, targetDocument);

		return targetDocument;
	}

	/**
	 * Parses HTML into an <html> element.
	 *
	 * @param html HTML string.
	 * @param htmlElement Target HTML element.
	 * @param parserOptions Parser options.
	 * @returns HTML element.
	 */
	private parseIntoHtmlElement(
		html: string,
		htmlElement: HTMLHtmlElement,
		parserOptions: ParserOptions<IHappyDOMTreeAdapterMap>
	): HTMLHtmlElement {
		const document = htmlElement.ownerDocument || this.window.document;

		// Clear existing children
		while (htmlElement[PropertySymbol.nodeArray].length > 0) {
			htmlElement[PropertySymbol.removeChild](
				htmlElement[PropertySymbol.nodeArray][htmlElement[PropertySymbol.nodeArray].length - 1]
			);
		}

		// Create head and body
		const head = document.createElement('head');
		const body = document.createElement('body');
		htmlElement[PropertySymbol.appendChild](head);
		htmlElement[PropertySymbol.appendChild](body);

		// Parse as fragment with html element as context
		const fragment = parseFragment<IHappyDOMTreeAdapterMap>(htmlElement, html, parserOptions);

		// Move children from fragment to appropriate locations
		const children = fragment[PropertySymbol.nodeArray].slice();
		for (const child of children) {
			const tagName = (<Element>child)[PropertySymbol.localName];
			if (tagName === 'head') {
				// Move head children to our head
				const headChildren = child[PropertySymbol.nodeArray].slice();
				for (const headChild of headChildren) {
					head[PropertySymbol.appendChild](headChild, true);
				}
			} else if (tagName === 'body') {
				// Move body children to our body
				const bodyChildren = child[PropertySymbol.nodeArray].slice();
				for (const bodyChild of bodyChildren) {
					body[PropertySymbol.appendChild](bodyChild, true);
				}
			} else {
				// Other content goes to body
				body[PropertySymbol.appendChild](child, true);
			}
		}

		return htmlElement;
	}

	/**
	 * Parses HTML as a fragment.
	 *
	 * @param html HTML string.
	 * @param targetNode Target node (Element or DocumentFragment).
	 * @param parserOptions Parser options.
	 * @returns Target node with parsed content.
	 */
	private parseFragment(
		html: string,
		targetNode: Element | DocumentFragment,
		parserOptions: ParserOptions<IHappyDOMTreeAdapterMap>
	): Element | DocumentFragment {
		// Determine context element for fragment parsing
		let contextElement: Element | null = null;

		if (targetNode instanceof Element) {
			contextElement = targetNode;
		}

		// Clear existing children if parsing into an element
		if (targetNode instanceof Element) {
			while (targetNode[PropertySymbol.nodeArray].length > 0) {
				targetNode[PropertySymbol.removeChild](
					targetNode[PropertySymbol.nodeArray][targetNode[PropertySymbol.nodeArray].length - 1]
				);
			}
		}

		// Parse the fragment
		const fragment = contextElement
			? parseFragment<IHappyDOMTreeAdapterMap>(contextElement, html, parserOptions)
			: parseFragment<IHappyDOMTreeAdapterMap>(html, parserOptions);

		// Move children from parsed fragment to target
		const children = fragment[PropertySymbol.nodeArray].slice();
		for (const child of children) {
			targetNode[PropertySymbol.appendChild](child, true);
		}

		return targetNode;
	}

	/**
	 * Transfers content from a parsed document to the target document.
	 *
	 * @param parsedDoc Parsed document from parse5.
	 * @param targetDocument Target document.
	 */
	private transferDocumentContent(parsedDoc: Document, targetDocument: Document): void {
		const { documentElement, head, body } = targetDocument;

		// Clear existing content from head and body
		while (head[PropertySymbol.nodeArray].length > 0) {
			head[PropertySymbol.removeChild](
				head[PropertySymbol.nodeArray][head[PropertySymbol.nodeArray].length - 1]
			);
		}
		while (body[PropertySymbol.nodeArray].length > 0) {
			body[PropertySymbol.removeChild](
				body[PropertySymbol.nodeArray][body[PropertySymbol.nodeArray].length - 1]
			);
		}

		// Process parsed document children
		const parsedChildren = parsedDoc[PropertySymbol.nodeArray].slice();

		for (const child of parsedChildren) {
			const nodeType = child[PropertySymbol.nodeType];

			if (nodeType === 10) {
				// DocumentType node
				// Update or insert doctype
				const parsedDoctype = <import('../nodes/document-type/DocumentType.js').default>child;
				let doctype = targetDocument.doctype;

				if (doctype) {
					doctype[PropertySymbol.name] = parsedDoctype[PropertySymbol.name];
					doctype[PropertySymbol.publicId] = parsedDoctype[PropertySymbol.publicId];
					doctype[PropertySymbol.systemId] = parsedDoctype[PropertySymbol.systemId];
				} else {
					doctype = targetDocument.implementation.createDocumentType(
						parsedDoctype[PropertySymbol.name],
						parsedDoctype[PropertySymbol.publicId],
						parsedDoctype[PropertySymbol.systemId]
					);
					targetDocument[PropertySymbol.insertBefore](doctype, documentElement, true);
				}
			} else if (nodeType === 1) {
				// Element node
				const element = <Element>child;
				const tagName = element[PropertySymbol.localName];

				if (tagName === 'html') {
					// Transfer html element attributes
					this.transferAttributes(element, documentElement);

					// Process html children
					const htmlChildren = element[PropertySymbol.nodeArray].slice();
					for (const htmlChild of htmlChildren) {
						const htmlChildTagName = (<Element>htmlChild)[PropertySymbol.localName];

						if (htmlChildTagName === 'head') {
							// Transfer head attributes and children
							this.transferAttributes(<Element>htmlChild, head);
							const headChildren = htmlChild[PropertySymbol.nodeArray].slice();
							for (const headChild of headChildren) {
								head[PropertySymbol.appendChild](headChild, true);
							}
						} else if (htmlChildTagName === 'body') {
							// Transfer body attributes and children
							this.transferAttributes(<Element>htmlChild, body);
							const bodyChildren = htmlChild[PropertySymbol.nodeArray].slice();
							for (const bodyChild of bodyChildren) {
								body[PropertySymbol.appendChild](bodyChild, true);
							}
						} else {
							// Other content in html goes to body
							body[PropertySymbol.appendChild](htmlChild, true);
						}
					}
				} else {
					// Non-html elements at document level go to body
					body[PropertySymbol.appendChild](child, true);
				}
			} else if (nodeType === 8) {
				// Comment node - insert at document level
				targetDocument[PropertySymbol.insertBefore](child, documentElement, true);
			}
		}
	}

	/**
	 * Transfers attributes from source element to target element.
	 *
	 * @param source Source element.
	 * @param target Target element.
	 */
	private transferAttributes(source: Element, target: Element): void {
		const sourceAttrs = source[PropertySymbol.attributes];
		const targetAttrs = target[PropertySymbol.attributes];

		// Use iterator to access attributes
		for (const attr of sourceAttrs) {
			const name = attr[PropertySymbol.name] || '';
			const value = attr[PropertySymbol.value] || '';
			const ns = attr[PropertySymbol.namespaceURI];

			if (ns) {
				if (!targetAttrs.getNamedItemNS(ns, attr[PropertySymbol.localName] || '')) {
					target.setAttributeNS(ns, name, value);
				}
			} else {
				if (!targetAttrs.getNamedItem(name)) {
					target.setAttribute(name, value);
				}
			}
		}
	}
}
