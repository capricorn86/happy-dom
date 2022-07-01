import Element from '../nodes/element/Element';
import Node from '../nodes/node/Node';
import VoidElements from '../config/VoidElements';
import DocumentType from '../nodes/document-type/DocumentType';
import { escape } from 'he';
import INode from '../nodes/node/INode';
import IElement from '../nodes/element/IElement';
import IHTMLTemplateElement from '../nodes/html-template-element/IHTMLTemplateElement';

/**
 * Utility for converting an element to string.
 */
export default class XMLSerializer {
	/**
	 * Renders an element as HTML.
	 *
	 * @param root Root element.
	 * @param [options] Options.
	 * @param [options.includeShadowRoots] Set to "true" to include shadow roots.
	 * @returns Result.
	 */
	public serializeToString(root: INode, options?: { includeShadowRoots?: boolean }): string {
		switch (root.nodeType) {
			case Node.ELEMENT_NODE:
				const element = <Element>root;
				const tagName = element.tagName.toLowerCase();

				if (VoidElements.includes(tagName)) {
					return `<${tagName}${this._getAttributes(element)}>`;
				}

				const childNodes =
					element.tagName === 'TEMPLATE'
						? (<IHTMLTemplateElement>root).content.childNodes
						: root.childNodes;
				let innerHTML = '';

				for (const node of childNodes) {
					innerHTML += this.serializeToString(node, options);
				}

				if (options?.includeShadowRoots && element.shadowRoot) {
					innerHTML += `<template shadowroot="${element.shadowRoot.mode}">`;

					for (const node of element.shadowRoot.childNodes) {
						innerHTML += this.serializeToString(node, options);
					}

					innerHTML += '</template>';
				}

				return `<${tagName}${this._getAttributes(element)}>${innerHTML}</${tagName}>`;
			case Node.DOCUMENT_FRAGMENT_NODE:
			case Node.DOCUMENT_NODE:
				let html = '';
				for (const node of root.childNodes) {
					html += this.serializeToString(node, options);
				}
				return html;
			case Node.COMMENT_NODE:
				return `<!--${root.textContent}-->`;
			case Node.TEXT_NODE:
				return root['textContent'];
			case Node.DOCUMENT_TYPE_NODE:
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
			attributeString += ' is="' + escape((<Element>element)._isValue) + '"';
		}

		for (const attribute of Object.values((<Element>element)._attributes)) {
			if (attribute.value !== null) {
				attributeString += ' ' + attribute.name + '="' + escape(attribute.value) + '"';
			}
		}
		return attributeString;
	}
}
