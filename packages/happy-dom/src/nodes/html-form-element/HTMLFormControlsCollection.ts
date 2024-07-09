import * as PropertySymbol from '../../PropertySymbol.js';
import EventTarget from '../../event/EventTarget.js';
import Attr from '../attr/Attr.js';
import Element from '../element/Element.js';
import HTMLCollection from '../element/HTMLCollection.js';
import IHTMLCollectionObservedNode from '../element/IHTMLCollectionObservedNode.js';
import TNamedNodeMapListener from '../element/TNamedNodeMapListener.js';
import HTMLElement from '../html-element/HTMLElement.js';
import Node from '../node/Node.js';
import HTMLFormElement from './HTMLFormElement.js';
import IRadioNodeList from './IRadioNodeList.js';
import RadioNodeList from './RadioNodeList.js';
import THTMLFormControlElement from './THTMLFormControlElement.js';

/**
 * HTMLFormControlsCollection.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormControlsCollection
 */
export default class HTMLFormControlsCollection extends HTMLCollection<
	THTMLFormControlElement,
	THTMLFormControlElement | IRadioNodeList
> {
	public [PropertySymbol.namedItems] = new Map<string, IRadioNodeList>();
	#observedFormElement: IHTMLCollectionObservedNode | null = null;
	#observedDocument: IHTMLCollectionObservedNode | null = null;
	#observedDocumentAttributeListeners: {
		set: TNamedNodeMapListener | null;
		remove: TNamedNodeMapListener | null;
	} = {
		set: null,
		remove: null
	};
	#formElement: HTMLFormElement;

	/**
	 * Constructor.
	 *
	 * @param formElement Form element.
	 */
	constructor(formElement: HTMLFormElement) {
		super();
		this.#formElement = formElement;
	}

	/**
	 * @override
	 */
	public namedItem(name: string): THTMLFormControlElement | IRadioNodeList | null {
		const namedItems = this[PropertySymbol.namedItems].get(name);

		if (!namedItems?.length) {
			return null;
		}

		if (namedItems.length === 1) {
			return namedItems[0];
		}

		return namedItems;
	}

	/**
	 * Observes node.
	 *
	 * @returns Observed node.
	 */
	public [PropertySymbol.observe](): IHTMLCollectionObservedNode {
		if (this.#observedFormElement) {
			return;
		}
		const observedNode = super[PropertySymbol.observe](this.#formElement, {
			subtree: true,
			filter: (item: THTMLFormControlElement) =>
				item[PropertySymbol.tagName] === 'INPUT' ||
				item[PropertySymbol.tagName] === 'SELECT' ||
				item[PropertySymbol.tagName] === 'TEXTAREA' ||
				item[PropertySymbol.tagName] === 'BUTTON' ||
				item[PropertySymbol.tagName] === 'FIELDSET'
		});

		this.#observedFormElement = observedNode;

		return observedNode;
	}

	/**
	 * Unobserves node.
	 *
	 * @param observedNode Observed node.
	 */
	public [PropertySymbol.unobserve](): void {
		if (!this.#observedFormElement) {
			return;
		}
		super[PropertySymbol.unobserve](this.#observedFormElement);
		this.#observedFormElement = null;
	}

	/**
	 * Observes node.
	 *
	 * @returns Observed node.
	 */
	public [PropertySymbol.observeDocument](): IHTMLCollectionObservedNode {
		if (this.#observedDocumentAttributeListeners.set) {
			return;
		}

		const formElement = this.#formElement;

		if (!formElement[PropertySymbol.isConnected]) {
			return;
		}

		this.#observedDocumentAttributeListeners.set = (attribute: Attr, replacedAttribute?: Attr) => {
			if (attribute.name === 'id') {
				if (replacedAttribute[PropertySymbol.value]) {
					super[PropertySymbol.unobserve](this.#observedDocument);
					this.#observedDocument = null;
				}
				if (attribute[PropertySymbol.value]) {
					this.#observedDocument = super[PropertySymbol.observe](
						formElement[PropertySymbol.ownerDocument]
					);
				}
			}
		};
		this.#observedDocumentAttributeListeners.remove = (attribute: Attr) => {
			if (attribute.name === 'id') {
				super[PropertySymbol.unobserve](this.#observedDocument);
				this.#observedDocument = null;
			}
		};

		formElement[PropertySymbol.attributes][PropertySymbol.addEventListener](
			'set',
			this.#observedDocumentAttributeListeners.set
		);
		formElement[PropertySymbol.attributes][PropertySymbol.addEventListener](
			'remove',
			this.#observedDocumentAttributeListeners.remove
		);

		const id = formElement[PropertySymbol.attributes]['id']?.value;

		if (!id) {
			return;
		}

		const observedNode = super[PropertySymbol.observe](formElement[PropertySymbol.ownerDocument], {
			subtree: true,
			filter: (item: THTMLFormControlElement) => {
				if (!id) {
					return false;
				}
				return (
					(item[PropertySymbol.tagName] === 'INPUT' ||
						item[PropertySymbol.tagName] === 'SELECT' ||
						item[PropertySymbol.tagName] === 'TEXTAREA' ||
						item[PropertySymbol.tagName] === 'BUTTON' ||
						item[PropertySymbol.tagName] === 'FIELDSET') &&
					item[PropertySymbol.attributes]['form']?.value === id
				);
			}
		});

		this.#observedDocument = observedNode;

		return observedNode;
	}

	/**
	 * Unobserves node.
	 *
	 * @param observedNode Observed node.
	 */
	public [PropertySymbol.unobserveDocument](): void {
		if (!this.#observedDocumentAttributeListeners.set) {
			return;
		}

		const formElement = this.#formElement;

		formElement[PropertySymbol.attributes][PropertySymbol.removeEventListener](
			'set',
			this.#observedDocumentAttributeListeners.set
		);
		formElement[PropertySymbol.attributes][PropertySymbol.removeEventListener](
			'remove',
			this.#observedDocumentAttributeListeners.remove
		);

		this.#observedDocumentAttributeListeners.set = null;
		this.#observedDocumentAttributeListeners.remove = null;

		if (!this.#observedDocument) {
			return;
		}

		super[PropertySymbol.unobserve](this.#observedDocument);
		this.#observedDocument = null;
	}

	/**
	 * @override
	 */
	public override [PropertySymbol.addItem](item: THTMLFormControlElement): boolean {
		if (!super[PropertySymbol.addItem](item)) {
			return false;
		}

		item[PropertySymbol.formNode] = this.#formElement;

		this.#formElement[this.length - 1] = item;

		return true;
	}

	/**
	 * @override
	 */
	public override [PropertySymbol.insertItem](
		newItem: THTMLFormControlElement,
		referenceItem: THTMLFormControlElement | null
	): boolean {
		if (!super[PropertySymbol.insertItem](newItem, referenceItem)) {
			return false;
		}

		newItem[PropertySymbol.formNode] = this.#formElement;

		const index = this[PropertySymbol.indexOf](newItem);

		for (let i = index, max = this.length; i < max; i++) {
			this.#formElement[i] = this[i];
		}

		return true;
	}

	/**
	 * @override
	 */
	public override [PropertySymbol.removeItem](item: THTMLFormControlElement): boolean {
		const index = this[PropertySymbol.indexOf](item);

		if (!super[PropertySymbol.removeItem](item)) {
			return false;
		}

		item[PropertySymbol.formNode] = null;

		for (let i = index, max = this.length; i < max; i++) {
			this.#formElement[i] = this[i];
		}

		delete this.#formElement[this.length];

		return true;
	}

	/**
	 * @override
	 */
	protected override [PropertySymbol.onSetAttribute](
		item: THTMLFormControlElement,
		attribute: Attr,
		replacedAttribute: Attr | null
	): void {
		if (attribute.name !== 'form') {
			super[PropertySymbol.onSetAttribute](item, attribute, replacedAttribute);
			return;
		}

		if (!this.#formElement[PropertySymbol.isConnected]) {
			return;
		}

		const id = this.#formElement[PropertySymbol.attributes]['id']?.value;

		if (!id) {
			return;
		}

		if (replacedAttribute?.value === id) {
			this.#formElement[PropertySymbol.removeItem](item);
		}

		if (attribute.value === id) {
			this.#formElement[PropertySymbol.addItem](item);
		}
	}

	/**
	 * @override
	 */
	protected override [PropertySymbol.onRemoveAttribute](
		item: THTMLFormControlElement,
		removedAttribute: Attr
	): void {
		if (removedAttribute.name !== 'form') {
			super[PropertySymbol.onRemoveAttribute](item, removedAttribute);
			return;
		}

		if (!this.#formElement[PropertySymbol.isConnected]) {
			return;
		}

		const id = this.#formElement[PropertySymbol.attributes]['id']?.value;

		if (!id) {
			return;
		}

		if (removedAttribute.value === id) {
			this.#formElement[PropertySymbol.removeItem](item);
		}
	}

	/**
	 * @override
	 */
	protected override [PropertySymbol.updateNamedItemProperty](name: string): void {
		if (!this[PropertySymbol.isValidPropertyName](name)) {
			return;
		}

		const namedItems = this[PropertySymbol.namedItems].get(name);

		if (namedItems?.length) {
			const newValue = namedItems.length === 1 ? namedItems[0] : namedItems;
			if (Object.getOwnPropertyDescriptor(this, name)?.value !== newValue) {
				Object.defineProperty(this, name, {
					value: newValue,
					writable: false,
					enumerable: true,
					configurable: true
				});

				Object.defineProperty(this.#formElement, name, {
					value: newValue,
					writable: false,
					enumerable: true,
					configurable: true
				});
			}
		} else {
			delete this[name];
			delete this.#formElement[name];
		}
	}

	/**
	 * Returns "true" if the property name is valid.
	 *
	 * @param name Name.
	 * @returns True if the property name is valid.
	 */
	protected [PropertySymbol.isValidPropertyName](name: string): boolean {
		return (
			!HTMLCollection.prototype.hasOwnProperty(name) &&
			!this.#formElement.constructor.prototype.hasOwnProperty(name) &&
			!HTMLElement.constructor.prototype.hasOwnProperty(name) &&
			!Element.constructor.prototype.hasOwnProperty(name) &&
			!Node.constructor.hasOwnProperty(name) &&
			!EventTarget.constructor.hasOwnProperty(name) &&
			super[PropertySymbol.isValidPropertyName](name)
		);
	}

	/**
	 * Creates a new NodeList to be used as a named item.
	 *
	 * @returns NodeList.
	 */
	protected [PropertySymbol.createNamedItemsNodeList](): IRadioNodeList {
		return new RadioNodeList();
	}
}
