import * as PropertySymbol from '../PropertySymbol.js';
import type HTMLElement from '../nodes/html-element/HTMLElement.js';
import type HTMLFormElement from '../nodes/html-form-element/HTMLFormElement.js';
import type NodeList from '../nodes/node/NodeList.js';
import type HTMLLabelElement from '../nodes/html-label-element/HTMLLabelElement.js';
import HTMLLabelElementUtility from '../nodes/html-label-element/HTMLLabelElementUtility.js';
import type File from '../file/File.js';
import type FormData from '../form-data/FormData.js';
import type IValidityState from '../validity-state/IValidityState.js';
import type IValidityStateFlags from '../validity-state/IValidityStateFlags.js';

/**
 * ElementInternals gives a form-associated custom element (one whose class declares
 * `static formAssociated = true`) the hooks a built-in form control gets for free:
 * a submission value, form ownership, and constraint-validation reporting.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals
 */
export default class ElementInternals {
	#element: HTMLElement;
	#validityFlags: IValidityStateFlags = {};
	#validityMessage = '';

	/**
	 * Constructor.
	 *
	 * @param element The form-associated custom element this instance belongs to.
	 */
	constructor(element: HTMLElement) {
		this.#element = element;
	}

	/**
	 * Returns the form this element is associated with. A `form` attribute, when present, wins
	 * over any ancestor `<form>` (per the WHATWG form-owner algorithm); without it the nearest
	 * ancestor `<form>` is used.
	 *
	 * @returns Form.
	 */
	public get form(): HTMLFormElement | null {
		const id = this.#element.getAttribute('form');
		if (id) {
			if (!this.#element[PropertySymbol.isConnected]) {
				return null;
			}
			const form = this.#element[PropertySymbol.ownerDocument].getElementById(id);
			return form?.[PropertySymbol.tagName] === 'FORM' ? <HTMLFormElement>form : null;
		}
		return this.#element[PropertySymbol.formNode] ?? null;
	}

	/**
	 * Returns the labels associated with this element, resolved the same way built-in form
	 * controls resolve theirs.
	 *
	 * @returns Labels.
	 */
	public get labels(): NodeList<HTMLLabelElement> {
		return HTMLLabelElementUtility.getAssociatedLabelElements(this.#element);
	}

	/**
	 * Returns whether this element participates in constraint validation. A form-associated
	 * custom element has no `disabled` IDL property, so the `disabled` attribute is the signal.
	 *
	 * @returns "true" if the element will validate.
	 */
	public get willValidate(): boolean {
		return !this.#element.hasAttribute('disabled');
	}

	/**
	 * Returns the validity flags last set via setValidity().
	 *
	 * @returns Validity state.
	 */
	public get validity(): IValidityState {
		const flags = this.#validityFlags;
		return {
			badInput: flags.badInput ?? false,
			customError: flags.customError ?? false,
			patternMismatch: flags.patternMismatch ?? false,
			rangeOverflow: flags.rangeOverflow ?? false,
			rangeUnderflow: flags.rangeUnderflow ?? false,
			stepMismatch: flags.stepMismatch ?? false,
			tooLong: flags.tooLong ?? false,
			tooShort: flags.tooShort ?? false,
			typeMismatch: flags.typeMismatch ?? false,
			valueMissing: flags.valueMissing ?? false,
			valid: !Object.values(flags).some(Boolean)
		};
	}

	/**
	 * Returns the validation message last set via setValidity(), or an empty string if valid.
	 *
	 * @returns Validation message.
	 */
	public get validationMessage(): string {
		return this.validity.valid ? '' : this.#validityMessage;
	}

	/**
	 * Sets the element's submission value and, optionally, its state for form-navigation
	 * restore. Only the submission value is used by happy-dom today (FormData construction) -
	 * `state` is accepted for API compatibility but not yet persisted/restored.
	 *
	 * @param value Submission value. `null` means "not submitted".
	 */
	public setFormValue(value: File | string | FormData | null): void {
		this.#element[PropertySymbol.internalsFormValue] = value;
	}

	/**
	 * Sets the element's constraint-validation flags and message.
	 *
	 * @param flags Validity flags (e.g. `{ customError: true }`). An empty object marks it valid.
	 * @param [message] Validation message, required when any flag is `true`.
	 */
	public setValidity(flags: IValidityStateFlags, message?: string): void {
		this.#validityFlags = { ...flags };
		this.#validityMessage = message || '';
	}

	/**
	 * Returns whether the element currently satisfies its constraints.
	 *
	 * @returns "true" if valid.
	 */
	public checkValidity(): boolean {
		return this.validity.valid;
	}

	/**
	 * Same as checkValidity() - happy-dom doesn't render a native validation bubble, so there's
	 * no extra UI step to perform here.
	 *
	 * @returns "true" if valid.
	 */
	public reportValidity(): boolean {
		return this.checkValidity();
	}
}
