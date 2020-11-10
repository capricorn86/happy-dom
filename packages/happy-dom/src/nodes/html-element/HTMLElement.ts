import Element from '../element/Element';
import Event from '../../event/Event';
import IHTMLElement from './IHTMLElement';
import CSSStyleDeclaration from '../../css/CSSStyleDeclaration';
import CSSStyleDeclarationFactory from '../../css/CSSStyleDeclarationFactory';

/**
 * HTMLElement.
 */
export default class HTMLElement extends Element implements IHTMLElement {
	public readonly offsetHeight = 0;
	public readonly offsetWidth = 0;
	public readonly offsetLeft = 0;
	public readonly offsetTop = 0;
	public readonly clientHeight = 0;
	public readonly clientWidth = 0;
	private _style: {
		cssText: string;
		cssStyleDeclaration: CSSStyleDeclaration;
	} = null;

	/**
	 * Returns tab index.
	 *
	 * @return Tab index.
	 */
	public get tabIndex(): number {
		const tabIndex = this.getAttribute('tabindex');
		return tabIndex !== null ? Number(tabIndex) : -1;
	}

	/**
	 * Returns tab index.
	 *
	 * @param tabIndex Tab index.
	 */
	public set tabIndex(tabIndex: number) {
		this.setAttribute('tabindex', String(tabIndex));
	}

	/**
	 * Returns inner text.
	 *
	 * @return Text.
	 */
	public get innerText(): string {
		return this.textContent;
	}

	/**
	 * Sets inner text.
	 *
	 * @param text Text.
	 */
	public set innerText(text: string) {
		this.textContent = text;
	}

	/**
	 * Returns style.
	 *
	 * @return Style.
	 */
	public get style(): CSSStyleDeclaration {
		const cssText = this.getAttribute('style');
		if (!this._style || this._style.cssText !== cssText) {
			this._style = {
				cssText,
				cssStyleDeclaration: CSSStyleDeclarationFactory.createCSSStyleDeclaration(cssText)
			};
		}
		return this._style.cssStyleDeclaration;
	}

	/**
	 * Triggers a click event.
	 */
	public click(): void {
		const event = new Event('click', {
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
		const event = new Event('blur', {
			bubbles: true,
			composed: true
		});
		event.target = this;
		event.currentTarget = this;
		this.dispatchEvent(event);
	}

	/**
	 * Triggers a focus event.
	 */
	public focus(): void {
		const event = new Event('focus', {
			bubbles: true,
			composed: true
		});
		event.target = this;
		event.currentTarget = this;
		this.dispatchEvent(event);
	}
}
