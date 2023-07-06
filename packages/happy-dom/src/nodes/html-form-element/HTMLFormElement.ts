import HTMLElement from '../html-element/HTMLElement.js';
import IHTMLFormElement from './IHTMLFormElement.js';
import Event from '../../event/Event.js';
import SubmitEvent from '../../event/events/SubmitEvent.js';
import HTMLFormControlsCollection from './HTMLFormControlsCollection.js';
import IHTMLFormControlsCollection from './IHTMLFormControlsCollection.js';
import INode from '../node/INode.js';
import IHTMLInputElement from '../html-input-element/IHTMLInputElement.js';
import IHTMLTextAreaElement from '../html-text-area-element/IHTMLTextAreaElement.js';
import IHTMLSelectElement from '../html-select-element/IHTMLSelectElement.js';
import IHTMLButtonElement from '../html-button-element/IHTMLButtonElement.js';

/**
 * HTML Form Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement.
 */
export default class HTMLFormElement extends HTMLElement implements IHTMLFormElement {
	// Public properties.
	public readonly elements: IHTMLFormControlsCollection = new HTMLFormControlsCollection();
	public readonly length = 0;

	// Events
	public onformdata: (event: Event) => void | null = null;
	public onreset: (event: Event) => void | null = null;
	public onsubmit: (event: Event) => void | null = null;

	// Private properties
	public _formNode: INode = this;

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
		return this.getAttribute('action') || '';
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
	 *
	 * In Happy DOM this means that nothing happens.
	 */
	public submit(): void {}

	/**
	 * Submits form, reports validity and raises submit event.
	 *
	 * @param [submitter] Submitter.
	 */
	public requestSubmit(submitter?: IHTMLInputElement | IHTMLButtonElement): void {
		const noValidate = submitter?.formNoValidate || this.noValidate;
		if (noValidate || this.checkValidity()) {
			this.dispatchEvent(
				new SubmitEvent('submit', { bubbles: true, cancelable: true, submitter: submitter || this })
			);
		}
	}

	/**
	 * Resets form.
	 */
	public reset(): void {
		for (const element of this.elements) {
			if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
				element['_value'] = null;
				element['_checked'] = null;
			} else if (element.tagName === 'TEXTAREA') {
				element['_value'] = null;
			} else if (element.tagName === 'SELECT') {
				let hasSelectedAttribute = false;
				for (const option of (<IHTMLSelectElement>element).options) {
					if (option.hasAttribute('selected')) {
						hasSelectedAttribute = true;
						option.selected = true;
						break;
					}
				}
				if (!hasSelectedAttribute && (<IHTMLSelectElement>element).options.length > 0) {
					(<IHTMLSelectElement>element).options[0].selected = true;
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

		for (const element of this.elements) {
			if (element.tagName === 'INPUT' && element.type === 'radio' && element.name) {
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
	 * Clones a node.
	 *
	 * @override
	 * @param [deep=false] "true" to clone deep.
	 * @returns Cloned node.
	 */
	public cloneNode(deep = false): IHTMLFormElement {
		return <IHTMLFormElement>super.cloneNode(deep);
	}

	/**
	 * Appends a form control item.
	 *
	 * @param node Node.
	 * @param name Name
	 */
	public _appendFormControlItem(
		node: IHTMLInputElement | IHTMLTextAreaElement | IHTMLSelectElement | IHTMLButtonElement,
		name: string
	): void {
		if (!this.elements.includes(node)) {
			this[this.elements.length] = node;
			this.elements.push(node);
			(<number>this.length) = this.elements.length;
		}

		(<HTMLFormControlsCollection>this.elements)._appendNamedItem(node, name);
		this[name] = this.elements[name];
	}

	/**
	 * Remove a form control item.
	 *
	 * @param node Node.
	 * @param name Name.
	 */
	public _removeFormControlItem(
		node: IHTMLInputElement | IHTMLTextAreaElement | IHTMLSelectElement | IHTMLButtonElement,
		name: string
	): void {
		const index = this.elements.indexOf(node);

		if (index !== -1) {
			this.elements.splice(index, 1);
			for (let i = index; i < this.length; i++) {
				this[i] = this[i + 1];
			}
			delete this[this.length - 1];
			(<number>this.length)--;
		}

		(<HTMLFormControlsCollection>this.elements)._removeNamedItem(node, name);

		if (this.elements[name]) {
			this[name] = this.elements[name];
		} else {
			delete this[name];
		}
	}
}
