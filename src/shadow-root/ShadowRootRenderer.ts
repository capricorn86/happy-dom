import ScopedCSSCache from './css/ScopedCSSCache';
import Element from '../nodes/Element';
import DocumentFragment from '../nodes/DocumentFragment';
import ShadowRoot from '../nodes/ShadowRoot';
import ScopeCSS from './css/ScopeCSS';

/**
 * Patch for scoping elements when requesting "document.documentElement.innerHTML" or "document.documentElement.outerHTML".
 * This patch is mainly useful on server side DOMs.
 */
export default class ShadowRootRenderer {
	/**
	 * Renders an element scoped without touching the original elements.
	 *
	 * @param {Element|DocumentFragment} element Element to render.
	 * @param {ScopedCSSCache} cssCache Options object.
	 * @return {string} Result.
	 */
	public static getInnerHTML(element: Element | DocumentFragment, cssCache: ScopedCSSCache): string {
		const clone = <Element>element.cloneNode();
		this.scopeElement(clone, cssCache);
		return clone.shadowRoot.innerHTML;
	}

	/**
	 * Scopes an element.
	 *
	 * @param {Element} element Element to render.
	 * @param {ScopedCSSCache} cssCache Options object.
	 */
	public static scopeElement(element: Element, cssCache: ScopedCSSCache): void {
		this.extractAndScopeCSS(element, cssCache);
		this.moveChildNodesIntoSlots(element);
	}

	/**
	 * Moves child nodes into shadow root slot elements.
	 *
	 * @param {Element} element Element.
	 */
	private static moveChildNodesIntoSlots(element: Element): void {
		const slotChildren = {};
		const slots = Array.from(element.shadowRoot.querySelectorAll('slot'));

		for (let i = 0, max = element.children.length; i < max; i++) {
			const child = element.children[i];
			const name = child.getAttribute('slot') || 'default';
			slotChildren[name] = slotChildren[name] || [];
			slotChildren[name].push(child);
		}

		for (const slot of slots) {
			const name = slot.getAttribute('name') || 'default';
			if (slotChildren[name]) {
				for (const child of slotChildren[name]) {
					slot.parentNode.insertBefore(child, slot);
				}
				slot.parentNode.removeChild(slot);
			}
		}

		if (element.childNodes.length > 0) {
			// eslint-disable-next-line
            console.warn('Warning! Custom element "' + element.tagName +  '" did not have any matching slot for ' + element.childNodes.length + ' child node(s).');
			for (const child of Array.from(element.childNodes)) {
				element.removeChild(child);
			}
		}
	}

	/**
	 * Extracts CSS.
	 *
	 * @param {Element} element Element.
	 * @param {ElementRenderOptions} cssCache Options object.
	 */
	private static extractAndScopeCSS(element: Element, cssCache: ScopedCSSCache): void {
		const css = this.extractCSS(element.shadowRoot);

		const scopeID = cssCache.getScopeID(css);
		let scopedCSS = cssCache.getScoped(css);

		if (!scopedCSS) {
			scopedCSS = ScopeCSS.scope(css, scopeID, element.tagName);
			cssCache.setScoped(css, scopedCSS);
		}

		element.classList.add(scopeID);

		this.scopeShadowRoot(element.shadowRoot, scopeID);
	}

	/**
	 * Extracts CSS.
	 *
	 * @param {ShadowRoot} shadowRoot Shadow root.
	 * @return {string} CSS.
	 */
	private static extractCSS(shadowRoot: ShadowRoot): string {
		const styles = Array.from(shadowRoot.querySelectorAll('style'));
		let css = '';

		for (const style of styles) {
			style.parentNode.removeChild(style);
			css += style.textContent;
		}

		return css;
	}

	/**
	 * Scopes an element by adding a unique id as a class to it and its children.
	 *
	 * @param {Element|ShadowRoot} element Element to scope.
	 * @param {string} id Unique ID.
	 */
	private static scopeShadowRoot(element: Element | ShadowRoot, id: string): void {
		if (element instanceof Element) {
			element.classList.add(id);
		}

		if (element instanceof ShadowRoot || (element instanceof Element && element.tagName !== 'slot')) {
			for (let i = 0, max = element.children.length; i < max; i++) {
				const child = element.children[i];
				this.scopeShadowRoot(child, id);
			}
		}
	}
}
