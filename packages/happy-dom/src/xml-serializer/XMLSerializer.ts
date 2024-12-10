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
import ProcessingInstruction from '../nodes/processing-instruction/ProcessingInstruction.js';
import NamespaceURI from '../config/NamespaceURI.js';

/**
 * Serializes a node into XML.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/XMLSerializer
 */
export default class XMLSerializer {
	/**
	 * Serializes a node into XML.
	 *
	 * @param root Root node.
	 * @returns Result.
	 */
	public serializeToString(root: Node): string {
		return this.#serializeToString(root);
	}

	/**
	 * Serializes a node into XML.
	 *
	 * @param root Root node.
	 * @param [inheritedDefaultNamespace] Default namespace.
	 * @param [inheritedNamespacePrefixes] Inherited namespace prefixes.
	 * @returns Result.
	 */
	#serializeToString(
		root: Node,
		inheritedDefaultNamespace: string | null = null,
		inheritedNamespacePrefixes: Map<string, string> = null
	): string {
		switch (root[PropertySymbol.nodeType]) {
			case NodeTypeEnum.elementNode:
				const element = <Element>root;
				const localName = element[PropertySymbol.localName];

				let innerHTML = '';

				const childNodes =
					localName === 'template'
						? (<DocumentFragment>(<HTMLTemplateElement>root).content)[PropertySymbol.nodeArray]
						: (<DocumentFragment>root)[PropertySymbol.nodeArray];

				const namespacePrefixes = this.#getNamespacePrefixes(element, inheritedNamespacePrefixes);
				const elementPrefix = this.#getElementPrefix(element, namespacePrefixes);
				const tagName = `${elementPrefix ? elementPrefix + ':' : ''}${localName}`;
				const defaultNamespace = elementPrefix
					? inheritedDefaultNamespace
					: element[PropertySymbol.namespaceURI] || inheritedDefaultNamespace;
				const attributes = this.#getAttributes(
					element,
					elementPrefix,
					inheritedDefaultNamespace,
					inheritedNamespacePrefixes
				);

				for (const node of childNodes) {
					innerHTML += this.#serializeToString(node, defaultNamespace, namespacePrefixes);
				}

				if (!innerHTML && defaultNamespace !== NamespaceURI.html) {
					return `<${tagName}${attributes}/>`;
				}

				return `<${tagName}${attributes}>${innerHTML}</${tagName}>`;
			case Node.DOCUMENT_FRAGMENT_NODE:
			case Node.DOCUMENT_NODE:
				let html = root[PropertySymbol.hasXMLProcessingInstruction]
					? '<?xml version="1.0" encoding="UTF-8"?>'
					: '';
				for (const node of (<Node>root)[PropertySymbol.nodeArray]) {
					html += this.#serializeToString(
						node,
						inheritedDefaultNamespace,
						new Map(inheritedNamespacePrefixes)
					);
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
	 * Returns namespace prefixes.
	 *
	 * @param element Element.
	 * @param inheritedNamespacePrefixes Inherited namespace prefixes.
	 * @returns Namespace prefixes.
	 */
	#getNamespacePrefixes(
		element: Element,
		inheritedNamespacePrefixes: Map<string, string> | null
	): Map<string, string> | null {
		const namespacePrefixes = new Map<string, string>(inheritedNamespacePrefixes);
		const namedItems = (<Element>element)[PropertySymbol.attributes][PropertySymbol.namedItems];

		for (const attribute of namedItems.values()) {
			if (
				attribute[PropertySymbol.namespaceURI] === NamespaceURI.xmlns &&
				attribute[PropertySymbol.prefix]
			) {
				namespacePrefixes.set(attribute[PropertySymbol.value], attribute[PropertySymbol.localName]);
			}
		}

		return namespacePrefixes;
	}

	/**
	 * Returns namespace prefixes.
	 *
	 * @param element Element.
	 * @param namespacePrefixes Inherited namespace prefixes.
	 * @returns Element prefix.
	 */
	#getElementPrefix(
		element: Element,
		namespacePrefixes: Map<string, string> | null
	): string | null {
		if (element[PropertySymbol.prefix] && !element[PropertySymbol.namespaceURI]) {
			throw new Error('Element has a prefix but no namespace.');
		}

		if (!element[PropertySymbol.prefix]) {
			return null;
		}

		const elementPrefix = namespacePrefixes.get(element[PropertySymbol.namespaceURI]);

		if (elementPrefix) {
			return elementPrefix;
		}

		const existingPrefixes = new Set(namespacePrefixes.values());

		if (existingPrefixes.has(element[PropertySymbol.prefix])) {
			let i = 1;
			while (existingPrefixes.has('n' + i)) {
				i++;
			}
			namespacePrefixes.set(element[PropertySymbol.namespaceURI], 'n' + i);
			return 'n' + i;
		}

		namespacePrefixes.set(element[PropertySymbol.namespaceURI], element[PropertySymbol.prefix]);

		return element[PropertySymbol.prefix];
	}

	/**
	 * Returns attributes as a string.
	 *
	 * @param element Element.
	 * @param elementPrefix Element prefix.
	 * @param inheritedDefaultNamespace Inherited default namespace.
	 * @param inheritedNamespacePrefixes Inherited namespace prefixes.
	 * @returns Attributes.
	 */
	#getAttributes(
		element: Element,
		elementPrefix: string | null,
		inheritedDefaultNamespace: string | null,
		inheritedNamespacePrefixes: Map<string, string> | null
	): string {
		let attributeString = '';
		let namespaceString = '';

		const namedItems = (<Element>element)[PropertySymbol.attributes][PropertySymbol.namedItems];
		const handledNamespaces = new Set();

		for (const attribute of namedItems.values()) {
			const escapedValue = Entities.encode(attribute[PropertySymbol.value], {
				level: Entities.EntityLevel.XML
			});

			// Namespace attributes should be in the beginning of the string.
			if (attribute[PropertySymbol.namespaceURI] === NamespaceURI.xmlns) {
				namespaceString += ` ${attribute[PropertySymbol.name]}="${escapedValue}"`;
				handledNamespaces.add(attribute[PropertySymbol.value]);
			} else {
				attributeString += ` ${attribute[PropertySymbol.name]}="${escapedValue}"`;
			}
		}

		// We should add the namespace as an attribute if it has not been added yet.
		if (
			element[PropertySymbol.namespaceURI] &&
			!handledNamespaces.has(element[PropertySymbol.namespaceURI])
		) {
			if (elementPrefix && !inheritedNamespacePrefixes.has(element[PropertySymbol.namespaceURI])) {
				namespaceString += ` xmlns:${elementPrefix}="${Entities.encode(
					element[PropertySymbol.namespaceURI],
					{ level: Entities.EntityLevel.XML }
				)}"`;
			} else if (
				!elementPrefix &&
				inheritedDefaultNamespace !== element[PropertySymbol.namespaceURI]
			) {
				namespaceString += ` xmlns="${Entities.encode(element[PropertySymbol.namespaceURI], {
					level: Entities.EntityLevel.XML
				})}"`;
			}
		}

		// We should add the "is" attribute if the element was created using the "is" option.
		if (!namedItems.has('is') && element[PropertySymbol.isValue]) {
			attributeString += ` is="${Entities.encode(element[PropertySymbol.isValue], {
				level: Entities.EntityLevel.XML
			})}"`;
		}

		return namespaceString + attributeString;
	}
}
