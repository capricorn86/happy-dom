import Document from '../nodes/document/Document.js';
import * as PropertySymbol from '../PropertySymbol.js';
import NamespaceURI from '../config/NamespaceURI.js';
import HTMLScriptElement from '../nodes/html-script-element/HTMLScriptElement.js';
import Element from '../nodes/element/Element.js';
import HTMLLinkElement from '../nodes/html-link-element/HTMLLinkElement.js';
import DocumentType from '../nodes/document-type/DocumentType.js';
import Node from '../nodes/node/Node.js';
import DocumentFragment from '../nodes/document-fragment/DocumentFragment.js';
import HTMLElementConfig from '../config/HTMLElementConfig.js';
import * as Entities from 'entities';
import HTMLElementConfigContentModelEnum from '../config/HTMLElementConfigContentModelEnum.js';
import SVGElementConfig from '../config/SVGElementConfig.js';
import StringUtility from '../StringUtility.js';

/**
 * Markup RegExp.
 *
 * Group 1: Beginning of start tag (e.g. "div" in "<div").
 * Group 2: End tag (e.g. "div" in "</div>").
 * Group 3: Comment with ending "--" (e.g. " Comment 1 " in "<!-- Comment 1 -->").
 * Group 4: Comment without ending "--" (e.g. " Comment 1 " in "<!-- Comment 1 >").
 * Group 5: Exclamation mark comment (e.g. "DOCTYPE html" in "<!DOCTYPE html>").
 * Group 6: Processing instruction (e.g. "xml version="1.0"?" in "<?xml version="1.0"?>").
 * Group 7: End of self closing start tag (e.g. "/>" in "<img/>").
 * Group 8: End of start tag (e.g. ">" in "<div>").
 */
const MARKUP_REGEXP =
	/<([^\s/!>?]+)|<\/([^\s/!>?]+)\s*>|<!--([^-]+)-->|<!--([^>]+)>|<!([^>]*)>|<\?([^>]+)>|(\/>)|(>)/gm;

/**
 * Attribute RegExp.
 *
 * Group 1: Attribute name when the attribute has a value using double apostrophe (e.g. "name" in "<div name="value">").
 * Group 2: Attribute value when the attribute has a value using double apostrophe (e.g. "value" in "<div name="value">").
 * Group 3: Attribute name when the attribute has a value using double apostrophe (e.g. "name" in "<div name="value">").
 * Group 4: Attribute value when the attribute has a value using double apostrophe (e.g. "value" in "<div name="value">").
 * Group 5: Attribute end apostrophe when the attribute has a value using double apostrophe (e.g. '"' in "<div name="value">").
 * Group 6: Attribute name when the attribute has a value using single apostrophe (e.g. "name" in "<div name='value'>").
 * Group 7: Attribute value when the attribute has a value using single apostrophe (e.g. "value" in "<div name='value'>").
 * Group 8: Attribute end apostrophe when the attribute has a value using single apostrophe (e.g. "'" in "<div name='value'>").
 * Group 9: Attribute name when the attribute has no value (e.g. "disabled" in "<div disabled>").
 */
const ATTRIBUTE_REGEXP =
	/\s*([a-zA-Z0-9-_:.$@?\\]+) *= *([a-zA-Z0-9-_:.$@?{}/]+)|\s*([a-zA-Z0-9-_:.$@?\\]+) *= *"([^"]*)("{0,1})|\s*([a-zA-Z0-9-_:.$@?\\]+) *= *'([^']*)('{0,1})|\s*([a-zA-Z0-9-_:.$@?\\]+)/gm;

enum MarkupReadStateEnum {
	startOrEndTag = 'startOrEndTag',
	insideStartTag = 'insideStartTag',
	plainTextContent = 'plainTextContent'
}

/**
 * Document type attribute RegExp.
 *
 * Group 1: Attribute value.
 */
const DOCUMENT_TYPE_ATTRIBUTE_REGEXP = /"([^"]+)"/gm;

/**
 * XML parser.
 *
 * @see https://html.spec.whatwg.org/multipage/indices.html
 */
export default class XMLParser {
	/**
	 * Parses XML/HTML and returns a root element.
	 *
	 * @param document Document.
	 * @param xml XML/HTML string.
	 * @param [options] Options.
	 * @param [options.rootNode] Node to append elements to. Otherwise a new DocumentFragment is created.
	 * @param [options.evaluateScripts = false] Set to "true" to enable script execution.
	 * @returns Root node.
	 */
	public static parse(
		document: Document,
		xml: string,
		options?: { rootNode?: Element | DocumentFragment | Document; evaluateScripts?: boolean }
	): Element | DocumentFragment | Document {
		const root = options && options.rootNode ? options.rootNode : document.createDocumentFragment();
		const nodeStack: Node[] = [root];
		const localNameStack: string[] = [null];
		const markupRegexp = new RegExp(MARKUP_REGEXP, 'gm');
		const { evaluateScripts = false } = options || {};
		let newNode: Node | null = null;
		let currentNode: Node | null = root;
		let match: RegExpExecArray;
		let readState: MarkupReadStateEnum = MarkupReadStateEnum.startOrEndTag;
		let startTagIndex = 0;
		let lastIndex = 0;

		if (xml !== null && xml !== undefined) {
			xml = String(xml);

			while ((match = markupRegexp.exec(xml))) {
				switch (readState) {
					case MarkupReadStateEnum.startOrEndTag:
						if (
							match.index !== lastIndex &&
							(match[1] || match[2] || match[3] || match[4] || match[5] !== undefined || match[6])
						) {
							// Plain text between tags.
							currentNode[PropertySymbol.appendChild](
								document.createTextNode(Entities.decodeHTML(xml.substring(lastIndex, match.index))),
								true
							);
						}

						if (match[1]) {
							// Start tag.
							const name = StringUtility.asciiLowerCase(match[1]);

							// NamespaceURI is inherited from the parent element.
							// NamespaceURI should be SVG for SVGSVGElement.
							const namespaceURI =
								name === 'svg'
									? NamespaceURI.svg
									: (<Element>currentNode)[PropertySymbol.namespaceURI] || NamespaceURI.html;

							// SVG elements are resolved to their local name during parsing.
							// This should probably be handled in an XML document.
							const qualifiedName =
								namespaceURI === NamespaceURI.svg && SVGElementConfig[name]
									? SVGElementConfig[name].localName
									: name;

							// Create a new element.
							newNode = document.createElementNS(namespaceURI, qualifiedName);

							readState = MarkupReadStateEnum.insideStartTag;
							startTagIndex = markupRegexp.lastIndex;
						} else if (match[2]) {
							// End tag.

							// We close all tags up until the first tag that matches the end tag.
							const localName = StringUtility.asciiLowerCase(match[2]);
							const index = localNameStack.lastIndexOf(localName);
							if (index !== -1) {
								nodeStack.splice(index, nodeStack.length - index);
								localNameStack.splice(index, localNameStack.length - index);
								currentNode = nodeStack[nodeStack.length - 1] || root;
							}
						} else if (
							match[3] ||
							match[4] ||
							(match[6] &&
								(<Element>currentNode)[PropertySymbol.namespaceURI] === NamespaceURI.html)
						) {
							// Comment.

							let comment: string;

							if (match[3]) {
								comment = match[3];
							} else if (match[4]) {
								comment = match[4].endsWith('--') ? match[4].slice(0, -2) : match[4];
							} else {
								comment = '?' + match[6];
							}

							currentNode[PropertySymbol.appendChild](
								document.createComment(Entities.decodeHTML(comment)),
								true
							);
						} else if (match[5] !== undefined) {
							// Exclamation mark comment.
							// Document type node or comment.
							const exclamationComment = Entities.decodeHTML(match[5]);
							currentNode[PropertySymbol.appendChild](
								this.getDocumentTypeNode(document, exclamationComment) ||
									document.createComment(exclamationComment),
								true
							);
						} else if (match[6]) {
							// Processing instruction (not supported by HTML).
							// TODO: Add support for processing instructions.
						} else {
							// Plain text between tags, including the match as it is not a valid start or end tag.

							currentNode[PropertySymbol.appendChild](
								document.createTextNode(
									Entities.decodeHTML(xml.substring(lastIndex, markupRegexp.lastIndex))
								),
								true
							);
						}

						break;
					case MarkupReadStateEnum.insideStartTag:
						// End of start tag
						if (match[7] || match[8]) {
							// Attribute name and value.

							const attributeString = xml.substring(startTagIndex, match.index);
							let hasAttributeStringEnded = true;

							if (!!attributeString) {
								const attributeRegexp = new RegExp(ATTRIBUTE_REGEXP, 'gm');
								let attributeMatch: RegExpExecArray;

								while ((attributeMatch = attributeRegexp.exec(attributeString))) {
									if (
										(attributeMatch[1] && attributeMatch[2]) ||
										(attributeMatch[3] && attributeMatch[5] === '"') ||
										(attributeMatch[6] && attributeMatch[8] === "'") ||
										attributeMatch[9]
									) {
										// Valid attribute name and value.
										const name =
											attributeMatch[1] ||
											attributeMatch[3] ||
											attributeMatch[6] ||
											attributeMatch[9] ||
											'';
										const rawValue =
											attributeMatch[2] || attributeMatch[4] || attributeMatch[7] || '';
										const value = rawValue ? Entities.decodeHTMLAttribute(rawValue) : '';

										if ((<Element>newNode)[PropertySymbol.namespaceURI] === NamespaceURI.svg) {
											// In XML and SVG namespaces, the attribute "xmlns" should be set to the "http://www.w3.org/2000/xmlns/" namespace.
											const attributeItem = document.createAttributeNS(
												name === 'xmlns' ? NamespaceURI.xmlns : null,
												name
											);
											attributeItem[PropertySymbol.value] = value;
											(<Element>newNode)[PropertySymbol.attributes][PropertySymbol.setNamedItem](
												attributeItem
											);
										} else {
											const attributeItem = document.createAttribute(name);
											attributeItem[PropertySymbol.value] = value;
											(<Element>newNode)[PropertySymbol.attributes][PropertySymbol.setNamedItem](
												attributeItem
											);
										}

										startTagIndex += attributeMatch[0].length;
									} else if (
										!attributeMatch[1] &&
										((attributeMatch[3] && !attributeMatch[5]) ||
											(attributeMatch[6] && !attributeMatch[8]))
									) {
										// End attribute apostrophe is missing (e.g. "attr='value" or 'attr="value').
										hasAttributeStringEnded = false;
										break;
									}
								}
							}

							// We need to check if the attribute string is read completely.
							// The attribute string can potentially contain "/>" or ">".
							if (hasAttributeStringEnded) {
								const config = HTMLElementConfig[(<Element>newNode)[PropertySymbol.localName]];
								const localName = StringUtility.asciiLowerCase(
									(<Element>newNode)[PropertySymbol.localName]
								);

								// Some elements are not allowed to be nested (e.g. "<a><a></a></a>" is not allowed.).
								// Therefore we need to auto-close the tag, so that it become valid (e.g. "<a></a><a></a>").
								if (
									config?.contentModel ===
										HTMLElementConfigContentModelEnum.noFirstLevelSelfDescendants &&
									localNameStack[localNameStack.length - 1] === localName
								) {
									nodeStack.pop();
									localNameStack.pop();
									currentNode = nodeStack[nodeStack.length - 1] || root;
								} else if (
									config?.contentModel === HTMLElementConfigContentModelEnum.noSelfDescendants &&
									localNameStack.includes(localName)
								) {
									while (currentNode !== root) {
										if ((<Element>currentNode)[PropertySymbol.localName] === localName) {
											nodeStack.pop();
											localNameStack.pop();
											currentNode = nodeStack[nodeStack.length - 1] || root;
											break;
										}
										nodeStack.pop();
										localNameStack.pop();
										currentNode = nodeStack[nodeStack.length - 1] || root;
									}
								}

								// Appends the new node to its parent and sets is as current node.
								currentNode[PropertySymbol.appendChild](newNode, true);
								currentNode = newNode;
								nodeStack.push(currentNode);
								localNameStack.push(localName);
								newNode = null;

								// Checks if the tag is a self closing tag (ends with "/>") or void element.
								// When it is a self closing tag or void element it should be closed immediately.
								// Self closing tags are not allowed in the HTML namespace, but the parser should still allow it for void elements.
								// Self closing tags is supported in the SVG namespace.
								if (
									config?.contentModel === HTMLElementConfigContentModelEnum.noDescendants ||
									// SVG tag is self closing (<svg/>).
									(match[7] &&
										(<Element>currentNode)[PropertySymbol.namespaceURI] === NamespaceURI.svg)
								) {
									nodeStack.pop();
									localNameStack.pop();
									currentNode = nodeStack[nodeStack.length - 1] || root;
									readState = MarkupReadStateEnum.startOrEndTag;
								} else {
									readState =
										config?.contentModel === HTMLElementConfigContentModelEnum.rawText
											? MarkupReadStateEnum.plainTextContent
											: MarkupReadStateEnum.startOrEndTag;
								}

								startTagIndex = markupRegexp.lastIndex;
							}
						}

						break;
					case MarkupReadStateEnum.plainTextContent:
						const localName = currentNode[PropertySymbol.localName];

						if (localName && match[2] && StringUtility.asciiLowerCase(match[2]) === localName) {
							// End of plain text tag.

							// Scripts are not allowed to be executed when they are parsed using innerHTML, outerHTML, replaceWith() etc.
							// However, they are allowed to be executed when document.write() is used.
							// See: https://developer.mozilla.org/en-US/docs/Web/API/HTMLScriptElement
							if (localName === 'script') {
								(<HTMLScriptElement>currentNode)[PropertySymbol.evaluateScript] = evaluateScripts;
							} else if (localName === 'link') {
								// An assumption that the same rule should be applied for the HTMLLinkElement is made here.
								(<HTMLLinkElement>currentNode)[PropertySymbol.evaluateCSS] = evaluateScripts;
							}

							// Plain text elements such as <script> and <style> should only contain text.
							currentNode[PropertySymbol.appendChild](
								document.createTextNode(
									Entities.decodeHTML(xml.substring(startTagIndex, match.index))
								),
								true
							);

							nodeStack.pop();
							localNameStack.pop();
							currentNode = nodeStack[nodeStack.length - 1] || root;
							readState = MarkupReadStateEnum.startOrEndTag;
						}

						break;
				}

				lastIndex = markupRegexp.lastIndex;
			}

			// We expected the "newNode" to be null if the start tag was closed correctly.
			// We should append the last node to the current node to correct it.
			if (newNode && currentNode) {
				currentNode[PropertySymbol.appendChild](newNode, true);
			}

			if (lastIndex !== xml.length) {
				// Plain text after tags.

				currentNode[PropertySymbol.appendChild](
					document.createTextNode(Entities.decodeHTML(xml.substring(lastIndex))),
					true
				);
			}
		}

		return root;
	}

	/**
	 * Returns document type node.
	 *
	 * @param document Document.
	 * @param value Value.
	 * @returns Document type node.
	 */
	private static getDocumentTypeNode(document: Document, value: string): DocumentType {
		if (!value.toUpperCase().startsWith('DOCTYPE')) {
			return null;
		}

		const docTypeSplit = value.split(' ');

		if (docTypeSplit.length <= 1) {
			return null;
		}

		const docTypeString = docTypeSplit.slice(1).join(' ');
		const attributes = [];
		const attributeRegExp = new RegExp(DOCUMENT_TYPE_ATTRIBUTE_REGEXP, 'gm');
		const isPublic = docTypeString.toUpperCase().includes('PUBLIC');
		let attributeMatch;

		while ((attributeMatch = attributeRegExp.exec(docTypeString))) {
			attributes.push(attributeMatch[1]);
		}

		const publicId = isPublic ? attributes[0] || '' : '';
		const systemId = isPublic ? attributes[1] || '' : attributes[0] || '';

		return document.implementation.createDocumentType(
			docTypeSplit[1].toLowerCase(),
			publicId,
			systemId
		);
	}
}
