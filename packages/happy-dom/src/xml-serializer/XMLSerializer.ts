import Element from '../nodes/element/Element.js';
import * as PropertySymbol from '../PropertySymbol.js';
import Node from '../nodes/node/Node.js';
import DocumentType from '../nodes/document-type/DocumentType.js';
import HTMLTemplateElement from '../nodes/html-template-element/HTMLTemplateElement.js';
import NodeTypeEnum from '../nodes/node/NodeTypeEnum.js';
import * as Entities from 'entities';
import DocumentFragment from '../nodes/document-fragment/DocumentFragment.js';
import HTMLElementConfig from '../config/HTMLElementConfig.js';
import HTMLElementConfigContentModelEnum from '../config/HTMLElementConfigContentModelEnum.js';
import Document from '../nodes/document/Document.js';
import ProcessingInstruction from '../nodes/processing-instruction/ProcessingInstruction.js';
import XMLDocument from '../nodes/xml-document/XMLDocument.js';

/**
 * Serializes a node into XML.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/XMLSerializer
 */
export default class XMLSerializer {
	public [PropertySymbol.rootNode]: Node | null = null;

	/**
	 * Renders an element as HTML.
	 *
	 * @param root Root element.
	 * @returns Result.
	 */
	public serializeToString(root: Node): string {
		if (!this[PropertySymbol.rootNode]) {
			this[PropertySymbol.rootNode] = root;
		}

		switch (root[PropertySymbol.nodeType]) {
			case NodeTypeEnum.elementNode:
				const element = <Element>root;
				const localName = element[PropertySymbol.localName];
				const config = HTMLElementConfig[element[PropertySymbol.localName]];

				if (config?.contentModel === HTMLElementConfigContentModelEnum.noDescendants) {
					return `<${localName}${this.getAttributes(element)}>`;
				}

				let innerHTML = '';

				const childNodes =
					localName === 'template'
						? (<DocumentFragment>(<HTMLTemplateElement>root).content)[PropertySymbol.nodeArray]
						: (<DocumentFragment>root)[PropertySymbol.nodeArray];

				for (const node of childNodes) {
					innerHTML += this.serializeToString(node);
				}

				if (!innerHTML) {
					return `<${localName}${this.getAttributes(element)}/>`;
				}

				return `<${localName}${this.getAttributes(element)}>${innerHTML}</${localName}>`;
			case Node.DOCUMENT_FRAGMENT_NODE:
			case Node.DOCUMENT_NODE:
				let html = root instanceof XMLDocument ? '<?xml version="1.0" encoding="UTF-8"?>' : '';
				for (const node of (<Node>root)[PropertySymbol.nodeArray]) {
					html += this.serializeToString(node);
				}
				return html;
			case NodeTypeEnum.commentNode:
				return `<!--${root.textContent}-->`;
			case NodeTypeEnum.processingInstructionNode:
				return `<?${(<ProcessingInstruction>root).target} ${root.textContent}?>`;
			case NodeTypeEnum.textNode:
				const parentElement = root.parentElement;
				if (parentElement) {
					const parentConfig = HTMLElementConfig[parentElement[PropertySymbol.localName]];
					if (parentConfig?.contentModel === HTMLElementConfigContentModelEnum.rawText) {
						return root.textContent;
					}
				}
				return Entities.escapeText(root.textContent);
			case NodeTypeEnum.documentTypeNode:
				const doctype = <DocumentType>root;
				const identifier = doctype.publicId ? ' PUBLIC' : doctype.systemId ? ' SYSTEM' : '';
				const publicId = doctype.publicId ? ` "${doctype.publicId}"` : '';
				const systemId = doctype.systemId ? ` "${doctype.systemId}"` : '';
				return `<!DOCTYPE ${doctype.name}${identifier}${publicId}${systemId}>`;
		}

		return '';
	}

	/**
	 * Returns attributes as a string.
	 *
	 * @param element Element.
	 * @returns Attributes.
	 */
	private getAttributes(element: Element): string {
		let attributeString = '';

		const namedItems = (<Element>element)[PropertySymbol.attributes][PropertySymbol.namedItems];
		const parentNamespaceURI = this.getNamespaceURI(this[PropertySymbol.parentNode]);
		const namespaceURI = this.getNamespaceURI(element);

		// We should add the namespace as an "xmlns" attribute if the element is the root element or if the namespace is different from the parent namespace.
		if (
			this[PropertySymbol.rootNode] === element ||
			(parentNamespaceURI && namespaceURI !== parentNamespaceURI)
		) {
			if (namespaceURI) {
				attributeString += ' xmlns="' + namespaceURI + '"';
			}
		}

		if (!namedItems.has('is') && element[PropertySymbol.isValue]) {
			attributeString += ' is="' + element[PropertySymbol.isValue] + '"';
		}

		for (const attribute of namedItems.values()) {
			// TODO: Attributes with the name "xmlns" are not serialized as they collide with the namespace attribute. Is this correct?
			if (attribute[PropertySymbol.name] !== 'xmlns') {
				const escapedValue = Entities.escapeAttribute(attribute[PropertySymbol.value]);
				attributeString += ' ' + attribute[PropertySymbol.name] + '="' + escapedValue + '"';
			}
		}

		return attributeString;
	}

	/**
	 * Returns the namespace URI of a node.
	 *
	 * @param node Node.
	 */
	private getNamespaceURI(node: Node): string {
		if (!node) {
			return null;
		}
		if (node instanceof Document) {
			return node.documentElement[PropertySymbol.namespaceURI];
		}

		return node[PropertySymbol.namespaceURI];
	}
}
