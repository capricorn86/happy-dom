import HTMLElement from '../html-element/HTMLElement.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import Event from '../../event/Event.js';
import SubmitEvent from '../../event/events/SubmitEvent.js';
import HTMLFormControlsCollection from './HTMLFormControlsCollection.js';
import Node from '../node/Node.js';
import HTMLInputElement from '../html-input-element/HTMLInputElement.js';
import HTMLSelectElement from '../html-select-element/HTMLSelectElement.js';
import HTMLButtonElement from '../html-button-element/HTMLButtonElement.js';
import IBrowserFrame from '../../browser/types/IBrowserFrame.js';
import BrowserFrameNavigator from '../../browser/utilities/BrowserFrameNavigator.js';
import FormData from '../../form-data/FormData.js';
import Element from '../element/Element.js';
import BrowserWindow from '../../window/BrowserWindow.js';
import Attr from '../attr/Attr.js';
import THTMLFormControlElement from './THTMLFormControlElement.js';

/**
 * HTML Form Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement.
 */
export default class HTMLFormElement extends HTMLElement {
	// Public properties
	public declare cloneNode: (deep?: boolean) => HTMLFormElement;

	// Internal properties.
	public [PropertySymbol.elements]: HTMLFormControlsCollection = new HTMLFormControlsCollection(
		this
	);
	public [PropertySymbol.formNode]: Node = this;

	// Events
	public onformdata: (event: Event) => void | null = null;
	public onreset: (event: Event) => void | null = null;
	public onsubmit: (event: Event) => void | null = null;

	// Private properties
	#browserFrame: IBrowserFrame;
	#documentChildNodeListeners: {
		add: (item: Node) => void;
		insert: (newItem: Node, referenceItem: Node | null) => void;
		remove: (item: Node) => void;
	} | null = null;

	/**
	 * Constructor.
	 *
	 * @param browserFrame Browser frame.
	 */
	constructor(browserFrame: IBrowserFrame) {
		super();
		this.#browserFrame = browserFrame;
		this[PropertySymbol.attributes][PropertySymbol.addEventListener](
			'set',
			this.#onSetAttribute.bind(this)
		);
		this[PropertySymbol.attributes][PropertySymbol.addEventListener](
			'remove',
			this.#onRemoveAttribute.bind(this)
		);

		// Child nodes listeners
		this[PropertySymbol.childNodesFlatten][PropertySymbol.addEventListener]('add', (item: Node) => {
			(<THTMLFormControlElement>item)[PropertySymbol.formNode] = this;
			this[PropertySymbol.elements][PropertySymbol.addItem](<THTMLFormControlElement>item);
		});
		this[PropertySymbol.childNodesFlatten][PropertySymbol.addEventListener](
			'insert',
			(newItem: Node, referenceItem: Node | null) => {
				(<THTMLFormControlElement>newItem)[PropertySymbol.formNode] = this;
				this[PropertySymbol.elements][PropertySymbol.insertItem](
					<THTMLFormControlElement>newItem,
					<THTMLFormControlElement>referenceItem
				);
			}
		);
		this[PropertySymbol.childNodesFlatten][PropertySymbol.addEventListener](
			'remove',
			(item: Node) => {
				(<THTMLFormControlElement>item)[PropertySymbol.formNode] = null;
				this[PropertySymbol.elements][PropertySymbol.removeItem](<THTMLFormControlElement>item);
			}
		);

		// HTMLFormControlsCollection listeners
		this[PropertySymbol.elements][PropertySymbol.addEventListener]('indexChange', (details) => {
			const length = this[PropertySymbol.elements].length;
			for (let i = details.index; i < length; i++) {
				this[i] = this[PropertySymbol.elements][i];
			}
			// Item removed
			if (!details.item) {
				delete this[length];
			}
		});
		this[PropertySymbol.elements][PropertySymbol.addEventListener]('propertyChange', (details) => {
			if (!this[PropertySymbol.isValidPropertyName](details.propertyName)) {
				return;
			}
			if (details.propertyValue) {
				Object.defineProperty(this, details.propertyName, {
					value: details.propertyValue,
					writable: false,
					enumerable: true,
					configurable: true
				});
			} else {
				delete this[details.propertyName];
			}
		});
	}

	/**
	 * Returns elements.
	 *
	 * @returns Elements.
	 */
	public get elements(): HTMLFormControlsCollection {
		return this[PropertySymbol.elements];
	}

	/**
	 * Returns length.
	 *
	 * @returns Length.
	 */
	public get length(): number {
		return this[PropertySymbol.elements].length;
	}

	/**
	 * Returns name.
	 *
	 * @returns Name.
	 */
	public get name(): string {
		return this.getAttribute('name') || '';
	}

	/**
	 * Sets name.
	 *
	 * @param name Name.
	 */
	public set name(name: string) {
		this.setAttribute('name', name);
	}

	/**
	 * Returns method.
	 *
	 * @returns Method.
	 */
	public get method(): string {
		return this.getAttribute('method') || 'get';
	}

	/**
	 * Sets method.
	 *
	 * @param method Method.
	 */
	public set method(method: string) {
		this.setAttribute('method', method);
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
	 * Returns action.
	 *
	 * @returns Action.
	 */
	public get action(): string {
		if (!this.hasAttribute('action')) {
			return this[PropertySymbol.ownerDocument].location.href;
		}

		try {
			return new URL(this.getAttribute('action'), this[PropertySymbol.ownerDocument].location.href)
				.href;
		} catch (e) {
			return '';
		}
	}

	/**
	 * Sets action.
	 *
	 * @param action Action.
	 */
	public set action(action: string) {
		this.setAttribute('action', action);
	}

	/**
	 * Returns encoding.
	 *
	 * @returns Encoding.
	 */
	public get encoding(): string {
		return this.getAttribute('encoding') || '';
	}

	/**
	 * Sets encoding.
	 *
	 * @param encoding Encoding.
	 */
	public set encoding(encoding: string) {
		this.setAttribute('encoding', encoding);
	}

	/**
	 * Returns enctype.
	 *
	 * @returns Enctype.
	 */
	public get enctype(): string {
		return this.getAttribute('enctype') || '';
	}

	/**
	 * Sets enctype.
	 *
	 * @param enctype Enctype.
	 */
	public set enctype(enctype: string) {
		this.setAttribute('enctype', enctype);
	}

	/**
	 * Returns autocomplete.
	 *
	 * @returns Autocomplete.
	 */
	public get autocomplete(): string {
		return this.getAttribute('autocomplete') || '';
	}

	/**
	 * Sets autocomplete.
	 *
	 * @param autocomplete Autocomplete.
	 */
	public set autocomplete(autocomplete: string) {
		this.setAttribute('autocomplete', autocomplete);
	}

	/**
	 * Returns accept charset.
	 *
	 * @returns Accept charset.
	 */
	public get acceptCharset(): string {
		return this.getAttribute('acceptcharset') || '';
	}

	/**
	 * Sets accept charset.
	 *
	 * @param acceptCharset Accept charset.
	 */
	public set acceptCharset(acceptCharset: string) {
		this.setAttribute('acceptcharset', acceptCharset);
	}

	/**
	 * Returns no validate.
	 *
	 * @returns No validate.
	 */
	public get noValidate(): boolean {
		return this.getAttribute('novalidate') !== null;
	}

	/**
	 * Sets no validate.
	 *
	 * @param noValidate No validate.
	 */
	public set noValidate(noValidate: boolean) {
		if (!noValidate) {
			this.removeAttribute('novalidate');
		} else {
			this.setAttribute('novalidate', '');
		}
	}

	/**
	 * Submits form. No submit event is raised. In particular, the form's "submit" event handler is not run.
	 */
	public submit(): void {
		this.#submit();
	}

	/**
	 * Submits form, reports validity and raises submit event.
	 *
	 * @param [submitter] Submitter.
	 */
	public requestSubmit(submitter?: HTMLInputElement | HTMLButtonElement): void {
		const noValidate = submitter?.formNoValidate || this.noValidate;
		if (noValidate || this.checkValidity()) {
			this.dispatchEvent(
				new SubmitEvent('submit', { bubbles: true, cancelable: true, submitter: submitter || this })
			);
			this.#submit(submitter);
		}
	}

	/**
	 * Resets form.
	 */
	public reset(): void {
		for (const element of this[PropertySymbol.elements]) {
			if (
				element[PropertySymbol.tagName] === 'INPUT' ||
				element[PropertySymbol.tagName] === 'TEXTAREA'
			) {
				element[PropertySymbol.value] = null;
				element[PropertySymbol.checked] = null;
			} else if (element[PropertySymbol.tagName] === 'TEXTAREA') {
				element[PropertySymbol.value] = null;
			} else if (element[PropertySymbol.tagName] === 'SELECT') {
				let hasSelectedAttribute = false;
				for (const option of (<HTMLSelectElement>element).options) {
					if (option.hasAttribute('selected')) {
						hasSelectedAttribute = true;
						option.selected = true;
						break;
					}
				}
				if (!hasSelectedAttribute && (<HTMLSelectElement>element).options.length > 0) {
					(<HTMLSelectElement>element).options[0].selected = true;
				}
			}
		}

		this.dispatchEvent(new Event('reset', { bubbles: true, cancelable: true }));
	}

	/**
	 * Checks validity.
	 *
	 * @returns "true" if validation does'nt fail.
	 */
	public checkValidity(): boolean {
		const radioValidationState: { [k: string]: boolean } = {};
		let isFormValid = true;

		for (const element of this[PropertySymbol.elements]) {
			if (element[PropertySymbol.tagName] === 'INPUT' && element.type === 'radio' && element.name) {
				if (!radioValidationState[element.name]) {
					radioValidationState[element.name] = true;
					if (!element.checkValidity()) {
						isFormValid = false;
					}
				}
			} else if (!element.checkValidity()) {
				isFormValid = false;
			}
		}

		return isFormValid;
	}

	/**
	 * Reports validity.
	 *
	 * @returns "true" if validation does'nt fail.
	 */
	public reportValidity(): boolean {
		return this.checkValidity();
	}

	/**
	 * @override
	 */
	public override [PropertySymbol.cloneNode](deep = false): HTMLFormElement {
		return <HTMLFormElement>super[PropertySymbol.cloneNode](deep);
	}

	/**
	 * @override
	 */
	public override [PropertySymbol.connectedToDocument](): void {
		super[PropertySymbol.connectedToDocument]();

		// Document child nodes listeners
		this.#documentChildNodeListeners = {
			add: (item: Node) => {
				if (!this[PropertySymbol.isConnected]) {
					return;
				}
				(<THTMLFormControlElement>item)[PropertySymbol.formNode] = this;
				this[PropertySymbol.elements][PropertySymbol.addItem](<THTMLFormControlElement>item);
			},
			insert: (newItem: Node, referenceItem: Node | null) => {
				if (!this[PropertySymbol.isConnected]) {
					return;
				}
				(<THTMLFormControlElement>newItem)[PropertySymbol.formNode] = this;
				this[PropertySymbol.elements][PropertySymbol.insertItem](
					<THTMLFormControlElement>newItem,
					<THTMLFormControlElement>referenceItem
				);
			},
			remove: (item: Node) => {
				if (!this[PropertySymbol.isConnected]) {
					return;
				}
				(<THTMLFormControlElement>item)[PropertySymbol.formNode] = null;
				this[PropertySymbol.elements][PropertySymbol.removeItem](<THTMLFormControlElement>item);
			}
		};

		this[PropertySymbol.ownerDocument][PropertySymbol.childNodesFlatten][
			PropertySymbol.addEventListener
		]('add', this.#documentChildNodeListeners.add);
		this[PropertySymbol.ownerDocument][PropertySymbol.childNodesFlatten][
			PropertySymbol.addEventListener
		]('insert', this.#documentChildNodeListeners.insert);
		this[PropertySymbol.ownerDocument][PropertySymbol.childNodesFlatten][
			PropertySymbol.addEventListener
		]('remove', this.#documentChildNodeListeners.remove);

		const id = this.id;

		if (!id) {
			return;
		}

		for (const node of this[PropertySymbol.ownerDocument][PropertySymbol.childNodesFlatten]) {
			if (
				node[PropertySymbol.attributes]?.['form']?.value === id &&
				node[PropertySymbol.formNode] !== this
			) {
				node[PropertySymbol.formNode] = this;
				this[PropertySymbol.elements][PropertySymbol.addItem](<THTMLFormControlElement>node);
			}
		}
	}

	/**
	 * @override
	 */
	public override [PropertySymbol.disconnectedFromDocument](): void {
		super[PropertySymbol.disconnectedFromDocument]();

		if (!this.#documentChildNodeListeners) {
			return;
		}

		// Document child nodes listeners
		this[PropertySymbol.ownerDocument][PropertySymbol.childNodesFlatten][
			PropertySymbol.removeEventListener
		]('add', this.#documentChildNodeListeners.add);
		this[PropertySymbol.ownerDocument][PropertySymbol.childNodesFlatten][
			PropertySymbol.removeEventListener
		]('insert', this.#documentChildNodeListeners.insert);
		this[PropertySymbol.ownerDocument][PropertySymbol.childNodesFlatten][
			PropertySymbol.removeEventListener
		]('remove', this.#documentChildNodeListeners.remove);

		this.#documentChildNodeListeners = null;

		const id = this.id;

		if (!id) {
			return;
		}

		for (const node of this[PropertySymbol.elements]) {
			if (
				node[PropertySymbol.attributes]?.['form']?.value === id &&
				!this[PropertySymbol.childNodesFlatten][PropertySymbol.includes](node)
			) {
				node[PropertySymbol.formNode] = null;
				this[PropertySymbol.elements][PropertySymbol.removeItem](<THTMLFormControlElement>node);
			}
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
			!!name &&
			!HTMLFormElement.prototype.hasOwnProperty(name) &&
			!HTMLElement.prototype.hasOwnProperty(name) &&
			!Element.prototype.hasOwnProperty(name) &&
			!Node.prototype.hasOwnProperty(name) &&
			(isNaN(Number(name)) || name.includes('.'))
		);
	}

	/**
	 * Submits form.
	 *
	 * @param [submitter] Submitter.
	 */
	#submit(submitter?: HTMLInputElement | HTMLButtonElement): void {
		const action = submitter?.hasAttribute('formaction')
			? submitter?.formAction || this.action
			: this.action;

		if (!action) {
			// The URL is invalid when the action is empty.
			// This is what Chrome does when the URL is invalid.
			this[PropertySymbol.ownerDocument].location.hash = '#blocked';
			return;
		}

		const method = submitter?.formMethod || this.method;
		const formData = new FormData(this);
		let targetFrame: IBrowserFrame;

		switch (submitter?.formTarget || this.target) {
			default:
			case '_self':
				targetFrame = this.#browserFrame;
				break;
			case '_top':
				targetFrame = this.#browserFrame.page.mainFrame;
				break;
			case '_parent':
				targetFrame = this.#browserFrame.parentFrame ?? this.#browserFrame;
				break;
			case '_blank':
				const newPage = this.#browserFrame.page.context.newPage();
				targetFrame = newPage.mainFrame;
				targetFrame[PropertySymbol.openerFrame] = this.#browserFrame;
				break;
		}

		if (method === 'get') {
			const url = new URL(action);

			for (const [key, value] of formData) {
				if (typeof value === 'string') {
					url.searchParams.append(key, value);
				}
			}

			BrowserFrameNavigator.navigate({
				windowClass: <typeof BrowserWindow>(
					this[PropertySymbol.ownerDocument][PropertySymbol.defaultView].constructor
				),
				frame: targetFrame,
				url: url.href,
				goToOptions: {
					referrer: this.#browserFrame.page.mainFrame.window.location.origin
				}
			});

			return;
		}

		BrowserFrameNavigator.navigate({
			windowClass: <typeof BrowserWindow>(
				this[PropertySymbol.ownerDocument][PropertySymbol.defaultView].constructor
			),
			frame: targetFrame,
			method: method,
			url: action,
			formData,
			goToOptions: {
				referrer: this.#browserFrame.page.mainFrame.window.location.origin
			}
		});
	}

	/**
	 * Triggered when an attribute is set.
	 *
	 * @param attribute Attribute.
	 * @param replacedAttribute Replaced attribute.
	 */
	#onSetAttribute(attribute: Attr, replacedAttribute: Attr | null): void {
		if (attribute.name !== 'id' || !this[PropertySymbol.isConnected]) {
			return;
		}

		if (replacedAttribute[PropertySymbol.value]) {
			for (const node of this[PropertySymbol.ownerDocument][PropertySymbol.childNodesFlatten]) {
				if (
					node[PropertySymbol.attributes]?.['form']?.value === replacedAttribute.value &&
					!this[PropertySymbol.childNodesFlatten][PropertySymbol.includes](node)
				) {
					node[PropertySymbol.formNode] = null;
					this[PropertySymbol.elements][PropertySymbol.removeItem](<THTMLFormControlElement>node);
				}
			}
		}

		if (attribute[PropertySymbol.value]) {
			for (const node of this[PropertySymbol.ownerDocument][PropertySymbol.childNodesFlatten]) {
				if (
					node[PropertySymbol.attributes]?.['form']?.value === attribute[PropertySymbol.value] &&
					node[PropertySymbol.formNode] !== this
				) {
					node[PropertySymbol.formNode] = this;
					this[PropertySymbol.elements][PropertySymbol.addItem](<THTMLFormControlElement>node);
				}
			}
		}
	}

	/**
	 * Triggered when an attribute is removed.
	 *
	 * @param removedAttribute Removed attribute.
	 */
	#onRemoveAttribute(removedAttribute: Attr): void {
		if (
			removedAttribute.name === 'id' &&
			removedAttribute[PropertySymbol.value] &&
			this[PropertySymbol.isConnected]
		) {
			for (const node of this[PropertySymbol.ownerDocument][PropertySymbol.childNodesFlatten]) {
				if (
					node[PropertySymbol.attributes]?.['form']?.value ===
						removedAttribute[PropertySymbol.value] &&
					!this[PropertySymbol.childNodesFlatten][PropertySymbol.includes](node)
				) {
					node[PropertySymbol.formNode] = null;
					this[PropertySymbol.elements][PropertySymbol.removeItem](<THTMLFormControlElement>node);
				}
			}
		}
	}
}
