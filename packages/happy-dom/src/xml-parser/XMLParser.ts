import IDocument from '../nodes/document/IDocument';
import VoidElements from '../config/VoidElements';
import UnnestableElements from '../config/UnnestableElements';
import NamespaceURI from '../config/NamespaceURI';
import HTMLScriptElement from '../nodes/html-script-element/HTMLScriptElement';
import IElement from '../nodes/element/IElement';
import HTMLLinkElement from '../nodes/html-link-element/HTMLLinkElement';
import PlainTextElements from '../config/PlainTextElements';
import IDocumentType from '../nodes/document-type/IDocumentType';
import INode from '../nodes/node/INode';
import IDocumentFragment from '../nodes/document-fragment/IDocumentFragment';
import { decode } from 'he';

/**
 * Markup RegExp.
 *
 * Group 1: Comment (e.g. " Comment 1 " in "<!-- Comment 1 -->").
 * Group 2: Exclamation mark comment (e.g. "DOCTYPE html" in "<!DOCTYPE html>").
 * Group 3: Processing instruction(e.g. "xml"" in "<?xml version="1.0"?>").
 * Group 4: Start tag (e.g. "div" in "<div").
 * Group 5: Self-closing end of start tag (e.g. "/>" in "<div/>").
 * Group 6: End of start tag (e.g. ">" in "<div>").
 * Group 7: End tag (e.g. "div" in "</div>").
 */
const MARKUP_REGEXP =
	/<!--([^->]+)-{0,2}>|<!([^>]+)>|<\?([^>]+)>|<([a-zA-Z0-9-]+)|\s*(\/>)|\s*(>)|<\/([a-zA-Z0-9-]+)>/gm;

/**
 * Attribute RegExp.
 *
 * Group 1: Attribute name when the attribute has a value using double apostrophe (e.g. "name" in "<div name="value">").
 * Group 2: Attribute apostrophe value using double apostrophe (e.g. "value" in "<div name="value">").
 * Group 3: Attribute value when the attribute has a value using double apostrophe (e.g. "value" in "<div name="value">").
 * Group 4: Attribute apostrophe when the attribute has a value using double apostrophe (e.g. "value" in "<div name="value">").
 * Group 5: Attribute name when the attribute has a value using single apostrophe (e.g. "name" in "<div name='value'>").
 * Group 6: Attribute apostrophe when the attribute has a value using single apostrophe (e.g. "name" in "<div name='value'>").
 * Group 7: Attribute value when the attribute has a value using single apostrophe (e.g. "value" in "<div name='value'>").
 * Group 8: Attribute apostrophe when the attribute has a value using single apostrophe (e.g. "name" in "<div name='value'>").
 * Group 9: Attribute name when the attribute has no value (e.g. "disabled" in "<div disabled>").
 */
const ATTRIBUTE_REGEXP =
	/\s*([a-zA-Z0-9-_:]+) *= *("{0,1})([^"]*)("{0,1})|\s*([a-zA-Z0-9-_:]+) *= *('{0,1})([^']*)('{0,1})|\s*([a-zA-Z0-9-_:]+)/gm;

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
		document: IDocument,
		xml: string,
		options?: { rootNode?: IElement | IDocumentFragment | IDocument; evaluateScripts?: boolean }
	): IElement | IDocumentFragment | IDocument {
		const root = options && options.rootNode ? options.rootNode : document.createDocumentFragment();
		const stack: INode[] = [root];
		const markupRegexp = new RegExp(MARKUP_REGEXP, 'gm');
		const { evaluateScripts = false } = options || {};
		const unnestableTagNames: string[] = [];
		let currentNode: INode | null = root;
		let match: RegExpExecArray;
		let plainTextTagName: string | null = null;
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
							(match[1] || match[2] || match[3] || match[4] || match[7])
						) {
							// Plain text between tags.

							currentNode.appendChild(
								document.createTextNode(xml.substring(lastIndex, match.index))
							);
						}

						if (
							match[1] ||
							(match[3] && (<IElement>currentNode).namespaceURI === NamespaceURI.html)
						) {
							// Comment.

							const comment = match[1] ? match[1] : '?' + match[3];

							// @Refer https://en.wikipedia.org/wiki/Conditional_comment
							// @Refer: https://learn.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/
							if (comment.startsWith('[if ') && comment.endsWith(']')) {
								readState = MarkupReadStateEnum.plainTextContent;
								startTagIndex = match.index + 4;
							} else {
								currentNode.appendChild(document.createComment(comment));
							}
						} else if (match[2]) {
							// Exclamation mark comment (usually <!DOCTYPE>).

							currentNode.appendChild(
								this.getDocumentTypeNode(document, match[2]) || document.createComment(match[2])
							);
						} else if (match[3]) {
							// Processing instruction (not supported by HTML).
							// TODO: Add support for processing instructions.
						} else if (match[4]) {
							// Start tag.

							const tagName = match[4].toUpperCase();

							// Some elements are not allowed to be nested (e.g. "<a><a></a></a>" is not allowed.).
							// Therefore we need to auto-close the tag, so that it become valid (e.g. "<a></a><a></a>").
							const unnestableTagNameIndex = unnestableTagNames.indexOf(tagName);
							if (unnestableTagNameIndex !== -1) {
								unnestableTagNames.splice(unnestableTagNameIndex, 1);
								while (currentNode !== root) {
									if ((<IElement>currentNode).tagName === tagName) {
										stack.pop();
										currentNode = stack[stack.length - 1] || root;
										break;
									}
									stack.pop();
									currentNode = stack[stack.length - 1] || root;
								}
							}

							// NamespaceURI is inherited from the parent element.
							// It should default to SVG for SVG elements.
							const namespaceURI =
								tagName === 'SVG'
									? NamespaceURI.svg
									: (<IElement>currentNode).namespaceURI || NamespaceURI.html;
							const newElement = document.createElementNS(namespaceURI, tagName);

							currentNode.appendChild(newElement);
							currentNode = newElement;
							stack.push(currentNode);
							readState = MarkupReadStateEnum.insideStartTag;
							startTagIndex = markupRegexp.lastIndex;
						} else if (match[7]) {
							// End tag.

							if (match[7].toUpperCase() === (<IElement>currentNode).tagName) {
								// Some elements are not allowed to be nested (e.g. "<a><a></a></a>" is not allowed.).
								// Therefore we need to auto-close the tag, so that it become valid (e.g. "<a></a><a></a>").
								const unnestableTagNameIndex = unnestableTagNames.indexOf(
									(<IElement>currentNode).tagName
								);
								if (unnestableTagNameIndex !== -1) {
									unnestableTagNames.splice(unnestableTagNameIndex, 1);
								}

								stack.pop();
								currentNode = stack[stack.length - 1] || root;
							}
						} else {
							// Plain text between tags, including the match as it is not a valid start or end tag.

							currentNode.appendChild(
								document.createTextNode(xml.substring(lastIndex, markupRegexp.lastIndex))
							);
						}
						break;
					case MarkupReadStateEnum.insideStartTag:
						// Self-closing or non-self-closing tag.
						if (match[5] || match[6]) {
							// End of start tag.

							// Attribute name and value.

							const attributeString = xml.substring(startTagIndex, match.index);
							let hasAttributeStringEnded = true;

							if (!!attributeString) {
								const attributeRegexp = new RegExp(ATTRIBUTE_REGEXP, 'gm');
								let attributeMatch: RegExpExecArray;

								while ((attributeMatch = attributeRegexp.exec(attributeString))) {
									if (
										(attributeMatch[1] && attributeMatch[2] === attributeMatch[4]) ||
										(attributeMatch[5] && attributeMatch[6] === attributeMatch[8]) ||
										attributeMatch[9]
									) {
										// Valid attribute name and value.

										const name = attributeMatch[1] || attributeMatch[5] || attributeMatch[9] || '';
										const rawValue = attributeMatch[3] || attributeMatch[7] || '';
										const value = rawValue ? decode(rawValue) : '';
										const namespaceURI =
											(<IElement>currentNode).tagName === 'SVG' && name === 'xmlns' ? value : null;

										(<IElement>currentNode).setAttributeNS(namespaceURI, name, value);

										startTagIndex += attributeMatch[0].length;
									} else if (!attributeMatch[4] && !attributeMatch[8]) {
										// End attribute apostrophe is missing (e.g. "attr='value" or 'attr="value').

										hasAttributeStringEnded = false;
										break;
									}
								}
							}

							// We need to check if the attribute string is read completely.
							// The attribute string can potentially contain "/>" or ">".
							if (hasAttributeStringEnded) {
								// Checks if the tag is a self closing tag (ends with "/>") or void element.
								// When it is a self closing tag or void element it should be closed immediately.
								// Self closing tags are not allowed in the HTML namespace, but the parser should still allow it for void elements.
								// Self closing tags is supported in the SVG namespace.
								if (
									(match[5] && (<IElement>currentNode).namespaceURI === NamespaceURI.svg) ||
									VoidElements[(<IElement>currentNode).tagName]
								) {
									stack.pop();
									currentNode = stack[stack.length - 1] || root;
									readState = MarkupReadStateEnum.startOrEndTag;
								} else {
									// Plain text elements such as <script> and <style> should only contain text.
									plainTextTagName = PlainTextElements[(<IElement>currentNode).tagName]
										? (<IElement>currentNode).tagName
										: null;

									readState = !!plainTextTagName
										? MarkupReadStateEnum.plainTextContent
										: MarkupReadStateEnum.startOrEndTag;

									if (UnnestableElements[(<IElement>currentNode).tagName]) {
										unnestableTagNames.push((<IElement>currentNode).tagName);
									}
								}

								startTagIndex = markupRegexp.lastIndex;
							}
						}

						break;
					case MarkupReadStateEnum.plainTextContent:
						if (!!plainTextTagName && match[7] && match[7].toUpperCase() === plainTextTagName) {
							// End of plain text tag.

							// Scripts are not allowed to be executed when they are parsed using innerHTML, outerHTML, replaceWith() etc.
							// However, they are allowed to be executed when document.write() is used.
							// See: https://developer.mozilla.org/en-US/docs/Web/API/HTMLScriptElement
							if (plainTextTagName === 'SCRIPT') {
								(<HTMLScriptElement>currentNode)._evaluateScript = evaluateScripts;
							} else if (plainTextTagName === 'LINK') {
								// An assumption that the same rule should be applied for the HTMLLinkElement is made here.
								(<HTMLLinkElement>currentNode)._evaluateCSS = evaluateScripts;
							}

							// Plain text elements such as <script> and <style> should only contain text.
							currentNode.appendChild(
								document.createTextNode(xml.substring(startTagIndex, match.index))
							);

							stack.pop();
							currentNode = stack[stack.length - 1] || root;
							plainTextTagName = null;
							readState = MarkupReadStateEnum.startOrEndTag;
						} else if (
							!plainTextTagName &&
							(match[1] === '[endif]' || match[2] === '[endif]' || match[2] === '[endif]--')
						) {
							// End of conditional comment.

							currentNode.appendChild(
								document.createComment(
									xml.substring(
										startTagIndex,
										markupRegexp.lastIndex - 1 - ((match[1] || match[2]).endsWith('-') ? 2 : 0)
									)
								)
							);

							readState = MarkupReadStateEnum.startOrEndTag;
						}

						break;
				}

				lastIndex = markupRegexp.lastIndex;
			}

			if (lastIndex !== xml.length) {
				// Plain text after tags.

				currentNode.appendChild(document.createTextNode(xml.substring(lastIndex)));
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
	private static getDocumentTypeNode(document: IDocument, value: string): IDocumentType {
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
