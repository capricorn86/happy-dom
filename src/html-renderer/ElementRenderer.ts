import Element from '../nodes/basic-types/element/Element';
import HTMLTemplateElement from '../nodes/elements/template/HTMLTemplateElement';
import DocumentFragment from '../nodes/basic-types/document-fragment/DocumentFragment';
import ShadowRootScoper from './ShadowRootScoper';
import ElementRenderOptions from './ElementRenderOptions';
import ElementRenderResult from './ElementRenderResult';
import ScopedCSSCache from './ScopedCSSCache';

const SELF_CLOSED_REGEXP = /^(img|br|hr|area|base|input|doctype|link)$/i;
const META_REGEXP = /^meta$/i;

/**
 * Utility for converting an element to string.
 *
 * @class QuerySelector
 */
export default class ElementRenderer {
	/**
	 * Renders an element as HTML.
	 *
	 * @param {Element} element Element to convert.
	 * @param {ElementRenderOptions} [options] Render options.
	 * @param {ScopedCSSCache} [scopedCSSCache] Scoped CSS cache.
	 * @return {ElementRenderResult} Result.
	 */
	public static renderOuterHTML(
		element: Element,
		options: ElementRenderOptions = new ElementRenderOptions(),
		scopedCSSCache: ScopedCSSCache = null
	): ElementRenderResult {
		const tagName = element.tagName.toLowerCase();
		const rawAttributes = element._getRawAttributes();
		const isUnClosed = META_REGEXP.test(tagName);
		const isSelfClosed = SELF_CLOSED_REGEXP.test(tagName);
		const attributes = rawAttributes ? ' ' + rawAttributes : '';
		const result = new ElementRenderResult();

		if (isUnClosed) {
			result.html = `<${tagName}${attributes}>`;
		} else if (isSelfClosed) {
			result.html = `<${tagName}${attributes} />`;
		} else {
			result.html = `<${tagName}${attributes}>${this.renderInnerHTML(element, options, scopedCSSCache)}</${tagName}>`;
		}

		result.extractedCSS = scopedCSSCache.getAllExtractedCSS();
		result.scopedCSS = scopedCSSCache.getAllScopedCSS();

		return result;
	}

	/**
	 * Renders an element as HTML.
	 *
	 * @param {Element|ShadowRoot} element Element to convert.
	 * @param {IElementRenderOptions} [options] Render options.
	 * @param {ScopedCSSCache} [scopedCSSCache] Scoped CSS cache.
	 * @return {ElementRenderResult} Result.
	 */
	public static renderInnerHTML(
		element: Element | DocumentFragment,
		options: ElementRenderOptions = new ElementRenderOptions(),
		scopedCSSCache: ScopedCSSCache = null
	): ElementRenderResult {
		const renderElement = (<HTMLTemplateElement>element).content || element;
		const result = new ElementRenderResult();

		if (options.openShadowRoots && element instanceof Element && element.shadowRoot) {
			scopedCSSCache = scopedCSSCache || new ScopedCSSCache();
			ShadowRootScoper.scopeElement(element, scopedCSSCache, options);
			element = element.shadowRoot;
		}

		for (const child of renderElement.childNodes.slice()) {
			if (child instanceof Element) {
				result.html += this.renderOuterHTML(child, options, scopedCSSCache).html;
			} else {
				result.html += child.toString();
			}
		}

		if (scopedCSSCache) {
			result.extractedCSS = scopedCSSCache.getAllExtractedCSS();
			result.scopedCSS = scopedCSSCache.getAllScopedCSS();
		}

		return result;
	}
}
