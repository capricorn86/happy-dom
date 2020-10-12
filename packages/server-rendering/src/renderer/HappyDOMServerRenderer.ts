import {
	Node,
	Element,
	CommentNode,
	DocumentType,
	DocumentFragment,
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
		const result = new HappyDOMServerRenderResult();

		if (root instanceof Element) {
			const tagName = root.tagName.toLowerCase();
			if (UnclosedHTMLElements.includes(tagName)) {
				result.html = `<${tagName}${this._getAttributes(root)}>`;
			} else if (SelfClosingHTMLElements.includes(tagName)) {
				result.html = `<${tagName}${this._getAttributes(root)}/>`;
			} else {
				let innerElement: Element | ShadowRoot = root;
				let outerElement: Element | ShadowRoot = root;
				let xml = '';

				if (this.renderOptions.openShadowRoots && root.shadowRoot) {
					outerElement = this.shadowRootRenderer.getScopedClone(root);
					innerElement = outerElement.shadowRoot;
				}

				for (const node of innerElement.childNodes) {
					xml += this.render(node).html;
				}

				result.html = `<${tagName}${this._getAttributes(outerElement)}>${xml}</${tagName}>`;
			}
		} else if (root instanceof DocumentFragment) {
			let xml = '';
			for (const node of root.childNodes) {
				xml += this.render(node).html;
			}
			result.html = xml;
		} else if (root instanceof CommentNode) {
			result.html = `<!--${root._textContent}-->`;
		} else if (root instanceof DocumentType) {
			const identifier = root.publicId ? ' PUBLIC' : root.systemId ? ' SYSTEM' : '';
			const publicId = root.publicId ? ` "${root.publicId}"` : '';
			const systemId = root.systemId ? ` "${root.systemId}"` : '';
			result.html = `<!DOCTYPE ${root.name}${identifier}${publicId}${systemId}>`;
		} else if (root['_textContent']) {
			result.html = root['_textContent'];
		}

		if (this.renderOptions.openShadowRoots) {
			result.css = this.shadowRootRenderer.getScopedCSS();
		}

		return result;
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
