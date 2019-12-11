import Node from '../nodes/basic-types/node/Node';
import Element from '../nodes/basic-types/element/Element';
import Document from '../nodes/basic-types/document/Document';
import SelfClosingElements from '../html-config/SelfClosingElements.json';
import SelfClosingSVGElements from '../html-config/SelfClosingSVGElements.json';

/**
 * HTML parser.
 */
export default class HTMLParser {
	/**
	 * Parses HTML and returns a root element.
	 *
	 * @param  {Document} document Document.
	 * @param  {string} data HTML data.
	 * @return {Element} Root element.
	 */
	public static parse(document: Document, data: string): Element {
		const root = document.createElement('root');
		const stack = [root];
		const markupRegexp = /<(\/?)([a-z][-.0-9_a-z]*)\s*([^>]*?)(\/?)>/gi;
		let currentParent = root;
		let lastTextIndex = 0;
		let match: RegExpExecArray;

		while ((match = markupRegexp.exec(data))) {
			const tagName = match[2].toLowerCase();
			const isStartTag = !match[1];

			if (currentParent && match.index !== lastTextIndex) {
				const text = data.substring(lastTextIndex, match.index);
				this.appendTextAndCommentNodes(document, currentParent, text);
			}

			if (isStartTag) {
				const newElement = document.createElement(tagName);
				newElement._setRawAttributes(match[3]);

				debugger;
				if (!SelfClosingElements.includes(tagName) && !SelfClosingSVGElements.includes(tagName)) {
					currentParent = <Element>currentParent.appendChild(newElement);
					stack.push(currentParent);
				} else {
					currentParent.appendChild(newElement);
				}

				lastTextIndex = markupRegexp.lastIndex;
			} else {
				stack.pop();
				currentParent = stack[stack.length - 1];
				lastTextIndex = markupRegexp.lastIndex;
			}
		}

		// Text after last element
		if ((!match && data.length > 0) || (match && lastTextIndex !== match.index)) {
			const text = data.substring(lastTextIndex);
			this.appendTextAndCommentNodes(document, root, text);
		}

		return root;
	}

	/**
	 * Appends text and comment nodes.
	 *
	 * @param  {Document} document Document.
	 * @param  {Node} node Node.
	 * @param  {string} text Text to search in.
	 */
	private static appendTextAndCommentNodes(document: Document, node: Node, text: string): void {
		for (const innerNode of this.getTextAndCommentNodes(document, text)) {
			node.appendChild(innerNode);
		}
	}

	/**
	 * Returns text and comment nodes from a text.
	 *
	 * @param  {Document} document Document.
	 * @param  {string} text Text to search in.
	 * @return {Node[]} Nodes.
	 */
	private static getTextAndCommentNodes(document: Document, text: string): Node[] {
		const nodes = [];
		const commentRegexp = /<!--(.*?)-->/gms;
		let lastIndex = 0;
		let match;

		while ((match = commentRegexp.exec(text))) {
			if (match.index > 0) {
				const textNode = document.createTextNode(text.substring(lastIndex, match.index));
				nodes.push(textNode);
			}
			const commentNode = document.createComment(match[1]);
			nodes.push(commentNode);
			lastIndex = match.index + match[0].length;
		}

		if (lastIndex < text.length - 1) {
			const textNode = document.createTextNode(text.substring(lastIndex));
			nodes.push(textNode);
		}

		return nodes;
	}
}
