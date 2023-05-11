import Element from '../nodes/element/Element';
import Node from '../nodes/node/Node';
import VoidElements from '../config/VoidElements';
import DocumentType from '../nodes/document-type/DocumentType';
import INode from '../nodes/node/INode';
import IElement from '../nodes/element/IElement';
import IHTMLTemplateElement from '../nodes/html-template-element/IHTMLTemplateElement';
import NodeTypeEnum from '../nodes/node/NodeTypeEnum';
import IProcessingInstruction from '../nodes/processing-instruction/IProcessingInstruction';
import * as Entities from 'entities';

/**
 * Utility for converting an element to string.
 */
export default class XMLSerializer {
	public _options = {
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
				this._options.includeShadowRoots = options.includeShadowRoots;
			}

			if (options.escapeEntities !== undefined) {
				this._options.escapeEntities = options.escapeEntities;
			}
		}
	}

	/**
	 * Renders an element as HTML.
	 *
	 * @param root Root element.
	 * @returns Result.
	 */
	public serializeToString(root: INode): string {
		switch (root.nodeType) {
			case NodeTypeEnum.elementNode:
				const element = <Element>root;
				const tagName = element.tagName.toLowerCase();

				if (VoidElements[element.tagName]) {
					return `<${tagName}${this._getAttributes(element)}>`;
				}

				const childNodes =
					tagName === 'template'
						? (<IHTMLTemplateElement>root).content.childNodes
						: root.childNodes;
				let innerHTML = '';

				for (const node of childNodes) {
					innerHTML += this.serializeToString(node);
				}

				if (this._options.includeShadowRoots && element.shadowRoot) {
					innerHTML += `<template shadowrootmode="${element.shadowRoot.mode}">`;

					for (const node of element.shadowRoot.childNodes) {
						innerHTML += this.serializeToString(node);
					}

					innerHTML += '</template>';
				}

				return `<${tagName}${this._getAttributes(element)}>${innerHTML}</${tagName}>`;
			case Node.DOCUMENT_FRAGMENT_NODE:
			case Node.DOCUMENT_NODE:
				let html = '';
				for (const node of root.childNodes) {
					html += this.serializeToString(node);
				}
				return html;
			case NodeTypeEnum.commentNode:
				return `<!--${root.textContent}-->`;
			case NodeTypeEnum.processingInstructionNode:
				// TODO: Add support for processing instructions.
				return `<!--?${(<IProcessingInstruction>root).target} ${root.textContent}?-->`;
			case NodeTypeEnum.textNode:
				return this._options.escapeEntities
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
	private _getAttributes(element: IElement): string {
		let attributeString = '';

		if (!(<Element>element)._attributes.is && (<Element>element)._isValue) {
			attributeString += ' is="' + (<Element>element)._isValue + '"';
		}

		for (const attribute of Object.values((<Element>element)._attributes)) {
			if (attribute.value !== null) {
				const escapedValue = this._options.escapeEntities
					? Entities.escapeText(attribute.value)
					: attribute.value;
				attributeString += ' ' + attribute.name + '="' + escapedValue + '"';
			}
		}
		return attributeString;
	}
}
