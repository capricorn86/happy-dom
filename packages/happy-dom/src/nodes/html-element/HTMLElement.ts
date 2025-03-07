import Element from '../element/Element.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import CSSStyleDeclaration from '../../css/declaration/CSSStyleDeclaration.js';
import PointerEvent from '../../event/events/PointerEvent.js';
import NodeTypeEnum from '../node/NodeTypeEnum.js';
import Event from '../../event/Event.js';
import HTMLElementUtility from './HTMLElementUtility.js';
import DOMStringMap from '../../dom/DOMStringMap.js';
import Attr from '../attr/Attr.js';
import ElementEventAttributeUtility from '../element/ElementEventAttributeUtility.js';

/**
 * HTML Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement.
 */
export default class HTMLElement extends Element {
	// Public properties
	public declare cloneNode: (deep?: boolean) => HTMLElement;
	public static observedAttributes?: string[];

	// Internal properties
	public [PropertySymbol.accessKey] = '';
	public [PropertySymbol.offsetHeight] = 0;
	public [PropertySymbol.offsetWidth] = 0;
	public [PropertySymbol.offsetLeft] = 0;
	public [PropertySymbol.offsetTop] = 0;
	public [PropertySymbol.clientHeight] = 0;
	public [PropertySymbol.clientWidth] = 0;
	public [PropertySymbol.clientLeft] = 0;
	public [PropertySymbol.clientTop] = 0;
	public [PropertySymbol.style]: CSSStyleDeclaration = null;
	public [PropertySymbol.dataset]: DOMStringMap | null = null;

	// Private properties
	#customElementDefineCallback: () => void = null;

	// Events

	/* eslint-disable jsdoc/require-jsdoc */

	public get oncancel(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'oncancel');
	}

	public set oncancel(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('oncancel', value);
	}

	public get onerror(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onerror');
	}

	public set onerror(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onerror', value);
	}

	public get onscroll(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onscroll');
	}

	public set onscroll(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onscroll', value);
	}

	public get onselect(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onselect');
	}

	public set onselect(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onselect', value);
	}

	public get onwheel(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onwheel');
	}

	public set onwheel(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onwheel', value);
	}

	public get oncopy(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'oncopy');
	}

	public set oncopy(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('oncopy', value);
	}

	public get oncut(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'oncut');
	}

	public set oncut(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('oncut', value);
	}

	public get onpaste(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onpaste');
	}

	public set onpaste(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onpaste', value);
	}

	public get oncompositionend(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'oncompositionend');
	}

	public set oncompositionend(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('oncompositionend', value);
	}

	public get oncompositionstart(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'oncompositionstart');
	}

	public set oncompositionstart(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('oncompositionstart', value);
	}

	public get oncompositionupdate(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'oncompositionupdate');
	}

	public set oncompositionupdate(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('oncompositionupdate', value);
	}

	public get onblur(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onblur');
	}

	public set onblur(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onblur', value);
	}

	public get onfocus(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onfocus');
	}

	public set onfocus(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onfocus', value);
	}

	public get onfocusin(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onfocusin');
	}

	public set onfocusin(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onfocusin', value);
	}

	public get onfocusout(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onfocusout');
	}

	public set onfocusout(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onfocusout', value);
	}

	public get onkeydown(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onkeydown');
	}

	public set onkeydown(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onkeydown', value);
	}

	public get onkeyup(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onkeyup');
	}

	public set onkeyup(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onkeyup', value);
	}

	public get onauxclick(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onauxclick');
	}

	public set onauxclick(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onauxclick', value);
	}

	public get onclick(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onclick');
	}

	public set onclick(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onclick', value);
	}

	public get oncontextmenu(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'oncontextmenu');
	}

	public set oncontextmenu(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('oncontextmenu', value);
	}

	public get ondblclick(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'ondblclick');
	}

	public set ondblclick(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('ondblclick', value);
	}

	public get onmousedown(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onmousedown');
	}

	public set onmousedown(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onmousedown', value);
	}

	public get onmouseenter(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onmouseenter');
	}

	public set onmouseenter(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onmouseenter', value);
	}

	public get onmouseleave(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onmouseleave');
	}

	public set onmouseleave(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onmouseleave', value);
	}

	public get onmousemove(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onmousemove');
	}

	public set onmousemove(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onmousemove', value);
	}

	public get onmouseout(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onmouseout');
	}

	public set onmouseout(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onmouseout', value);
	}

	public get onmouseover(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onmouseover');
	}

	public set onmouseover(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onmouseover', value);
	}

	public get onmouseup(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onmouseup');
	}

	public set onmouseup(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onmouseup', value);
	}

	public get ontouchcancel(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'ontouchcancel');
	}

	public set ontouchcancel(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('ontouchcancel', value);
	}

	public get ontouchend(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'ontouchend');
	}

	public set ontouchend(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('ontouchend', value);
	}

	public get ontouchmove(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'ontouchmove');
	}

	public set ontouchmove(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('ontouchmove', value);
	}

	public get ontouchstart(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'ontouchstart');
	}

	public set ontouchstart(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('ontouchstart', value);
	}

	public get oninvalid(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'oninvalid');
	}

	public set oninvalid(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('oninvalid', value);
	}

	public get onanimationcancel(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onanimationcancel');
	}

	public set onanimationcancel(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onanimationcancel', value);
	}

	public get onanimationend(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onanimationend');
	}

	public set onanimationend(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onanimationend', value);
	}

	public get onanimationiteration(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onanimationiteration');
	}

	public set onanimationiteration(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onanimationiteration', value);
	}

	public get onanimationstart(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onanimationstart');
	}

	public set onanimationstart(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onanimationstart', value);
	}

	public get onbeforeinput(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onbeforeinput');
	}

	public set onbeforeinput(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onbeforeinput', value);
	}

	public get oninput(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'oninput');
	}

	public set oninput(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('oninput', value);
	}

	public get onchange(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onchange');
	}

	public set onchange(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onchange', value);
	}

	public get ongotpointercapture(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'ongotpointercapture');
	}

	public set ongotpointercapture(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('ongotpointercapture', value);
	}

	public get onlostpointercapture(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onlostpointercapture');
	}

	public set onlostpointercapture(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onlostpointercapture', value);
	}

	public get onpointercancel(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onpointercancel');
	}

	public set onpointercancel(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onpointercancel', value);
	}

	public get onpointerdown(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onpointerdown');
	}

	public set onpointerdown(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onpointerdown', value);
	}

	public get onpointerenter(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onpointerenter');
	}

	public set onpointerenter(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onpointerenter', value);
	}

	public get onpointerleave(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onpointerleave');
	}

	public set onpointerleave(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onpointerleave', value);
	}

	public get onpointermove(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onpointermove');
	}

	public set onpointermove(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onpointermove', value);
	}

	public get onpointerout(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onpointerout');
	}

	public set onpointerout(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onpointerout', value);
	}

	public get onpointerover(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onpointerover');
	}

	public set onpointerover(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onpointerover', value);
	}

	public get onpointerup(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onpointerup');
	}

	public set onpointerup(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onpointerup', value);
	}

	public get ontransitioncancel(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'ontransitioncancel');
	}

	public set ontransitioncancel(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('ontransitioncancel', value);
	}

	public get ontransitionend(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'ontransitionend');
	}

	public set ontransitionend(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('ontransitionend', value);
	}

	public get ontransitionrun(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'ontransitionrun');
	}

	public set ontransitionrun(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('ontransitionrun', value);
	}

	public get ontransitionstart(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'ontransitionstart');
	}

	public set ontransitionstart(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('ontransitionstart', value);
	}

	/* eslint-enable jsdoc/require-jsdoc */

	/**
	 * Returns access key.
	 *
	 * @returns Access key.
	 */
	public get accessKey(): string {
		return this[PropertySymbol.accessKey];
	}

	/**
	 * Sets access key.
	 *
	 * @param accessKey Access key.
	 */
	public set accessKey(accessKey: string) {
		this[PropertySymbol.accessKey] = accessKey;
	}

	/**
	 * Returns content editable.
	 *
	 * @returns Content editable.
	 */
	public get contentEditable(): string {
		const contentEditable = String(this.getAttribute('contentEditable')).toLowerCase();

		switch (contentEditable) {
			case 'false':
			case 'true':
			case 'plaintext-only':
				return contentEditable;
			default:
				return 'inherit';
		}
	}

	/**
	 * Sets content editable.
	 *
	 * @param contentEditable Content editable.
	 */
	public set contentEditable(contentEditable: string) {
		contentEditable = String(contentEditable).toLowerCase();

		switch (contentEditable) {
			case 'false':
			case 'true':
			case 'plaintext-only':
			case 'inherit':
				this.setAttribute('contentEditable', contentEditable);
				break;
			default:
				throw new this[PropertySymbol.window].SyntaxError(
					`Failed to set the 'contentEditable' property on 'HTMLElement': The value provided ('${contentEditable}') is not one of 'true', 'false', 'plaintext-only', or 'inherit'.`
				);
		}
	}

	/**
	 * Returns is content editable.
	 *
	 * @returns Is content editable.
	 */
	public get isContentEditable(): boolean {
		const contentEditable = this.contentEditable;

		if (contentEditable === 'true' || contentEditable === 'plaintext-only') {
			return true;
		}

		if (contentEditable === 'inherit') {
			return (<HTMLElement>this[PropertySymbol.parentNode])?.isContentEditable ?? false;
		}

		return false;
	}

	/**
	 * Returns offset height.
	 *
	 * @returns Offset height.
	 */
	public get offsetHeight(): number {
		return this[PropertySymbol.offsetHeight];
	}

	/**
	 * Returns offset width.
	 *
	 * @returns Offset width.
	 */
	public get offsetWidth(): number {
		return this[PropertySymbol.offsetWidth];
	}

	/**
	 * Returns offset left.
	 *
	 * @returns Offset left.
	 */
	public get offsetLeft(): number {
		return this[PropertySymbol.offsetLeft];
	}

	/**
	 * Returns offset top.
	 *
	 * @returns Offset top.
	 */
	public get offsetTop(): number {
		return this[PropertySymbol.offsetTop];
	}

	/**
	 * Returns client height.
	 *
	 * @returns Client height.
	 */
	public get clientHeight(): number {
		return this[PropertySymbol.clientHeight];
	}

	/**
	 * Returns client width.
	 *
	 * @returns Client width.
	 */
	public get clientWidth(): number {
		return this[PropertySymbol.clientWidth];
	}

	/**
	 * Returns client left.
	 *
	 * @returns Client left.
	 */
	public get clientLeft(): number {
		return this[PropertySymbol.clientLeft];
	}

	/**
	 * Returns client top.
	 *
	 * @returns Client top.
	 */
	public get clientTop(): number {
		return this[PropertySymbol.clientTop];
	}

	/**
	 * Returns tab index.
	 *
	 * @returns Tab index.
	 */
	public get tabIndex(): number {
		const tabIndex = this.getAttribute('tabindex');
		if (tabIndex !== null) {
			const parsed = Number(tabIndex);
			return isNaN(parsed) ? -1 : parsed;
		}
		return -1;
	}

	/**
	 * Returns tab index.
	 *
	 * @param tabIndex Tab index.
	 */
	public set tabIndex(tabIndex: number) {
		const parsed = Number(tabIndex);
		if (isNaN(parsed)) {
			this.setAttribute('tabindex', '0');
		} else {
			this.setAttribute('tabindex', String(parsed));
		}
	}

	/**
	 * Returns inner text, which is the rendered appearance of text.
	 *
	 * @see https://html.spec.whatwg.org/multipage/dom.html#the-innertext-idl-attribute
	 * @returns Inner text.
	 */
	public get innerText(): string {
		if (!this[PropertySymbol.isConnected]) {
			return this.textContent;
		}

		let result = '';

		for (const childNode of this[PropertySymbol.nodeArray]) {
			if (childNode[PropertySymbol.nodeType] === NodeTypeEnum.elementNode) {
				const childElement = <HTMLElement>childNode;
				const computedStyle = this[PropertySymbol.window].getComputedStyle(childElement);

				if (
					childElement[PropertySymbol.tagName] !== 'SCRIPT' &&
					childElement[PropertySymbol.tagName] !== 'STYLE' &&
					childElement[PropertySymbol.tagName] !== 'svg'
				) {
					const display = computedStyle.display;
					if (display !== 'none') {
						const textTransform = computedStyle.textTransform;
						const innerText = childElement.innerText;

						// Only add newline if it's a block/flex element and there's more content coming after
						if ((display === 'block' || display === 'flex') && result && innerText) {
							result += '\n';
						}

						let text = innerText;

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
			} else if (childNode[PropertySymbol.nodeType] === NodeTypeEnum.textNode) {
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
		const childNodes = this[PropertySymbol.nodeArray];

		while (childNodes.length) {
			this.removeChild(childNodes[0]);
		}

		const texts = text.split(/[\n\r]/);
		const ownerDocument = this[PropertySymbol.ownerDocument];

		for (let i = 0, max = texts.length; i < max; i++) {
			if (i !== 0) {
				this.appendChild(ownerDocument.createElement('br'));
			}
			this.appendChild(ownerDocument.createTextNode(texts[i]));
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
		if (!this[PropertySymbol.parentNode]) {
			throw new this[PropertySymbol.window].DOMException(
				"Failed to set the 'outerHTML' property on 'Element': This element has no parent node."
			);
		}

		const texts = text.split(/[\n\r]/);

		for (let i = 0, max = texts.length; i < max; i++) {
			if (i !== 0) {
				this[PropertySymbol.parentNode].insertBefore(
					this[PropertySymbol.ownerDocument].createElement('br'),
					this
				);
			}
			this[PropertySymbol.parentNode].insertBefore(
				this[PropertySymbol.ownerDocument].createTextNode(texts[i]),
				this
			);
		}

		this[PropertySymbol.parentNode].removeChild(this);
	}

	/**
	 * Returns style.
	 *
	 * @returns Style.
	 */
	public get style(): CSSStyleDeclaration {
		if (!this[PropertySymbol.style]) {
			this[PropertySymbol.style] = new CSSStyleDeclaration(
				PropertySymbol.illegalConstructor,
				this[PropertySymbol.window],
				{ element: this }
			);
		}
		return this[PropertySymbol.style];
	}

	/**
	 * Sets style.
	 *
	 * @param cssText Style as text.
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style#setting_styles
	 */
	public set style(cssText: string | CSSStyleDeclaration | null) {
		this.style.cssText = typeof cssText === 'string' ? <string>cssText : '';
	}

	/**
	 * Returns data set.
	 *
	 * @returns Data set.
	 */
	public get dataset(): DOMStringMap {
		return (this[PropertySymbol.dataset] ??= new DOMStringMap(
			PropertySymbol.illegalConstructor,
			this
		));
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
	 * Returns inert.
	 *
	 * @returns Inert.
	 */
	public get inert(): boolean {
		return this.getAttribute('inert') !== null;
	}

	/**
	 * Returns inert.
	 *
	 * @param inert Inert.
	 */
	public set inert(inert: boolean) {
		if (!inert) {
			this.removeAttribute('inert');
		} else {
			this.setAttribute('inert', '');
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
	 * Returns popover.
	 *
	 * @returns Popover.
	 */
	public get popover(): string | null {
		const value = this.getAttribute('popover');
		switch (value) {
			case null:
				return null;
			case '':
			case 'auto':
				return 'auto';
			case 'manual':
				return 'manual';
			default:
				return 'manual';
		}
	}

	/**
	 * Sets popover.
	 *
	 * @param value Value.
	 */
	public set popover(value: string | null) {
		if (value === null) {
			this.removeAttribute('popover');
			return;
		}
		this.setAttribute('popover', value);
	}

	/**
	 * Triggers a click event.
	 */
	public click(): void {
		this.dispatchEvent(
			new PointerEvent('click', {
				bubbles: true,
				composed: true,
				cancelable: true
			})
		);
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
	public override [PropertySymbol.cloneNode](deep = false): HTMLElement {
		const clone = <HTMLElement>super[PropertySymbol.cloneNode](deep);

		clone[PropertySymbol.accessKey] = this[PropertySymbol.accessKey];

		return clone;
	}

	/**
	 * @override
	 * @see https://html.spec.whatwg.org/multipage/dom.html#htmlelement
	 */
	public override [PropertySymbol.connectedToNode](): void {
		const window = this[PropertySymbol.window];
		const localName = this[PropertySymbol.localName];
		const allCallbacks = window.customElements[PropertySymbol.callbacks];

		// This element can potentially be a custom element that has not been defined yet
		// Therefore we need to register a callback for when it is defined in CustomElementRegistry and replace it with the registered element (see #404)
		if (this.constructor === window.HTMLElement && localName.includes('-') && allCallbacks) {
			if (!this.#customElementDefineCallback) {
				const callback = this.#onCustomElementConnected.bind(this);
				const callbacks = allCallbacks.get(localName);
				if (callbacks) {
					callbacks.unshift(callback);
				} else {
					allCallbacks.set(localName, [callback]);
				}
				this.#customElementDefineCallback = callback;
			}
		}

		super[PropertySymbol.connectedToNode]();
	}

	/**
	 * @override
	 */
	public override [PropertySymbol.disconnectedFromNode](): void {
		const window = this[PropertySymbol.window];
		const localName = this[PropertySymbol.localName];
		const allCallbacks = window.customElements[PropertySymbol.callbacks];

		// This element can potentially be a custom element that has not been defined yet
		// Therefore we need to register a callback for when it is defined in CustomElementRegistry and replace it with the registered element (see #404)
		if (this.constructor === window.HTMLElement && localName.includes('-') && allCallbacks) {
			const callbacks = allCallbacks.get(localName);

			if (callbacks && this.#customElementDefineCallback) {
				const index = callbacks.indexOf(this.#customElementDefineCallback);
				if (index !== -1) {
					callbacks.splice(index, 1);
				}
				if (!callbacks.length) {
					allCallbacks.delete(localName);
				}
				this.#customElementDefineCallback = null;
			}
		}

		super[PropertySymbol.disconnectedFromNode]();
	}

	/**
	 * @override
	 */
	public override [PropertySymbol.onSetAttribute](
		attribute: Attr,
		replacedAttribute: Attr | null
	): void {
		super[PropertySymbol.onSetAttribute](attribute, replacedAttribute);

		this[PropertySymbol.window][PropertySymbol.customElementReactionStack].enqueueReaction(
			this,
			'attributeChangedCallback',
			[attribute.name, replacedAttribute?.value ?? null, attribute.value]
		);
	}

	/**
	 * @override
	 */
	public override [PropertySymbol.onRemoveAttribute](removedAttribute: Attr): void {
		super[PropertySymbol.onRemoveAttribute](removedAttribute);

		this[PropertySymbol.window][PropertySymbol.customElementReactionStack].enqueueReaction(
			this,
			'attributeChangedCallback',
			[removedAttribute.name, removedAttribute.value, null]
		);
	}

	/**
	 * Triggered when a custom element is connected to the DOM.
	 */
	#onCustomElementConnected(): void {
		if (!this[PropertySymbol.parentNode]) {
			return;
		}

		const window = this[PropertySymbol.window];
		const localName = this[PropertySymbol.localName];
		const newElement = <HTMLElement>this[PropertySymbol.ownerDocument].createElement(localName);
		const newCache = newElement[PropertySymbol.cache];

		newElement[PropertySymbol.nodeArray] = this[PropertySymbol.nodeArray];
		newElement[PropertySymbol.elementArray] = this[PropertySymbol.elementArray];
		newElement[PropertySymbol.childNodes] = null;
		newElement[PropertySymbol.children] = null;
		newElement[PropertySymbol.isConnected] = this[PropertySymbol.isConnected];
		newElement[PropertySymbol.rootNode] = this[PropertySymbol.rootNode];
		newElement[PropertySymbol.formNode] = this[PropertySymbol.formNode];
		newElement[PropertySymbol.parentNode] = this[PropertySymbol.parentNode];
		newElement[PropertySymbol.selectNode] = this[PropertySymbol.selectNode];
		newElement[PropertySymbol.textAreaNode] = this[PropertySymbol.textAreaNode];
		newElement[PropertySymbol.mutationListeners] = this[PropertySymbol.mutationListeners];
		newElement[PropertySymbol.isValue] = this[PropertySymbol.isValue];
		newElement[PropertySymbol.cache] = this[PropertySymbol.cache];
		newElement[PropertySymbol.affectsCache] = this[PropertySymbol.affectsCache];
		newElement[PropertySymbol.attributes][PropertySymbol.itemsByNamespaceURI] =
			this[PropertySymbol.attributes][PropertySymbol.itemsByNamespaceURI];
		newElement[PropertySymbol.attributes][PropertySymbol.itemsByName] =
			this[PropertySymbol.attributes][PropertySymbol.itemsByName];
		newElement[PropertySymbol.attributes][PropertySymbol.items] =
			this[PropertySymbol.attributes][PropertySymbol.items];

		for (const attr of newElement[PropertySymbol.attributes][PropertySymbol.items].values()) {
			attr[PropertySymbol.ownerElement] = newElement;
		}

		this[PropertySymbol.clearCache]();

		this[PropertySymbol.nodeArray] = [];
		this[PropertySymbol.elementArray] = [];
		this[PropertySymbol.childNodes] = null;
		this[PropertySymbol.children] = null;

		this[PropertySymbol.parentNode] = null;
		this[PropertySymbol.rootNode] = null;
		this[PropertySymbol.formNode] = null;
		this[PropertySymbol.selectNode] = null;
		this[PropertySymbol.textAreaNode] = null;

		this[PropertySymbol.mutationListeners] = [];
		this[PropertySymbol.isValue] = null;
		this[PropertySymbol.cache] = newCache;
		this[PropertySymbol.affectsCache] = [];
		this[PropertySymbol.attributes][PropertySymbol.itemsByNamespaceURI] = new Map();
		this[PropertySymbol.attributes][PropertySymbol.itemsByName] = new Map();
		this[PropertySymbol.attributes][PropertySymbol.items] = new Map();

		for (const node of newElement[PropertySymbol.nodeArray]) {
			node[PropertySymbol.parentNode] = newElement;
		}

		const parentChildNodes = newElement[PropertySymbol.parentNode][PropertySymbol.nodeArray];
		const parentChildElements = newElement[PropertySymbol.parentNode][PropertySymbol.elementArray];

		parentChildNodes[parentChildNodes.indexOf(this)] = newElement;
		parentChildElements[parentChildElements.indexOf(this)] = newElement;

		const allCallbacks = window.customElements[PropertySymbol.callbacks];
		const callbacks = allCallbacks.get(localName);

		if (callbacks && this.#customElementDefineCallback) {
			const index = callbacks.indexOf(this.#customElementDefineCallback);

			if (index !== -1) {
				callbacks.splice(index, 1);
			}

			if (!callbacks.length) {
				allCallbacks.delete(localName);
			}

			this.#customElementDefineCallback = null;
		}

		if (newElement[PropertySymbol.isConnected]) {
			if (newElement[PropertySymbol.shadowRoot]) {
				newElement[PropertySymbol.shadowRoot][PropertySymbol.isConnected] = true;
			}
			newElement[PropertySymbol.connectedToDocument]();
		}
	}
}
