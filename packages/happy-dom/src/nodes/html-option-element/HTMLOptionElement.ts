import IAttr from '../attr/IAttr';
import HTMLElement from '../html-element/HTMLElement';
import IHTMLFormElement from '../html-form-element/IHTMLFormElement';
import HTMLSelectElement from '../html-select-element/HTMLSelectElement';
import INode from '../node/INode';
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
		return <IHTMLFormElement>this._formNode;
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
		const selectNode = <HTMLSelectElement>this._selectNode;

		this._dirtyness = true;
		this._selectedness = Boolean(selected);

		if (selectNode) {
			selectNode._resetOptionSelectednes(this._selectedness ? this : null);
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
			const selectNode = <HTMLSelectElement>this._selectNode;

			this._selectedness = true;

			if (selectNode) {
				selectNode._resetOptionSelectednes(this);
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
			const selectNode = <HTMLSelectElement>this._selectNode;

			this._selectedness = false;

			if (selectNode) {
				selectNode._resetOptionSelectednes();
			}
		}

		return attribute;
	}

	/**
	 * @override
	 */
	public override _connectToNode(parentNode: INode = null): void {
		const oldSelectNode = <HTMLSelectElement>this._selectNode;

		super._connectToNode(parentNode);

		if (oldSelectNode !== this._selectNode) {
			if (oldSelectNode) {
				oldSelectNode._removeOptionItem(this);
			}
			if (this._selectNode) {
				(<HTMLSelectElement>this._selectNode)._appendOptionItem(this);
			}
		}
	}
}
