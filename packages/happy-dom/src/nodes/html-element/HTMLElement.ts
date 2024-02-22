import Element from '../element/Element.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import IHTMLElement from './IHTMLElement.js';
import CSSStyleDeclaration from '../../css/declaration/CSSStyleDeclaration.js';
import PointerEvent from '../../event/events/PointerEvent.js';
import Dataset from '../element/Dataset.js';
import NodeTypeEnum from '../node/NodeTypeEnum.js';
import DOMException from '../../exception/DOMException.js';
import Event from '../../event/Event.js';
import HTMLElementUtility from './HTMLElementUtility.js';
import INamedNodeMap from '../../named-node-map/INamedNodeMap.js';
import HTMLElementNamedNodeMap from './HTMLElementNamedNodeMap.js';
import INodeList from '../node/INodeList.js';
import INode from '../node/INode.js';
import IHTMLCollection from '../element/IHTMLCollection.js';
import IElement from '../element/IElement.js';
import NodeList from '../node/NodeList.js';
import HTMLCollection from '../element/HTMLCollection.js';

/**
 * HTML Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement.
 */
export default class HTMLElement extends Element implements IHTMLElement {
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

	// Internal properties
	public override [PropertySymbol.attributes]: INamedNodeMap = new HTMLElementNamedNodeMap(this);
	public [PropertySymbol.accessKey] = '';
	public [PropertySymbol.contentEditable] = 'inherit';
	public [PropertySymbol.isContentEditable] = false;
	public [PropertySymbol.offsetHeight] = 0;
	public [PropertySymbol.offsetWidth] = 0;
	public [PropertySymbol.offsetLeft] = 0;
	public [PropertySymbol.offsetTop] = 0;
	public [PropertySymbol.clientHeight] = 0;
	public [PropertySymbol.clientWidth] = 0;
	public [PropertySymbol.clientLeft] = 0;
	public [PropertySymbol.clientTop] = 0;
	public [PropertySymbol.style]: CSSStyleDeclaration = null;

	// Private properties
	#dataset: Dataset = null;
	#customElementDefineCallback: () => void = null;

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
		return this[PropertySymbol.contentEditable];
	}

	/**
	 * Sets content editable.
	 *
	 * @param contentEditable Content editable.
	 */
	public set contentEditable(contentEditable: string) {
		this[PropertySymbol.contentEditable] = contentEditable;
	}

	/**
	 * Returns is content editable.
	 *
	 * @returns Is content editable.
	 */
	public get isContentEditable(): boolean {
		return this[PropertySymbol.isContentEditable];
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
		if (!this[PropertySymbol.isConnected]) {
			return this.textContent;
		}

		let result = '';

		for (const childNode of this[PropertySymbol.childNodes]) {
			if (childNode[PropertySymbol.nodeType] === NodeTypeEnum.elementNode) {
				const childElement = <IHTMLElement>childNode;
				const computedStyle =
					this[PropertySymbol.ownerDocument][PropertySymbol.ownerWindow].getComputedStyle(
						childElement
					);

				if (
					childElement[PropertySymbol.tagName] !== 'SCRIPT' &&
					childElement[PropertySymbol.tagName] !== 'STYLE'
				) {
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
		for (const child of this[PropertySymbol.childNodes].slice()) {
			this.removeChild(child);
		}

		const texts = text.split(/[\n\r]/);

		for (let i = 0, max = texts.length; i < max; i++) {
			if (i !== 0) {
				this.appendChild(this[PropertySymbol.ownerDocument].createElement('br'));
			}
			this.appendChild(this[PropertySymbol.ownerDocument].createTextNode(texts[i]));
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
			throw new DOMException(
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
			this[PropertySymbol.style] = new CSSStyleDeclaration(this);
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
	public get dataset(): { [key: string]: string } {
		return (this.#dataset ??= new Dataset(this)).proxy;
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
		event[PropertySymbol.target] = this;
		event[PropertySymbol.currentTarget] = this;
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
	public cloneNode(deep = false): IHTMLElement {
		const clone = <HTMLElement>super.cloneNode(deep);

		clone[PropertySymbol.accessKey] = this[PropertySymbol.accessKey];
		clone[PropertySymbol.contentEditable] = this[PropertySymbol.contentEditable];
		clone[PropertySymbol.isContentEditable] = this[PropertySymbol.isContentEditable];

		if (this[PropertySymbol.style]) {
			clone.style.cssText = this[PropertySymbol.style].cssText;
		}

		return clone;
	}

	/**
	 * Connects this element to another element.
	 *
	 * @see https://html.spec.whatwg.org/multipage/dom.html#htmlelement
	 * @param parentNode Parent node.
	 */
	public [PropertySymbol.connectToNode](parentNode: INode = null): void {
		const localName = this[PropertySymbol.localName];

		// This element can potentially be a custom element that has not been defined yet
		// Therefore we need to register a callback for when it is defined in CustomElementRegistry and replace it with the registered element (see #404)
		if (
			this.constructor === HTMLElement &&
			localName.includes('-') &&
			this[PropertySymbol.ownerDocument][PropertySymbol.ownerWindow].customElements[
				PropertySymbol.callbacks
			]
		) {
			const callbacks =
				this[PropertySymbol.ownerDocument][PropertySymbol.ownerWindow].customElements[
					PropertySymbol.callbacks
				];

			if (parentNode && !this.#customElementDefineCallback) {
				const callback = (): void => {
					if (this[PropertySymbol.parentNode]) {
						const newElement = <HTMLElement>(
							this[PropertySymbol.ownerDocument].createElement(localName)
						);
						(<INodeList<INode>>newElement[PropertySymbol.childNodes]) =
							this[PropertySymbol.childNodes];
						(<IHTMLCollection<IElement>>newElement[PropertySymbol.children]) =
							this[PropertySymbol.children];
						(<boolean>newElement[PropertySymbol.isConnected]) = this[PropertySymbol.isConnected];

						newElement[PropertySymbol.rootNode] = this[PropertySymbol.rootNode];
						newElement[PropertySymbol.formNode] = this[PropertySymbol.formNode];
						newElement[PropertySymbol.selectNode] = this[PropertySymbol.selectNode];
						newElement[PropertySymbol.textAreaNode] = this[PropertySymbol.textAreaNode];
						newElement[PropertySymbol.observers] = this[PropertySymbol.observers];
						newElement[PropertySymbol.isValue] = this[PropertySymbol.isValue];

						for (let i = 0, max = this[PropertySymbol.attributes].length; i < max; i++) {
							newElement[PropertySymbol.attributes].setNamedItem(
								this[PropertySymbol.attributes][i]
							);
						}

						(<INodeList<INode>>this[PropertySymbol.childNodes]) = new NodeList();
						(<IHTMLCollection<IElement>>this[PropertySymbol.children]) = new HTMLCollection();
						this[PropertySymbol.rootNode] = null;
						this[PropertySymbol.formNode] = null;
						this[PropertySymbol.selectNode] = null;
						this[PropertySymbol.textAreaNode] = null;
						this[PropertySymbol.observers] = [];
						this[PropertySymbol.isValue] = null;
						(<HTMLElementNamedNodeMap>this[PropertySymbol.attributes]) =
							new HTMLElementNamedNodeMap(this);

						for (
							let i = 0,
								max = (<HTMLElement>this[PropertySymbol.parentNode])[PropertySymbol.childNodes]
									.length;
							i < max;
							i++
						) {
							if (
								(<HTMLElement>this[PropertySymbol.parentNode])[PropertySymbol.childNodes][i] ===
								this
							) {
								(<HTMLElement>this[PropertySymbol.parentNode])[PropertySymbol.childNodes][i] =
									newElement;
								break;
							}
						}

						if ((<HTMLElement>this[PropertySymbol.parentNode])[PropertySymbol.children]) {
							for (
								let i = 0,
									max = (<HTMLElement>this[PropertySymbol.parentNode])[PropertySymbol.children]
										.length;
								i < max;
								i++
							) {
								if (
									(<HTMLElement>this[PropertySymbol.parentNode])[PropertySymbol.children][i] ===
									this
								) {
									(<HTMLElement>this[PropertySymbol.parentNode])[PropertySymbol.children][i] =
										newElement;
									break;
								}
							}
						}

						if (newElement[PropertySymbol.isConnected] && newElement.connectedCallback) {
							newElement.connectedCallback();
						}

						this[PropertySymbol.connectToNode](null);
					}
				};
				callbacks[localName] = callbacks[localName] || [];
				callbacks[localName].push(callback);
				this.#customElementDefineCallback = callback;
			} else if (!parentNode && callbacks[localName] && this.#customElementDefineCallback) {
				const index = callbacks[localName].indexOf(this.#customElementDefineCallback);
				if (index !== -1) {
					callbacks[localName].splice(index, 1);
				}
				if (!callbacks[localName].length) {
					delete callbacks[localName];
				}
				this.#customElementDefineCallback = null;
			}
		}

		super[PropertySymbol.connectToNode](parentNode);
	}
}
