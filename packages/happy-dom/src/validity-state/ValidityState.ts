import type HTMLButtonElement from '../nodes/html-button-element/HTMLButtonElement.js';
import * as PropertySymbol from '../PropertySymbol.js';
import type HTMLFormElement from '../nodes/html-form-element/HTMLFormElement.js';
import type HTMLInputElement from '../nodes/html-input-element/HTMLInputElement.js';
import type HTMLSelectElement from '../nodes/html-select-element/HTMLSelectElement.js';
import type HTMLTextAreaElement from '../nodes/html-text-area-element/HTMLTextAreaElement.js';
import type ShadowRoot from '../nodes/shadow-root/ShadowRoot.js';
import type HTMLObjectElement from '../nodes/html-object-element/HTMLObjectElement.js';
import type HTMLOutputElement from '../nodes/html-output-element/HTMLOutputElement.js';

const EMAIL_REGEXP =
	/^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/;
const URL_REGEXP =
	/^(?:(?:https?|HTTPS?|ftp|FTP):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-zA-Z\u00a1-\uffff0-9]-*)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]-*)*[a-zA-Z\u00a1-\uffff0-9]+)*)(?::\d{2,5})?(?:[\/?#]\S*)?$/;

/**
 * Input validity state.
 *
 * Based on:
 * https://github.com/cferdinandi/validate/blob/master/src/js/_validityState.polyfill.js
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/ValidityState
 */
export default class ValidityState {
	private element:
		| HTMLInputElement
		| HTMLTextAreaElement
		| HTMLSelectElement
		| HTMLButtonElement
		| HTMLObjectElement
		| HTMLOutputElement;

	/**
	 * Constructor.
	 *
	 * @param element Input element.
	 */
	constructor(
		element:
			| HTMLInputElement
			| HTMLTextAreaElement
			| HTMLSelectElement
			| HTMLButtonElement
			| HTMLObjectElement
			| HTMLOutputElement
	) {
		this.element = element;
	}

	/**
	 * Returns validity.
	 *
	 * @returns "true" if valid.
	 */
	public get badInput(): boolean {
		return (
			this.element[PropertySymbol.localName] === 'input' &&
			(this.element.type === 'number' || this.element.type === 'range') &&
			(<HTMLInputElement>this.element).value.length > 0 &&
			!/^[-+]?(?:\d+|\d*[.,]\d+)$/.test((<HTMLInputElement>this.element).value)
		);
	}

	/**
	 * Returns validity.
	 *
	 * @returns "true" if valid.
	 */
	public get customError(): boolean {
		return this.element[PropertySymbol.validationMessage].length > 0;
	}

	/**
	 * Returns validity.
	 *
	 * @returns "true" if valid.
	 */
	public get patternMismatch(): boolean {
		return (
			this.element[PropertySymbol.localName] === 'input' &&
			this.element.hasAttribute('pattern') &&
			(<HTMLInputElement>this.element).value.length > 0 &&
			(<HTMLInputElement>this.element).value.replace(
				new RegExp(this.element.getAttribute('pattern')!),
				''
			).length > 0
		);
	}

	/**
	 * Returns validity.
	 *
	 * @returns "true" if valid.
	 */
	public get rangeOverflow(): boolean {
		return (
			this.element[PropertySymbol.localName] === 'input' &&
			this.element.hasAttribute('max') &&
			(this.element.type === 'number' || this.element.type === 'range') &&
			(<HTMLInputElement>this.element).value.length > 0 &&
			Number((<HTMLInputElement>this.element).value) > Number(this.element.getAttribute('max'))
		);
	}

	/**
	 * Returns validity.
	 *
	 * @returns "true" if valid.
	 */
	public get rangeUnderflow(): boolean {
		return (
			this.element[PropertySymbol.localName] === 'input' &&
			this.element.hasAttribute('min') &&
			(this.element.type === 'number' || this.element.type === 'range') &&
			(<HTMLInputElement>this.element).value.length > 0 &&
			Number((<HTMLInputElement>this.element).value) < Number(this.element.getAttribute('min'))
		);
	}

	/**
	 * Returns validity.
	 *
	 * @returns "true" if valid.
	 */
	public get stepMismatch(): boolean {
		return (
			this.element[PropertySymbol.localName] === 'input' &&
			(this.element.type === 'number' || this.element.type === 'range') &&
			((this.element.hasAttribute('step') &&
				this.element.getAttribute('step') !== 'any' &&
				Number((<HTMLInputElement>this.element).value) %
					Number(this.element.getAttribute('step')) !==
					0) ||
				(!this.element.hasAttribute('step') &&
					Number((<HTMLInputElement>this.element).value) % 1 !== 0))
		);
	}

	/**
	 * Returns validity.
	 *
	 * @returns "true" if valid.
	 */
	public get tooLong(): boolean {
		return (
			(this.element[PropertySymbol.localName] === 'input' ||
				this.element[PropertySymbol.localName] === 'textarea') &&
			(<HTMLInputElement>this.element).maxLength > 0 &&
			(<HTMLInputElement>this.element).value.length > (<HTMLInputElement>this.element).maxLength
		);
	}

	/**
	 * Returns validity.
	 *
	 * @returns "true" if valid.
	 */
	public get tooShort(): boolean {
		return (
			(this.element[PropertySymbol.localName] === 'input' ||
				this.element[PropertySymbol.localName] === 'textarea') &&
			(<HTMLInputElement>this.element).minLength > 0 &&
			(<HTMLInputElement>this.element).value.length > 0 &&
			(<HTMLInputElement>this.element).value.length < (<HTMLInputElement>this.element).minLength
		);
	}

	/**
	 * Returns validity.
	 *
	 * @returns "true" if valid.
	 */
	public get typeMismatch(): boolean {
		return (
			this.element[PropertySymbol.localName] === 'input' &&
			(<HTMLInputElement>this.element).value.length > 0 &&
			((this.element.type === 'email' &&
				!EMAIL_REGEXP.test((<HTMLInputElement>this.element).value)) ||
				(this.element.type === 'url' && !URL_REGEXP.test((<HTMLInputElement>this.element).value)))
		);
	}

	/**
	 * Returns validity.
	 *
	 * @returns "true" if valid.
	 */
	public get valueMissing(): boolean {
		if (
			!(<HTMLInputElement>this.element).required ||
			this.element[PropertySymbol.localName] === 'object' ||
			this.element[PropertySymbol.localName] === 'output'
		) {
			return false;
		}
		if (this.element[PropertySymbol.localName] === 'input') {
			if (this.element.type === 'checkbox') {
				return !(<HTMLInputElement>this.element).checked;
			} else if (this.element.type === 'radio') {
				if ((<HTMLInputElement>this.element).checked) {
					return false;
				}
				if (!this.element.name) {
					return true;
				}
				const root =
					<HTMLFormElement>this.element[PropertySymbol.formNode] ||
					<ShadowRoot>this.element.getRootNode();
				return !root || !root.querySelector(`input[name="${this.element.name}"]:checked`);
			}
		}
		return (<HTMLInputElement>this.element).value.length === 0;
	}

	/**
	 * Returns validity.
	 *
	 * @returns "true" if valid.
	 */
	public get valid(): boolean {
		return (
			!this.badInput &&
			!this.customError &&
			!this.patternMismatch &&
			!this.rangeOverflow &&
			!this.rangeUnderflow &&
			!this.stepMismatch &&
			!this.tooLong &&
			!this.tooShort &&
			!this.typeMismatch &&
			!this.valueMissing
		);
	}
}
