import Element from '../element/Element';
import IHTMLElement from './IHTMLElement';
import CSSStyleDeclaration from '../../css/CSSStyleDeclaration';
import Attr from '../../attribute/Attr';
import FocusEvent from '../../event/events/FocusEvent';
import PointerEvent from '../../event/events/PointerEvent';
import Node from '../node/Node';

/**
 * HTML Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement.
 */
export default class HTMLElement extends Element implements IHTMLElement {
	public readonly accessKey = '';
	public readonly accessKeyLabel = '';
	public readonly contentEditable = 'inherit';
	public readonly isContentEditable = false;
	public readonly offsetHeight = 0;
	public readonly offsetWidth = 0;
	public readonly offsetLeft = 0;
	public readonly offsetTop = 0;
	public readonly clientHeight = 0;
	public readonly clientWidth = 0;

	private _style: CSSStyleDeclaration = null;

	/**
	 * Returns tab index.
	 *
	 * @returns Tab index.
	 */
	public get tabIndex(): number {
		const tabIndex = this.getAttributeNS(null, 'tabindex');
		return tabIndex !== null ? Number(tabIndex) : -1;
	}

	/**
	 * Returns tab index.
	 *
	 * @param tabIndex Tab index.
	 */
	public set tabIndex(tabIndex: number) {
		if (tabIndex === -1) {
			this.removeAttributeNS(null, 'tabindex');
		} else {
			this.setAttributeNS(null, 'tabindex', String(tabIndex));
		}
	}

	/**
	 * Returns inner text, which is the rendered appearance of text.
	 *
	 * @returns Inner text.
	 */
	public get innerText(): string {
		let result = '';
		for (const childNode of this.childNodes) {
			if (childNode instanceof HTMLElement) {
				if (childNode.tagName !== 'SCRIPT' && childNode.tagName !== 'STYLE') {
					result += childNode.innerText;
				}
			} else if (
				childNode.nodeType === Node.ELEMENT_NODE ||
				childNode.nodeType === Node.TEXT_NODE
			) {
				result += childNode.textContent;
			}
		}
		return result;
	}

	/**
	 * Sets the inner text, which is the rendered appearance of text.
	 *
	 * @param innerText Inner text.
	 */
	public set innerText(innerText: string) {
		this.textContent = innerText;
	}

	/**
	 * Returns style.
	 *
	 * @returns Style.
	 */
	public get style(): CSSStyleDeclaration {
		if (!this._style) {
			this._style = new CSSStyleDeclaration(this._attributes);
		}
		return this._style;
	}

	/**
	 * Returns data set.
	 *
	 * @returns Data set.
	 */
	public get dataset(): { [key: string]: string } {
		const dataset = {};
		for (const name of Object.keys(this._attributes)) {
			if (name.startsWith('data-')) {
				dataset[name.replace('data-', '')] = this._attributes[name].value;
			}
		}
		return dataset;
	}

	/**
	 * Returns direction.
	 *
	 * @returns Direction.
	 */
	public get dir(): string {
		return this.getAttributeNS(null, 'dir') || '';
	}

	/**
	 * Returns direction.
	 *
	 * @param direction Direction.
	 */
	public set dir(direction: string) {
		this.setAttributeNS(null, 'dir', direction);
	}

	/**
	 * Returns hidden.
	 *
	 * @returns Hidden.
	 */
	public get hidden(): boolean {
		return this.getAttributeNS(null, 'hidden') !== null;
	}

	/**
	 * Returns hidden.
	 *
	 * @param hidden Hidden.
	 */
	public set hidden(hidden: boolean) {
		if (!hidden) {
			this.removeAttributeNS(null, 'hidden');
		} else {
			this.setAttributeNS(null, 'hidden', '');
		}
	}

	/**
	 * Returns language.
	 *
	 * @returns Language.
	 */
	public get lang(): string {
		return this.getAttributeNS(null, 'lang') || '';
	}

	/**
	 * Returns language.
	 *
	 * @param language Language.
	 */
	public set lang(lang: string) {
		this.setAttributeNS(null, 'lang', lang);
	}

	/**
	 * Returns title.
	 *
	 * @returns Title.
	 */
	public get title(): string {
		return this.getAttributeNS(null, 'title') || '';
	}

	/**
	 * Returns title.
	 *
	 * @param title Title.
	 */
	public set title(title: string) {
		this.setAttributeNS(null, 'title', title);
	}

	/**
	 * Triggers a click event.
	 */
	public click(): void {
		const event = new PointerEvent('click', {
			bubbles: true,
			composed: true
		});
		event.target = this;
		event.currentTarget = this;
		this.dispatchEvent(event);
	}

	/**
	 * Triggers a blur event.
	 */
	public blur(): void {
		if (this.ownerDocument['_activeElement'] !== this || !this.isConnected) {
			return;
		}

		this.ownerDocument['_activeElement'] = null;

		for (const eventType of ['blur', 'focusout']) {
			const event = new FocusEvent(eventType, {
				bubbles: true,
				composed: true
			});
			event.target = this;
			event.currentTarget = this;
			this.dispatchEvent(event);
		}
	}

	/**
	 * Triggers a focus event.
	 */
	public focus(): void {
		if (this.ownerDocument['_activeElement'] === this || !this.isConnected) {
			return;
		}

		if (this.ownerDocument['_activeElement'] !== null) {
			this.ownerDocument['_activeElement'].blur();
		}

		this.ownerDocument['_activeElement'] = this;

		for (const eventType of ['focus', 'focusin']) {
			const event = new FocusEvent(eventType, {
				bubbles: true,
				composed: true
			});
			event.target = this;
			event.currentTarget = this;
			this.dispatchEvent(event);
		}
	}

	/**
	 * The setAttributeNode() method adds a new Attr node to the specified element.
	 *
	 * @override
	 * @param attribute Attribute.
	 * @returns Replaced attribute.
	 */
	public setAttributeNode(attribute: Attr): Attr {
		const replacedAttribute = super.setAttributeNode(attribute);

		if (attribute.name === 'style' && this._style) {
			this._style.cssText = attribute.value;
		}

		return replacedAttribute;
	}

	/**
	 * Removes an Attr node.
	 *
	 * @override
	 * @param attribute Attribute.
	 */
	public removeAttributeNode(attribute: Attr): void {
		super.removeAttributeNode(attribute);

		if (attribute.name === 'style' && this._style) {
			this._style.cssText = '';
		}
	}

	/**
	 * Clones a node.
	 *
	 * @override
	 * @param [deep=false] "true" to clone deep.
	 * @returns Cloned node.
	 */
	public cloneNode(deep = false): IHTMLElement {
		const clone = <HTMLElement>super.cloneNode(deep);

		(<string>clone.accessKey) = this.accessKey;
		(<string>clone.accessKeyLabel) = this.accessKeyLabel;
		(<string>clone.contentEditable) = this.contentEditable;
		(<boolean>clone.isContentEditable) = this.isContentEditable;

		if (this._style) {
			clone.style.cssText = this._style.cssText;
		}

		return clone;
	}
}
