import { IHTMLElement, IShadowRoot, Node } from 'happy-dom';
import ShadowRootCSSCache from './ShadowRootCSSCache';
import ShadowRootCSSRenderer from './ShadowRootCSSRenderer';
import IHappyDOMServerRenderOptions from '../IHappyDOMServerRenderOptions';

/**
 * Scopes elements and CSS inside shadow roots.
 */
export default class ShadowRootRenderer {
	private renderOptions: IHappyDOMServerRenderOptions;
	private cssCache: ShadowRootCSSCache = new ShadowRootCSSCache();

	/**
	 * Renders an element as HTML.
	 *
	 * @param renderOptions Render this.renderOptions.
	 */
	constructor(renderOptions: IHappyDOMServerRenderOptions) {
		this.renderOptions = renderOptions;
	}

	/**
	 * Clones an element and scopes it.
	 *
	 * @param element Element to render.
	 * @param cssCache Options object.
	 * @param options Render options.
	 * @returns Element clone.
	 */
	public getScopedClone(element: IHTMLElement): IHTMLElement {
		const clone = <IHTMLElement>element.cloneNode(true);
		(<IShadowRoot>clone.shadowRoot) = element.shadowRoot.cloneNode(true);
		this.extractAndScopeCSS(clone);
		this.moveChildNodesIntoSlots(clone);
		return clone;
	}

	/**
	 * Returns scoped CSS.
	 *
	 * @returns CSS strings.
	 */
	public getScopedCSS(): string[] {
		return this.cssCache.getAllScoped();
	}

	/**
	 * Moves child nodes into shadow root slot elements.
	 *
	 * @param element Element.
	 */
	private moveChildNodesIntoSlots(element: IHTMLElement): void {
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
	 * @param element Element.
	 */
	private extractAndScopeCSS(element: IHTMLElement): void {
		const options = this.renderOptions;
		const cache = this.cssCache;

		if (options.extractCSS && options.scopeCSS) {
			const css = this.extractCSS(element.shadowRoot);

			const scopeID = cache.getScopeID(css);
			let scopedCSS = cache.getScoped(css);

			if (!scopedCSS) {
				scopedCSS = ShadowRootCSSRenderer.scope(css, scopeID, element.tagName);
				cache.setScoped(css, scopedCSS);
			}

			element.classList.add(scopeID);

			this.scopeChildElements(element.shadowRoot, scopeID);
		} else if (options.extractCSS) {
			const css = this.extractCSS(element.shadowRoot);
			cache.setScoped(css, css);
		} else if (options.scopeCSS) {
			const styles = Array.from(element.shadowRoot.querySelectorAll('style'));

			for (const style of styles) {
				const css = style.textContent;
				const scopeID = cache.getScopeID(css);

				element.classList.add(scopeID);
				style.textContent = ShadowRootCSSRenderer.scope(css, scopeID, element.tagName);
				cache.setScoped(css, style.textContent);

				this.scopeChildElements(element.shadowRoot, scopeID);
			}
		}
	}

	/**
	 * Extracts CSS.
	 *
	 * @param shadowRoot Shadow root.
	 * @returns CSS.
	 */
	private extractCSS(shadowRoot: IShadowRoot): string {
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
	 * @param element Element to scope.
	 * @param id Unique ID.
	 */
	private scopeChildElements(element: IHTMLElement | IShadowRoot, id: string): void {
		if (element.nodeType === Node.ELEMENT_NODE) {
			(<IHTMLElement>element).classList.add(id);
		}

		if (
			element.nodeType === Node.DOCUMENT_FRAGMENT_NODE ||
			(element.nodeType === Node.ELEMENT_NODE && (<IHTMLElement>element).tagName !== 'slot')
		) {
			for (let i = 0, max = element.children.length; i < max; i++) {
				const child = element.children[i];
				this.scopeChildElements(<IHTMLElement>child, id);
			}
		}
	}
}
