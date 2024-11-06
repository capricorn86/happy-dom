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
	public [PropertySymbol.options]: {
		serializableShadowRoots: boolean;
		shadowRoots: ShadowRoot[] | null;
		allShadowRoots: boolean;
	} = {
		serializableShadowRoots: false,
		shadowRoots: null,
		allShadowRoots: false
	};

	/**
	 * Renders an element as HTML.
	 *
	 * @param root Root element.
	 * @returns Result.
	 */
	public serializeToString(root: Node): string {
		const options = this[PropertySymbol.options];

		switch (root[PropertySymbol.nodeType]) {
			case NodeTypeEnum.elementNode:
				const element = <Element>root;
				const localName = element[PropertySymbol.localName];
				const config = HTMLElementConfig[element[PropertySymbol.localName]];

				if (config?.contentModel === HTMLElementConfigContentModelEnum.noDescendants) {
					return `<${localName}${this.getAttributes(element)}>`;
				}

				let innerHTML = '';

				// TODO: Should we include closed shadow roots? We are currently only including open shadow roots.
				if (
					element.shadowRoot &&
					(options.allShadowRoots ||
						(options.serializableShadowRoots && element.shadowRoot[PropertySymbol.serializable]) ||
						options.shadowRoots?.includes(element.shadowRoot))
				) {
					innerHTML += `<template shadowrootmode="${element.shadowRoot[PropertySymbol.mode]}"${
						element.shadowRoot[PropertySymbol.serializable] ? ' shadowrootserializable=""' : ''
					}>`;

					for (const node of (<ShadowRoot>element.shadowRoot)[PropertySymbol.nodeArray]) {
						innerHTML += this.serializeToString(node);
					}

					innerHTML += '</template>';
				}

				const childNodes =
					localName === 'template'
						? (<DocumentFragment>(<HTMLTemplateElement>root).content)[PropertySymbol.nodeArray]
						: (<DocumentFragment>root)[PropertySymbol.nodeArray];

				for (const node of childNodes) {
					innerHTML += this.serializeToString(node);
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

		if (
			!(<Element>element)[PropertySymbol.attributes].getNamedItem('is') &&
			(<Element>element)[PropertySymbol.isValue]
		) {
			attributeString += ' is="' + (<Element>element)[PropertySymbol.isValue] + '"';
		}

		for (const attribute of (<Element>element)[PropertySymbol.attributes][
			PropertySymbol.namedItems
		].values()) {
			const escapedValue = Entities.escapeAttribute(attribute[PropertySymbol.value]);
			attributeString += ' ' + attribute[PropertySymbol.name] + '="' + escapedValue + '"';
		}

		return attributeString;
	}
}
