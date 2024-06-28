import Element from '../element/Element.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import CSSStyleDeclaration from '../../css/declaration/CSSStyleDeclaration.js';
import PointerEvent from '../../event/events/PointerEvent.js';
import NodeTypeEnum from '../node/NodeTypeEnum.js';
import DOMException from '../../exception/DOMException.js';
import Event from '../../event/Event.js';
import HTMLElementUtility from './HTMLElementUtility.js';
import NodeList from '../node/NodeList.js';
import Node from '../node/Node.js';
import HTMLCollection from '../element/HTMLCollection.js';
import DatasetFactory from '../element/DatasetFactory.js';
import IDataset from '../element/IDataset.js';
import Attr from '../attr/Attr.js';
import NamedNodeMap from '../element/NamedNodeMap.js';
import IHTMLCollection from '../element/IHTMLCollection.js';

/**
 * HTML Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement.
 */
export default class HTMLElement extends Element {
	// Public properties
	public declare cloneNode: (deep?: boolean) => HTMLElement;

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
	#dataset: IDataset = null;
	#customElementDefineCallback: () => void = null;

	/**
	 * Constructor.
	 */
	constructor() {
		super();
		this[PropertySymbol.attributes][PropertySymbol.addEventListener](
			'set',
			this.#onSetAttribute.bind(this)
		);
		this[PropertySymbol.attributes][PropertySymbol.addEventListener](
			'remove',
			this.#onRemoveAttribute.bind(this)
		);
	}

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
				const childElement = <HTMLElement>childNode;
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
		const childNodes = this[PropertySymbol.childNodes];

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
	public get dataset(): IDataset {
		return (this.#dataset ??= DatasetFactory.createDataset(this));
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
	public override [PropertySymbol.cloneNode](deep = false): HTMLElement {
		const clone = <HTMLElement>super[PropertySymbol.cloneNode](deep);

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
	 * @override
	 * @see https://html.spec.whatwg.org/multipage/dom.html#htmlelement
	 */
	public [PropertySymbol.connectedToDocument](): void {
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

			if (!this.#customElementDefineCallback) {
				const callback = (): void => {
					if (this[PropertySymbol.parentNode]) {
						const newElement = <HTMLElement>(
							this[PropertySymbol.ownerDocument].createElement(localName)
						);
						(<NodeList<Node>>newElement[PropertySymbol.childNodes]) = <NodeList<Node>>(
							this[PropertySymbol.childNodes]
						);
						(<IHTMLCollection<Element>>newElement[PropertySymbol.children]) =
							this[PropertySymbol.children];
						(<boolean>newElement[PropertySymbol.isConnected]) = this[PropertySymbol.isConnected];

						newElement[PropertySymbol.rootNode] = this[PropertySymbol.rootNode];
						newElement[PropertySymbol.formNode] = this[PropertySymbol.formNode];
						newElement[PropertySymbol.selectNode] = this[PropertySymbol.selectNode];
						newElement[PropertySymbol.textAreaNode] = this[PropertySymbol.textAreaNode];
						newElement[PropertySymbol.mutationListeners] = this[PropertySymbol.mutationListeners];
						newElement[PropertySymbol.isValue] = this[PropertySymbol.isValue];

						for (let i = 0, max = this[PropertySymbol.attributes].length; i < max; i++) {
							newElement[PropertySymbol.attributes].setNamedItem(
								this[PropertySymbol.attributes][i]
							);
						}

						(<NodeList<Node>>this[PropertySymbol.childNodes]) = new NodeList<Node>();
						(<IHTMLCollection<Element>>this[PropertySymbol.children]) =
							new HTMLCollection<Element>();

						this[PropertySymbol.childNodes][PropertySymbol.htmlCollection] =
							this[PropertySymbol.children];

						this[PropertySymbol.rootNode] = null;
						this[PropertySymbol.formNode] = null;
						this[PropertySymbol.selectNode] = null;
						this[PropertySymbol.textAreaNode] = null;
						this[PropertySymbol.mutationListeners] = [];
						this[PropertySymbol.isValue] = null;
						(<NamedNodeMap>this[PropertySymbol.attributes]) = new NamedNodeMap(this);

						const parentChildNodes = (<HTMLElement>this[PropertySymbol.parentNode])[
							PropertySymbol.childNodes
						];
						parentChildNodes[PropertySymbol.insertItem](newElement, this.nextElementSibling);
						parentChildNodes[PropertySymbol.removeItem](this);

						if (newElement[PropertySymbol.isConnected] && newElement.connectedCallback) {
							const result = <void | Promise<void>>newElement.connectedCallback();
							/**
							 * It is common to import dependencies in the connectedCallback() method of web components.
							 * As Happy DOM doesn't have support for dynamic imports yet, this is a temporary solution to wait for imports in connectedCallback().
							 *
							 * @see https://github.com/capricorn86/happy-dom/issues/1442
							 */
							if (result instanceof Promise) {
								const asyncTaskManager =
									this[PropertySymbol.ownerDocument][PropertySymbol.ownerWindow][
										PropertySymbol.asyncTaskManager
									];
								const taskID = asyncTaskManager.startTask();
								result
									.then(() => asyncTaskManager.endTask(taskID))
									.catch(() => asyncTaskManager.endTask(taskID));
							}
						}

						this[PropertySymbol.disconnectedFromDocument]();
					}
				};
				callbacks[localName] = callbacks[localName] || [];
				callbacks[localName].push(callback);
				this.#customElementDefineCallback = callback;
			}
		}

		super[PropertySymbol.connectedToDocument]();
	}

	/**
	 * Called when disconnected from document.
	 * @param e
	 */
	public [PropertySymbol.disconnectedFromDocument](): void {
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

			if (callbacks[localName] && this.#customElementDefineCallback) {
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

		super[PropertySymbol.disconnectedFromDocument]();
	}

	/**
	 * Triggered when an attribute is set.
	 *
	 * @param item Item.
	 */
	#onSetAttribute(item: Attr): void {
		if (item[PropertySymbol.name] === 'style' && this[PropertySymbol.style]) {
			this[PropertySymbol.style].cssText = item[PropertySymbol.value];
		}
	}

	/**
	 * Triggered when an attribute is removed.
	 *
	 * @param removedItem Removed item.
	 */
	#onRemoveAttribute(removedItem: Attr): void {
		if (removedItem && removedItem[PropertySymbol.name] === 'style' && this[PropertySymbol.style]) {
			this[PropertySymbol.style].cssText = '';
		}
	}
}
