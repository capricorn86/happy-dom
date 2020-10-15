import {
	Node,
	Element,
	DocumentType,
	ShadowRoot,
	SelfClosingHTMLElements,
	UnclosedHTMLElements
} from 'happy-dom';
import ShadowRootRenderer from './shadow-root/ShadowRootRenderer';
import IHappyDOMServerRenderOptions from './IHappyDOMServerRenderOptions';
import HappyDOMServerRenderResult from './HappyDOMServerRenderResult';
import { encode } from 'he';

/**
 * Utility for converting an element to string.
 *
 * @class QuerySelector
 */
export default class HappyDOMServerRenderer {
	private renderOptions: IHappyDOMServerRenderOptions;
	private shadowRootRenderer: ShadowRootRenderer;

	/**
	 * Renders an element as HTML.
	 *
	 * @param [renderOptions] Render this.renderOptions.
	 */
	constructor(renderOptions: IHappyDOMServerRenderOptions = {}) {
		this.renderOptions = renderOptions;
		this.shadowRootRenderer = new ShadowRootRenderer(renderOptions);
	}

	/**
	 * Renders an element as HTML.
	 *
	 * @param node Node to render.
	 * @return Result.
	 */
	public render(root: Node): HappyDOMServerRenderResult {
		return {
			html: this.serializeToString(root),
			css: this.renderOptions.openShadowRoots ? this.shadowRootRenderer.getScopedCSS() : []
		};
	}

	/**
	 * Renders an element as HTML.
	 *
	 * @param element Element to render.
	 * @return Result.
	 */
	private serializeToString(root: Node): string {
		switch (root.nodeType) {
			case Node.ELEMENT_NODE:
				const element = <Element>root;
				const tagName = element.tagName.toLowerCase();

				if (UnclosedHTMLElements.includes(tagName)) {
					return `<${tagName}${this._getAttributes(element)}>`;
				} else if (SelfClosingHTMLElements.includes(tagName)) {
					return `<${tagName}${this._getAttributes(element)}/>`;
				}

				let innerElement = <Element | ShadowRoot>element;
				let outerElement = element;
				let innerHTML = '';

				if (this.renderOptions.openShadowRoots && element.shadowRoot) {
					outerElement = this.shadowRootRenderer.getScopedClone(element);
					innerElement = outerElement.shadowRoot;
				}

				for (const node of innerElement.childNodes) {
					innerHTML += this.render(node).html;
				}

				return `<${tagName}${this._getAttributes(outerElement)}>${innerHTML}</${tagName}>`;
			case Node.DOCUMENT_FRAGMENT_NODE:
			case Node.DOCUMENT_NODE:
				let html = '';
				for (const node of root.childNodes) {
					html += this.serializeToString(node);
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
	 * @return Attributes.
	 */
	private _getAttributes(element: Element): string {
		const attributes = [];
		for (const attribute of Object.values(element._attributes)) {
			if (attribute.value !== null) {
				attributes.push(attribute.name + '="' + encode(attribute.value) + '"');
			}
		}
		return attributes.length > 0 ? ' ' + attributes.join(' ') : '';
	}
}
