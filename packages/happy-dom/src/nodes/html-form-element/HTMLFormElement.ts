import HTMLElement from '../html-element/HTMLElement';
import IHTMLFormElement from './IHTMLFormElement';
import Event from '../../event/Event';
import HTMLFormControlsCollection from './HTMLFormControlsCollection';
import IHTMLFormControlsCollection from './IHTMLFormControlsCollection';
import INode from '../node/INode';
import IHTMLInputElement from '../html-input-element/IHTMLInputElement';
import IHTMLTextAreaElement from '../html-text-area-element/IHTMLTextAreaElement';
import RadioNodeList from './RadioNodeList';
import IHTMLSelectElement from '../html-select-element/IHTMLSelectElement';

const NAMED_ITEM_PROPERTIES = ['id', 'name'];

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
	private _namedItems: {
		[k: string]: (IHTMLInputElement | IHTMLTextAreaElement | IHTMLSelectElement)[];
	} = {};

	/**
	 * Returns name.
	 *
	 * @returns Name.
	 */
	public get name(): string {
		return this.getAttributeNS(null, 'name') || '';
	}

	/**
	 * Sets name.
	 *
	 * @param name Name.
	 */
	public set name(name: string) {
		this.setAttributeNS(null, 'name', name);
	}

	/**
	 * Returns method.
	 *
	 * @returns Method.
	 */
	public get method(): string {
		return this.getAttributeNS(null, 'method') || 'get';
	}

	/**
	 * Sets method.
	 *
	 * @param method Method.
	 */
	public set method(method: string) {
		this.setAttributeNS(null, 'method', method);
	}

	/**
	 * Returns target.
	 *
	 * @returns Target.
	 */
	public get target(): string {
		return this.getAttributeNS(null, 'target') || '';
	}

	/**
	 * Sets target.
	 *
	 * @param target Target.
	 */
	public set target(target: string) {
		this.setAttributeNS(null, 'target', target);
	}

	/**
	 * Returns action.
	 *
	 * @returns Action.
	 */
	public get action(): string {
		return this.getAttributeNS(null, 'action') || '';
	}

	/**
	 * Sets action.
	 *
	 * @param action Action.
	 */
	public set action(action: string) {
		this.setAttributeNS(null, 'action', action);
	}

	/**
	 * Returns encoding.
	 *
	 * @returns Encoding.
	 */
	public get encoding(): string {
		return this.getAttributeNS(null, 'encoding') || '';
	}

	/**
	 * Sets encoding.
	 *
	 * @param encoding Encoding.
	 */
	public set encoding(encoding: string) {
		this.setAttributeNS(null, 'encoding', encoding);
	}

	/**
	 * Returns enctype.
	 *
	 * @returns Enctype.
	 */
	public get enctype(): string {
		return this.getAttributeNS(null, 'enctype') || '';
	}

	/**
	 * Sets enctype.
	 *
	 * @param enctype Enctype.
	 */
	public set enctype(enctype: string) {
		this.setAttributeNS(null, 'enctype', enctype);
	}

	/**
	 * Returns autocomplete.
	 *
	 * @returns Autocomplete.
	 */
	public get autocomplete(): string {
		return this.getAttributeNS(null, 'autocomplete') || '';
	}

	/**
	 * Sets autocomplete.
	 *
	 * @param autocomplete Autocomplete.
	 */
	public set autocomplete(autocomplete: string) {
		this.setAttributeNS(null, 'autocomplete', autocomplete);
	}

	/**
	 * Returns accept charset.
	 *
	 * @returns Accept charset.
	 */
	public get acceptCharset(): string {
		return this.getAttributeNS(null, 'acceptcharset') || '';
	}

	/**
	 * Sets accept charset.
	 *
	 * @param acceptCharset Accept charset.
	 */
	public set acceptCharset(acceptCharset: string) {
		this.setAttributeNS(null, 'acceptcharset', acceptCharset);
	}

	/**
	 * Returns no validate.
	 *
	 * @returns No validate.
	 */
	public get noValidate(): string {
		return this.getAttributeNS(null, 'novalidate') || '';
	}

	/**
	 * Sets no validate.
	 *
	 * @param noValidate No validate.
	 */
	public set noValidate(noValidate: string) {
		this.setAttributeNS(null, 'novalidate', noValidate);
	}

	/**
	 * Submits form.
	 */
	public submit(): void {
		this.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
	}

	/**
	 * Resets form.
	 */
	public reset(): void {
		this.dispatchEvent(new Event('reset', { bubbles: true, cancelable: true }));
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
	 * Checks validity.
	 *
	 * @returns "true" if validation does'nt fail.
	 */
	public checkValidity(): boolean {
		for (const element of this.elements) {
			if (!(<IHTMLInputElement | IHTMLTextAreaElement>element).checkValidity()) {
				return false;
			}
		}
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
	 */
	public _appendFormControlItem(
		node: IHTMLInputElement | IHTMLTextAreaElement | IHTMLSelectElement
	): void {
		if (!this.elements.includes(node)) {
			this.elements.push(node);
			this[this.length] = node;
			(<number>this.length)++;
		}

		for (const property of NAMED_ITEM_PROPERTIES) {
			const name = node[property];

			if (name) {
				this._namedItems[name] = this._namedItems[name] || new RadioNodeList();

				if (!this._namedItems[name].includes(node)) {
					this._namedItems[name].push(node);
				}

				this[name] =
					this._namedItems[name].length > 1 ? this._namedItems[name] : this._namedItems[name][0];
				this.elements[name] = this[name];
			}
		}
	}

	/**
	 * Remove a form control item.
	 *
	 * @param node Node.
	 */
	public _removeFormControlItem(
		node: IHTMLInputElement | IHTMLTextAreaElement | IHTMLSelectElement | IHTMLSelectElement
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

		for (const property of NAMED_ITEM_PROPERTIES) {
			const name = node[property];

			if (name && this._namedItems[name]) {
				const index = this._namedItems[name].indexOf(node);

				if (index > -1) {
					this._namedItems[name].splice(index, 1);

					if (this._namedItems[name].length === 0) {
						delete this.elements[name];
						delete this._namedItems[name];
						delete this[name];
					}
				}
			}
		}
	}
}
