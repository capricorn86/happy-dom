import Element from '../nodes/element/Element.js';
import * as PropertySymbol from '../PropertySymbol.js';
import Node from '../nodes/node/Node.js';
import DocumentType from '../nodes/document-type/DocumentType.js';
import HTMLTemplateElement from '../nodes/html-template-element/HTMLTemplateElement.js';
import NodeTypeEnum from '../nodes/node/NodeTypeEnum.js';
import ProcessingInstruction from '../nodes/processing-instruction/ProcessingInstruction.js';
import * as Entities from 'entities';
import DocumentFragment from '../nodes/document-fragment/DocumentFragment.js';
import ShadowRoot from '../nodes/shadow-root/ShadowRoot.js';
import HTMLElementConfig from '../config/HTMLElementConfig.js';
import HTMLElementConfigContentModelEnum from '../config/HTMLElementConfigContentModelEnum.js';

/**
 * Utility for converting an element to string.
 */
export default class XMLSerializer {
	private options = {
		includeShadowRoots: false,
		escapeEntities: true
	};

	/**
	 * Constructor.
	 *
	 * @param [options] Options.
	 * @param [options.includeShadowRoots] Include shadow roots.
	 * @param [options.escapeEntities] Escape text.
	 */
	constructor(options?: { includeShadowRoots?: boolean; escapeEntities?: boolean }) {
		if (options) {
			if (options.includeShadowRoots !== undefined) {
				this.options.includeShadowRoots = options.includeShadowRoots;
			}

			if (options.escapeEntities !== undefined) {
				this.options.escapeEntities = options.escapeEntities;
			}
		}
	}

	/**
	 * Renders an element as HTML.
	 *
	 * @param root Root element.
	 * @returns Result.
	 */
	public serializeToString(root: Node): string {
		switch (root[PropertySymbol.nodeType]) {
			case NodeTypeEnum.elementNode:
				const element = <Element>root;
				const localName = element[PropertySymbol.localName];
				const config = HTMLElementConfig[element[PropertySymbol.localName]];

				if (config?.contentModel === HTMLElementConfigContentModelEnum.noDescendants) {
					return `<${localName}${this.getAttributes(element)}>`;
				}

				const childNodes =
					localName === 'template'
						? (<DocumentFragment>(<HTMLTemplateElement>root).content)[PropertySymbol.nodeArray]
						: (<DocumentFragment>root)[PropertySymbol.nodeArray];
				let innerHTML = '';

				for (const node of childNodes) {
					innerHTML += this.serializeToString(node);
				}

				// TODO: Should we include closed shadow roots?
				// We are currently only including open shadow roots.
				if (this.options.includeShadowRoots && element.shadowRoot) {
					innerHTML += `<template shadowrootmode="${element.shadowRoot[PropertySymbol.mode]}">`;

					for (const node of (<ShadowRoot>element.shadowRoot)[PropertySymbol.nodeArray]) {
						innerHTML += this.serializeToString(node);
					}

					innerHTML += '</template>';
				}

				return `<${localName}${this.getAttributes(element)}>${innerHTML}</${localName}>`;
			case Node.DOCUMENT_FRAGMENT_NODE:
			case Node.DOCUMENT_NODE:
				let html = '';
				for (const node of (<Node>root)[PropertySymbol.nodeArray]) {
					html += this.serializeToString(node);
				}
				return html;
			case NodeTypeEnum.commentNode:
				return `<!--${root.textContent}-->`;
			case NodeTypeEnum.processingInstructionNode:
				// TODO: Add support for processing instructions.
				return `<!--?${(<ProcessingInstruction>root).target} ${root.textContent}?-->`;
			case NodeTypeEnum.textNode:
				return this.options.escapeEntities
					? Entities.escapeText(root.textContent)
					: root.textContent;
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

		if (
			!(<Element>element)[PropertySymbol.attributes].getNamedItem('is') &&
			(<Element>element)[PropertySymbol.isValue]
		) {
			attributeString += ' is="' + (<Element>element)[PropertySymbol.isValue] + '"';
		}

		for (const attribute of (<Element>element)[PropertySymbol.attributes][
			PropertySymbol.namedItems
		].values()) {
			const escapedValue = this.options.escapeEntities
				? Entities.escapeText(attribute[PropertySymbol.value])
				: attribute[PropertySymbol.value];
			attributeString += ' ' + attribute[PropertySymbol.name] + '="' + escapedValue + '"';
		}

		return attributeString;
	}
}
