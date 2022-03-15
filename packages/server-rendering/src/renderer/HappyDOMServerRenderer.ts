import { Node, INode, HTMLElement, Element, IElement, DocumentType, IShadowRoot } from 'happy-dom';
import SelfClosingElements from 'happy-dom/lib/config/SelfClosingElements';
import UnclosedElements from 'happy-dom/lib/config/UnclosedElements';
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
	 * @param root
	 * @returns Result.
	 */
	public render(root: INode): HappyDOMServerRenderResult {
		return {
			html: this.serializeToString(root),
			css: this.renderOptions.openShadowRoots ? this.shadowRootRenderer.getScopedCSS() : []
		};
	}

	/**
	 * Renders an element as HTML.
	 *
	 * @param element Element to render.
	 * @param root
	 * @returns Result.
	 */
	private serializeToString(root: INode): string {
		switch (root.nodeType) {
			case Node.ELEMENT_NODE:
				const element = <HTMLElement>root;
				const tagName = element.tagName.toLowerCase();

				if (UnclosedElements.includes(tagName)) {
					return `<${tagName}${this._getAttributes(element)}>`;
				} else if (SelfClosingElements.includes(tagName)) {
					return `<${tagName}${this._getAttributes(element)}/>`;
				}

				let innerElement = <IElement | IShadowRoot>element;
				let outerElement = <IElement>element;
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
	 * @returns Attributes.
	 */
	private _getAttributes(element: IElement): string {
		const attributes = [];
		for (const attribute of Object.values((<Element>element)._attributes)) {
			if (attribute.value !== null) {
				attributes.push(attribute.name + '="' + encode(attribute.value) + '"');
			}
		}
		return attributes.length > 0 ? ' ' + attributes.join(' ') : '';
	}
}
