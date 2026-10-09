import * as PropertySymbol from '../../PropertySymbol.js';
import ParentNodeUtility from '../parent-node/ParentNodeUtility.js';
import type Element from '../element/Element.js';
import type HTMLElement from './HTMLElement.js';
import type HTMLFormElement from '../html-form-element/HTMLFormElement.js';

/**
 * Utility for form-associated elements.
 */
export default class HTMLFormControlElementUtility {
	/**
	 * Returns the form owner of a form-associated element.
	 *
	 * A present "form" content attribute always wins over the ancestor `<form>`: it resolves,
	 * within the element's own tree (root included, connected or not), to the first element
	 * with that id when that element is a `<form>`, otherwise to `null`. The nearest ancestor
	 * `<form>` (cached as `PropertySymbol.formNode`) is only consulted when the attribute is
	 * absent.
	 *
	 * @param element Form-associated element.
	 * @returns Form owner or null.
	 */
	public static getFormOwner(element: HTMLElement): HTMLFormElement | null {
		const id = element.getAttribute('form');

		if (id !== null) {
			if (!id) {
				return null;
			}
			const owner = ParentNodeUtility.getElementById(<Element>element.getRootNode(), id);
			return owner && owner.tagName === 'FORM' ? <HTMLFormElement>owner : null;
		}

		return element[PropertySymbol.formNode] || null;
	}
}
