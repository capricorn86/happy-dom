import Element from '../nodes/basic-types/Element';
import HTMLTemplateElement from '../nodes/elements/HTMLTemplateElement';
import DocumentFragment from '../nodes/basic-types/DocumentFragment';
import ScopedCSSCache from '../shadow-root/css/ScopedCSSCache';
import ShadowRootRenderer from '../shadow-root/ShadowRootRenderer';

const SELF_CLOSED_REGEXP = /^(img|br|hr|area|base|input|doctype|link)$/i;
const META_REGEXP = /^meta$/i;

/**
 * Utility for converting an element to string.
 *
 * @class QuerySelector
 */
export default class HTMLElementRenderer {
	public static shadowRootCSSCache = new ScopedCSSCache();

	/**
	 * Renders an element as HTML.
	 *
	 * @param {Element} element Element to convert.
	 * @return {string} HTML.
	 */
	public static renderOuterHTML(element: Element): string {
		const tagName = element.tagName.toLowerCase();
		const rawAttributes = element.getRawAttributes();
		const isUnClosed = META_REGEXP.test(tagName);
		const isSelfClosed = SELF_CLOSED_REGEXP.test(tagName);
		const attributes = rawAttributes ? ' ' + rawAttributes : '';
		let result = '';

		if (isUnClosed) {
			result = `<${tagName}${attributes}>`;
		} else if (isSelfClosed) {
			result = `<${tagName}${attributes} />`;
		} else {
			result = `<${tagName}${attributes}>${element.innerHTML}</${tagName}>`;
		}

		return result;
	}

	/**
	 * Renders an element as HTML.
	 *
	 * @param {Element|ShadowRoot} element Element to convert.
	 * @return {string} HTML.
	 */
	public static renderInnerHTML(element: Element | DocumentFragment): string {
		const renderOptions = element.ownerDocument.defaultView.shadowRootRenderOptions;
		const cssCache = renderOptions.cssCache;
		const renderElement = (<HTMLTemplateElement>element).content || element;
		let result = '';

		if (renderOptions.openShadowRoots && element instanceof Element && element.shadowRoot) {
			return ShadowRootRenderer.getInnerHTML(element, cssCache);
		}

		for (const child of renderElement.childNodes.slice()) {
			if (child instanceof Element) {
				result += child.outerHTML;
			} else {
				result += child.toString();
			}
		}

		if (
			renderOptions.openShadowRoots &&
			renderOptions.appendScopedCSSToHead &&
			element === element.ownerDocument.documentElement
		) {
			result = result.replace('</head>', `<style>${cssCache.getAllScopedCSS()}</style></head>`);
		}

		return result;
	}
}
