import HTMLElement from '../html-element/HTMLElement.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import Event from '../../event/Event.js';
import SubmitEvent from '../../event/events/SubmitEvent.js';
import HTMLFormControlsCollection from './HTMLFormControlsCollection.js';
import HTMLInputElement from '../html-input-element/HTMLInputElement.js';
import HTMLSelectElement from '../html-select-element/HTMLSelectElement.js';
import HTMLButtonElement from '../html-button-element/HTMLButtonElement.js';
import IBrowserFrame from '../../browser/types/IBrowserFrame.js';
import BrowserFrameNavigator from '../../browser/utilities/BrowserFrameNavigator.js';
import FormData from '../../form-data/FormData.js';
import BrowserWindow from '../../window/BrowserWindow.js';
import THTMLFormControlElement from './THTMLFormControlElement.js';
import QuerySelector from '../../query-selector/QuerySelector.js';
import RadioNodeList from './RadioNodeList.js';
import Element from '../element/Element.js';
import EventTarget from '../../event/EventTarget.js';
import Node from '../node/Node.js';
import ClassMethodBinder from '../../ClassMethodBinder.js';

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
	public [PropertySymbol.elements]: HTMLFormControlsCollection | null = null;
	public [PropertySymbol.proxy]: HTMLFormElement;

	// Events
	public onformdata: (event: Event) => void | null = null;
	public onreset: (event: Event) => void | null = null;
	public onsubmit: (event: Event) => void | null = null;

	// Private properties
	#browserFrame: IBrowserFrame;

	/**
	 * Constructor.
	 *
	 * @param browserFrame Browser frame.
	 */
	constructor(browserFrame: IBrowserFrame) {
		super();

		this.#browserFrame = browserFrame;

		ClassMethodBinder.bindMethods(
			this,
			[EventTarget, Node, Element, HTMLElement, HTMLFormElement],
			{
				bindSymbols: true,
				forwardToPrototype: true
			}
		);

		const proxy = new Proxy(this, {
			get: (target, property) => {
				if (property === 'length') {
					return target[PropertySymbol.getFormControlItems]().length;
				}
				if (property in target || typeof property === 'symbol') {
					return target[property];
				}
				const index = Number(property);
				if (!isNaN(index)) {
					return target[PropertySymbol.getFormControlItems]()[index];
				}
				return target[PropertySymbol.getFormControlNamedItem](<string>property) || undefined;
			},
			set(target, property, newValue): boolean {
				if (typeof property === 'symbol') {
					target[property] = newValue;
					return true;
				}
				const index = Number(property);
				if (isNaN(index)) {
					target[property] = newValue;
				}
				return true;
			},
			deleteProperty(target, property): boolean {
				if (typeof property === 'symbol') {
					delete target[property];
					return true;
				}
				const index = Number(property);
				if (isNaN(index)) {
					delete target[property];
				}
				return true;
			},
			ownKeys(target): string[] {
				return Object.keys(target[PropertySymbol.getFormControlItems]());
			},
			has(target, property): boolean {
				if (property in target) {
					return true;
				}

				if (typeof property === 'symbol') {
					return false;
				}

				const items = target[PropertySymbol.getFormControlItems]();
				const index = Number(property);

				if (!isNaN(index) && index >= 0 && index < items.length) {
					return true;
				}

				property = String(property);

				for (let i = 0; i < items.length; i++) {
					const item = items[i];
					const name =
						item[PropertySymbol.attributes][PropertySymbol.namedItems].get('id')?.[
							PropertySymbol.value
						] ||
						item[PropertySymbol.attributes][PropertySymbol.namedItems].get('name')?.[
							PropertySymbol.value
						];

					if (name && name === property) {
						return true;
					}
				}

				return false;
			},
			defineProperty(target, property, descriptor): boolean {
				if (!descriptor.value) {
					Object.defineProperty(target, property, descriptor);
					return true;
				}

				const index = Number(descriptor.value);
				if (isNaN(index)) {
					Object.defineProperty(target, property, descriptor);
					return true;
				}

				return false;
			},
			getOwnPropertyDescriptor(target, property): PropertyDescriptor {
				if (property in target) {
					return Object.getOwnPropertyDescriptor(target, property);
				}

				const items = target[PropertySymbol.getFormControlItems]();
				const index = Number(property);

				if (!isNaN(index) && index >= 0 && index < items.length) {
					return {
						value: items[index],
						writable: false,
						enumerable: true,
						configurable: true
					};
				}

				for (let i = 0; i < items.length; i++) {
					const item = items[i];
					const name =
						item[PropertySymbol.attributes][PropertySymbol.namedItems].get('id')?.[
							PropertySymbol.value
						] ||
						item[PropertySymbol.attributes][PropertySymbol.namedItems].get('name')?.[
							PropertySymbol.value
						];

					if (name && name === property) {
						return {
							value: item,
							writable: false,
							enumerable: true,
							configurable: true
						};
					}
				}
			}
		});
		this[PropertySymbol.proxy] = proxy;
		this[PropertySymbol.formNode] = proxy;
		return proxy;
	}

	/**
	 * Returns elements.
	 *
	 * @returns Elements.
	 */
	public get elements(): HTMLFormControlsCollection {
		if (!this[PropertySymbol.elements]) {
			this[PropertySymbol.elements] = new HTMLFormControlsCollection(this);
		}
		return this[PropertySymbol.elements];
	}

	/**
	 * Returns length.
	 *
	 * @returns Length.
	 */
	public get length(): number {
		return this[PropertySymbol.getFormControlItems]().length;
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
			const event = new SubmitEvent('submit', {
				bubbles: true,
				cancelable: true,
				submitter: submitter || this[PropertySymbol.proxy]
			});

			this.dispatchEvent(event);

			if (!event.defaultPrevented) {
				this.#submit(submitter);
			}
		}
	}

	/**
	 * Resets form.
	 */
	public reset(): void {
		for (const element of this[PropertySymbol.getFormControlItems]()) {
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

		for (const element of this[PropertySymbol.getFormControlItems]()) {
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
	 * Returns form control items.
	 *
	 * @returns Form control items.
	 */
	public [PropertySymbol.getFormControlItems](): THTMLFormControlElement[] {
		const elements = <THTMLFormControlElement[]>(
			QuerySelector.querySelectorAll(this, 'input,select,textarea,button,fieldset')[
				PropertySymbol.items
			].slice()
		);

		if (this[PropertySymbol.isConnected]) {
			const id =
				this[PropertySymbol.attributes][PropertySymbol.namedItems].get('id')?.[
					PropertySymbol.value
				];
			if (id) {
				for (const element of <THTMLFormControlElement[]>(
					QuerySelector.querySelectorAll(
						this[PropertySymbol.ownerDocument],
						`input[form="${id}"],select[form="${id}"],textarea[form="${id}"],button[form="${id}"],fieldset[form="${id}"]`
					)[PropertySymbol.items]
				)) {
					if (!elements.includes(element)) {
						elements.push(element);
					}
				}
			}
		}

		return elements;
	}

	/**
	 * Returns form control named item.
	 *
	 * @param name
	 * @returns Form control named item.
	 */
	public [PropertySymbol.getFormControlNamedItem](
		name: string
	): THTMLFormControlElement | RadioNodeList | null {
		const items = this[PropertySymbol.getFormControlItems]();
		const namedItems = [];

		name = String(name);

		for (const item of items) {
			if (
				item[PropertySymbol.attributes][PropertySymbol.namedItems].get('id')?.[
					PropertySymbol.value
				] === name ||
				item[PropertySymbol.attributes][PropertySymbol.namedItems].get('name')?.[
					PropertySymbol.value
				] === name
			) {
				namedItems.push(item);
			}
		}

		if (!namedItems.length) {
			return null;
		}

		if (namedItems.length === 1) {
			return namedItems[0];
		}

		return new RadioNodeList(namedItems);
	}

	/**
	 * Submits form.
	 *
	 * @param browserFrame Browser frame. Injected by the constructor.
	 * @param [submitter] Submitter.
	 */
	#submit(submitter?: HTMLInputElement | HTMLButtonElement): void {
		const action = submitter?.hasAttribute('formaction')
			? submitter?.formAction || this.action
			: this.action;
		const browserFrame = this.#browserFrame;

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
				targetFrame = browserFrame;
				break;
			case '_top':
				targetFrame = browserFrame.page.mainFrame;
				break;
			case '_parent':
				targetFrame = browserFrame.parentFrame ?? browserFrame;
				break;
			case '_blank':
				const newPage = browserFrame.page.context.newPage();
				targetFrame = newPage.mainFrame;
				targetFrame[PropertySymbol.openerFrame] = browserFrame;
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
					referrer: browserFrame.page.mainFrame.window.location.origin
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
				referrer: browserFrame.page.mainFrame.window.location.origin
			}
		});
	}
}
