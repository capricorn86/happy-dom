import Element from '../element/Element';
import IHTMLElement from './IHTMLElement';
import CSSStyleDeclaration from '../../css/declaration/CSSStyleDeclaration';
import IAttr from '../attr/IAttr';
import PointerEvent from '../../event/events/PointerEvent';
import Dataset from '../element/Dataset';
import NodeTypeEnum from '../node/NodeTypeEnum';
import DOMException from '../../exception/DOMException';
import Event from '../../event/Event';
import HTMLElementUtility from './HTMLElementUtility';

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
	private _dataset: Dataset = null;

	// Events
	public oncopy: (event: Event) => void | null = null;
	public oncut: (event: Event) => void | null = null;
	public onpaste: (event: Event) => void | null = null;
	public oninvalid: (event: Event) => void | null = null;
	public onanimationcancel: (event: Event) => void | null = null;
	public onanimationend: (event: Event) => void | null = null;
	public onanimationiteration: (event: Event) => void | null = null;
	public onanimationstart: (event: Event) => void | null = null;
	public onbeforeinput: (event: Event) => void | null = null;
	public oninput: (event: Event) => void | null = null;
	public onchange: (event: Event) => void | null = null;
	public ongotpointercapture: (event: Event) => void | null = null;
	public onlostpointercapture: (event: Event) => void | null = null;
	public onpointercancel: (event: Event) => void | null = null;
	public onpointerdown: (event: Event) => void | null = null;
	public onpointerenter: (event: Event) => void | null = null;
	public onpointerleave: (event: Event) => void | null = null;
	public onpointermove: (event: Event) => void | null = null;
	public onpointerout: (event: Event) => void | null = null;
	public onpointerover: (event: Event) => void | null = null;
	public onpointerup: (event: Event) => void | null = null;
	public ontransitioncancel: (event: Event) => void | null = null;
	public ontransitionend: (event: Event) => void | null = null;
	public ontransitionrun: (event: Event) => void | null = null;
	public ontransitionstart: (event: Event) => void | null = null;

	/**
	 * Returns tab index.
	 *
	 * @returns Tab index.
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
		if (tabIndex === -1) {
			this.removeAttribute('tabindex');
		} else {
			this.setAttribute('tabindex', String(tabIndex));
		}
	}

	/**
	 * Returns inner text, which is the rendered appearance of text.
	 *
	 * @see https://html.spec.whatwg.org/multipage/dom.html#the-innertext-idl-attribute
	 * @returns Inner text.
	 */
	public get innerText(): string {
		if (!this.isConnected) {
			return this.textContent;
		}

		let result = '';

		for (const childNode of this.childNodes) {
			if (childNode.nodeType === NodeTypeEnum.elementNode) {
				const childElement = <IHTMLElement>childNode;
				const computedStyle = this.ownerDocument.defaultView.getComputedStyle(childElement);

				if (childElement.tagName !== 'SCRIPT' && childElement.tagName !== 'STYLE') {
					const display = computedStyle.display;
					if (display !== 'none') {
						const textTransform = computedStyle.textTransform;

						if ((display === 'block' || display === 'flex') && result) {
							result += '\n';
						}

						let text = childElement.innerText;

						switch (textTransform) {
							case 'uppercase':
								text = text.toUpperCase();
								break;
							case 'lowercase':
								text = text.toLowerCase();
								break;
							case 'capitalize':
								text = text.replace(/(^|\s)\S/g, (l) => l.toUpperCase());
								break;
						}

						result += text;
					}
				}
			} else if (childNode.nodeType === NodeTypeEnum.textNode) {
				result += childNode.textContent.replace(/[\n\r]/, '');
			}
		}

		return result;
	}

	/**
	 * Sets the inner text, which is the rendered appearance of text.
	 *
	 * @see https://html.spec.whatwg.org/multipage/dom.html#the-innertext-idl-attribute
	 * @param innerText Inner text.
	 */
	public set innerText(text: string) {
		for (const child of this.childNodes.slice()) {
			this.removeChild(child);
		}

		const texts = text.split(/[\n\r]/);

		for (let i = 0, max = texts.length; i < max; i++) {
			if (i !== 0) {
				this.appendChild(this.ownerDocument.createElement('br'));
			}
			this.appendChild(this.ownerDocument.createTextNode(texts[i]));
		}
	}

	/**
	 * Returns outer text.
	 *
	 * @see https://html.spec.whatwg.org/multipage/dom.html#the-innertext-idl-attribute
	 * @returns HTML.
	 */
	public get outerText(): string {
		return this.innerText;
	}

	/**
	 * Sets outer text.
	 *
	 * @see https://html.spec.whatwg.org/multipage/dom.html#the-innertext-idl-attribute
	 * @param text Text.
	 */
	public set outerText(text: string) {
		if (!this.parentNode) {
			throw new DOMException(
				"Failed to set the 'outerHTML' property on 'Element': This element has no parent node."
			);
		}

		const texts = text.split(/[\n\r]/);

		for (let i = 0, max = texts.length; i < max; i++) {
			if (i !== 0) {
				this.parentNode.insertBefore(this.ownerDocument.createElement('br'), this);
			}
			this.parentNode.insertBefore(this.ownerDocument.createTextNode(texts[i]), this);
		}

		this.parentNode.removeChild(this);
	}

	/**
	 * Returns style.
	 *
	 * @returns Style.
	 */
	public get style(): CSSStyleDeclaration {
		if (!this._style) {
			this._style = new CSSStyleDeclaration(this);
		}
		return this._style;
	}

	/**
	 * Sets style.
	 *
	 * @param cssText Style as text.
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style#setting_styles
	 */
	public set style(cssText: string | CSSStyleDeclaration) {
		this.style.cssText = typeof cssText === 'string' ? <string>cssText : '';
	}

	/**
	 * Returns data set.
	 *
	 * @returns Data set.
	 */
	public get dataset(): { [key: string]: string } {
		return (this._dataset ??= new Dataset(this)).proxy;
	}

	/**
	 * Returns direction.
	 *
	 * @returns Direction.
	 */
	public get dir(): string {
		return this.getAttribute('dir') || '';
	}

	/**
	 * Returns direction.
	 *
	 * @param direction Direction.
	 */
	public set dir(direction: string) {
		this.setAttribute('dir', direction);
	}

	/**
	 * Returns hidden.
	 *
	 * @returns Hidden.
	 */
	public get hidden(): boolean {
		return this.getAttribute('hidden') !== null;
	}

	/**
	 * Returns hidden.
	 *
	 * @param hidden Hidden.
	 */
	public set hidden(hidden: boolean) {
		if (!hidden) {
			this.removeAttribute('hidden');
		} else {
			this.setAttribute('hidden', '');
		}
	}

	/**
	 * Returns language.
	 *
	 * @returns Language.
	 */
	public get lang(): string {
		return this.getAttribute('lang') || '';
	}

	/**
	 * Returns language.
	 *
	 * @param language Language.
	 */
	public set lang(lang: string) {
		this.setAttribute('lang', lang);
	}

	/**
	 * Returns title.
	 *
	 * @returns Title.
	 */
	public get title(): string {
		return this.getAttribute('title') || '';
	}

	/**
	 * Returns title.
	 *
	 * @param title Title.
	 */
	public set title(title: string) {
		this.setAttribute('title', title);
	}

	/**
	 * Triggers a click event.
	 */
	public click(): void {
		const event = new PointerEvent('click', {
			bubbles: true,
			composed: true
		});
		event._target = this;
		event._currentTarget = this;
		this.dispatchEvent(event);
	}

	/**
	 * Triggers a blur event.
	 */
	public blur(): void {
		HTMLElementUtility.blur(this);
	}

	/**
	 * Triggers a focus event.
	 */
	public focus(): void {
		HTMLElementUtility.focus(this);
	}

	/**
	 * @override
	 */
	public setAttributeNode(attribute: IAttr): IAttr {
		const replacedAttribute = super.setAttributeNode(attribute);

		if (attribute.name === 'style' && this._style) {
			this._style.cssText = attribute.value;
		}

		return replacedAttribute;
	}

	/**
	 * @override
	 */
	public removeAttributeNode(attribute: IAttr): IAttr {
		super.removeAttributeNode(attribute);

		if (attribute.name === 'style' && this._style) {
			this._style.cssText = '';
		}

		return attribute;
	}

	/**
	 * @override
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
