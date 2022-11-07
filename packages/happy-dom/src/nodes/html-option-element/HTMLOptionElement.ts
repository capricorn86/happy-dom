import IAttr from '../attr/IAttr';
import HTMLElement from '../html-element/HTMLElement';
import IHTMLElement from '../html-element/IHTMLElement';
import IHTMLFormElement from '../html-form-element/IHTMLFormElement';
import HTMLSelectElement from '../html-select-element/HTMLSelectElement';
import IHTMLOptionElement from './IHTMLOptionElement';

/**
 * HTML Option Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLOptionElement.
 */
export default class HTMLOptionElement extends HTMLElement implements IHTMLOptionElement {
	public _index: number;
	public _selectedness = false;
	public _dirtyness = false;

	/**
	 * Returns inner text, which is the rendered appearance of text.
	 *
	 * @returns Inner text.
	 */
	public get text(): string {
		return this.innerText;
	}

	/**
	 * Sets the inner text, which is the rendered appearance of text.
	 *
	 * @param innerText Inner text.
	 */
	public set text(text: string) {
		this.innerText = text;
	}

	/**
	 * Returns index.
	 *
	 * @returns Index.
	 */
	public get index(): number {
		return this._index;
	}

	/**
	 * Returns the parent form element.
	 *
	 * @returns Form.
	 */
	public get form(): IHTMLFormElement {
		let parent = <IHTMLElement>this.parentNode;
		while (parent && parent.tagName !== 'FORM') {
			parent = <IHTMLElement>parent.parentNode;
		}
		return <IHTMLFormElement>parent;
	}

	/**
	 * Returns selected.
	 *
	 * @returns Selected.
	 */
	public get selected(): boolean {
		return this._selectedness;
	}

	/**
	 * Sets selected.
	 *
	 * @param selected Selected.
	 */
	public set selected(selected: boolean) {
		const selectElement = this._getSelectElement();

		this._dirtyness = true;
		this._selectedness = Boolean(selected);

		if (selectElement) {
			selectElement._resetOptionSelectednes(this._selectedness ? this : null);
		}
	}

	/**
	 * Returns disabled.
	 *
	 * @returns Disabled.
	 */
	public get disabled(): boolean {
		return this.getAttributeNS(null, 'disabled') !== null;
	}

	/**
	 * Sets disabled.
	 *
	 * @param disabled Disabled.
	 */
	public set disabled(disabled: boolean) {
		if (!disabled) {
			this.removeAttributeNS(null, 'disabled');
		} else {
			this.setAttributeNS(null, 'disabled', '');
		}
	}

	/**
	 * Returns value.
	 *
	 * @returns Value.
	 */
	public get value(): string {
		return this.getAttributeNS(null, 'value') || this.textContent;
	}

	/**
	 * Sets value.
	 *
	 * @param value Value.
	 */
	public set value(value: string) {
		this.setAttributeNS(null, 'value', value);
	}

	/**
	 * @override
	 */
	public setAttributeNode(attribute: IAttr): IAttr {
		const replacedAttribute = super.setAttributeNode(attribute);

		if (
			!this._dirtyness &&
			attribute.name === 'selected' &&
			replacedAttribute?.value !== attribute.value
		) {
			const selectElement = this._getSelectElement();

			this._selectedness = true;

			if (selectElement) {
				selectElement._resetOptionSelectednes(this);
			}
		}

		return replacedAttribute;
	}

	/**
	 * @override
	 */
	public removeAttributeNode(attribute: IAttr): IAttr {
		super.removeAttributeNode(attribute);

		if (!this._dirtyness && attribute.name === 'selected') {
			const selectElement = this._getSelectElement();

			this._selectedness = false;

			if (selectElement) {
				selectElement._resetOptionSelectednes();
			}
		}

		return attribute;
	}

	/**
	 * Returns select element.
	 *
	 * @returns Select element.
	 */
	private _getSelectElement(): HTMLSelectElement {
		const parentNode = <HTMLSelectElement>this.parentNode;
		if (parentNode?.tagName === 'SELECT') {
			return <HTMLSelectElement>parentNode;
		}
		if ((<HTMLSelectElement>parentNode?.parentNode)?.tagName === 'SELECT') {
			return <HTMLSelectElement>parentNode.parentNode;
		}
	}
}
