import Element from '../element/Element';
import IHTMLElement from './IHTMLElement';
import CSSStyleDeclaration from '../../css/declaration/CSSStyleDeclaration';
import IAttr from '../attr/IAttr';
import FocusEvent from '../../event/events/FocusEvent';
import PointerEvent from '../../event/events/PointerEvent';
import DatasetUtility from './DatasetUtility';
import NodeTypeEnum from '../node/NodeTypeEnum';
import DOMException from '../../exception/DOMException';
import Event from '../../event/Event';

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
	private _dataset: { [key: string]: string } = null;

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
		if (this._dataset) {
			return this._dataset;
		}

		const dataset: { [key: string]: string } = {};
		const attributes = this._attributes;

		for (const name of Object.keys(attributes)) {
			if (name.startsWith('data-')) {
				const key = DatasetUtility.kebabToCamelCase(name.replace('data-', ''));
				dataset[key] = attributes[name].value;
			}
		}

		// Documentation for Proxy:
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
		this._dataset = new Proxy(dataset, {
			get: (dataset: { [key: string]: string }, key: string): string => {
				const name = 'data-' + DatasetUtility.camelCaseToKebab(key);
				if (this._attributes[name]) {
					dataset[key] = this._attributes[name].value;
					return this._attributes[name].value;
				}
				if (dataset[key] !== undefined) {
					delete dataset[key];
				}
				return undefined;
			},
			set: (dataset: { [key: string]: string }, key: string, value: string): boolean => {
				this.setAttribute('data-' + DatasetUtility.camelCaseToKebab(key), value);
				dataset[key] = value;
				return true;
			},
			deleteProperty: (dataset: { [key: string]: string }, key: string) => {
				const name = 'data-' + DatasetUtility.camelCaseToKebab(key);
				const result1 = delete attributes[name];
				const result2 = delete dataset[key];
				return result1 && result2;
			},
			ownKeys: (dataset: { [key: string]: string }) => {
				// According to Mozilla we have to update the dataset object (target) to contain the same keys as what we return:
				// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/ownKeys
				// "The result List must contain the keys of all non-configurable own properties of the target object."
				const keys = [];
				const deleteKeys = [];
				for (const name of Object.keys(attributes)) {
					if (name.startsWith('data-')) {
						const key = DatasetUtility.kebabToCamelCase(name.replace('data-', ''));
						keys.push(key);
						dataset[key] = attributes[name].value;
						if (!dataset[key]) {
							deleteKeys.push(key);
						}
					}
				}
				for (const key of deleteKeys) {
					delete dataset[key];
				}
				return keys;
			},
			has: (_dataset: { [key: string]: string }, key: string) => {
				return !!attributes['data-' + DatasetUtility.camelCaseToKebab(key)];
			}
		});

		return this._dataset;
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
		event._target = this;
		event._currentTarget = this;
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

		this.dispatchEvent(
			new FocusEvent('blur', {
				bubbles: false,
				composed: true
			})
		);
		this.dispatchEvent(
			new FocusEvent('focusout', {
				bubbles: true,
				composed: true
			})
		);
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

		this.dispatchEvent(
			new FocusEvent('focus', {
				bubbles: false,
				composed: true
			})
		);
		this.dispatchEvent(
			new FocusEvent('focusin', {
				bubbles: true,
				composed: true
			})
		);
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
