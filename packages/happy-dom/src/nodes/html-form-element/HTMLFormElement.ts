import HTMLElement from '../html-element/HTMLElement.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import Event from '../../event/Event.js';
import SubmitEvent from '../../event/events/SubmitEvent.js';
import HTMLFormControlsCollection from './HTMLFormControlsCollection.js';
import Node from '../node/Node.js';
import HTMLInputElement from '../html-input-element/HTMLInputElement.js';
import HTMLTextAreaElement from '../html-text-area-element/HTMLTextAreaElement.js';
import HTMLSelectElement from '../html-select-element/HTMLSelectElement.js';
import HTMLButtonElement from '../html-button-element/HTMLButtonElement.js';
import IBrowserFrame from '../../browser/types/IBrowserFrame.js';
import BrowserFrameNavigator from '../../browser/utilities/BrowserFrameNavigator.js';
import FormData from '../../form-data/FormData.js';
import Element from '../element/Element.js';
import BrowserWindow from '../../window/BrowserWindow.js';

/**
 * HTML Form Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement.
 */
export default class HTMLFormElement extends HTMLElement {
	// Public properties
	public cloneNode: (deep?: boolean) => HTMLFormElement;

	// Internal properties.
	public [PropertySymbol.elements]: HTMLFormControlsCollection = new HTMLFormControlsCollection();
	public [PropertySymbol.length] = 0;
	public [PropertySymbol.formNode]: Node = this;

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
		return this[PropertySymbol.length];
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
	 * Appends a form control item.
	 *
	 * @param node Node.
	 * @param name Name
	 */
	public [PropertySymbol.appendFormControlItem](
		node: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | HTMLButtonElement,
		name: string
	): void {
		const elements = this[PropertySymbol.elements];

		if (!elements.includes(node)) {
			this[elements.length] = node;
			elements.push(node);
			this[PropertySymbol.length] = elements.length;
		}

		(<HTMLFormControlsCollection>elements)[PropertySymbol.appendNamedItem](node, name);

		if (this[PropertySymbol.isValidPropertyName](name)) {
			this[name] = elements[name];
		}
	}

	/**
	 * Remove a form control item.
	 *
	 * @param node Node.
	 * @param name Name.
	 */
	public [PropertySymbol.removeFormControlItem](
		node: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | HTMLButtonElement,
		name: string
	): void {
		const elements = this[PropertySymbol.elements];
		const index = elements.indexOf(node);

		if (index !== -1) {
			elements.splice(index, 1);
			for (let i = index; i < this[PropertySymbol.length]; i++) {
				this[i] = this[i + 1];
			}
			delete this[this[PropertySymbol.length] - 1];
			this[PropertySymbol.length]--;
		}

		(<HTMLFormControlsCollection>elements)[PropertySymbol.removeNamedItem](node, name);

		if (this[PropertySymbol.isValidPropertyName](name)) {
			if (elements[name]) {
				this[name] = elements[name];
			} else {
				delete this[name];
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
}
