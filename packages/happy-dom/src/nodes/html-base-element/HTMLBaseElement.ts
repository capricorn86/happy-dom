import HTMLElement from '../html-element/HTMLElement';
import IHTMLBaseElement from './IHTMLBaseElement';

/**
 * HTML Base Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base.
 */
export default class HTMLBaseElement extends HTMLElement implements IHTMLBaseElement {
	/**
	 * Returns href.
	 *
	 * @returns Href.
	 */
	public get href(): string {
		const href = this.getAttribute('href');
		if (href !== null) {
			return href;
		}
		return this.ownerDocument.location.href;
	}

	/**
	 * Sets href.
	 *
	 * @param href Href.
	 */
	public set href(href: string) {
		this.setAttribute('href', href);
	}

	/**
	 * Returns target.
	 *
	 * @returns Target.
	 */
	public get target(): string {
		return this.getAttribute('target') || '';
	}

	/**
	 * Sets target.
	 *
	 * @param target Target.
	 */
	public set target(target: string) {
		this.setAttribute('target', target);
	}

	/**
	 * Clones a node.
	 *
	 * @override
	 * @param [deep=false] "true" to clone deep.
	 * @returns Cloned node.
	 */
	public cloneNode(deep = false): IHTMLBaseElement {
		return <IHTMLBaseElement>super.cloneNode(deep);
	}
}
