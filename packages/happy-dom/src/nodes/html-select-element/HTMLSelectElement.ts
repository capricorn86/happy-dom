import HTMLElement from '../html-element/HTMLElement';
import IHTMLElement from '../html-element/IHTMLElement';
import IHTMLFormElement from '../html-form-element/IHTMLFormElement';
import ValidityState from '../validity-state/ValidityState';
import IHTMLLabelElement from '../html-label-element/IHTMLLabelElement';
import HTMLOptionElement from '../html-option-element/HTMLOptionElement';
import HTMLOptionsCollection from './HTMLOptionsCollection';
import INodeList from '../node/INodeList';
import IHTMLSelectElement from './IHTMLSelectElement';
import Event from '../../event/Event';
import IHTMLOptionElement from '../html-option-element/IHTMLOptionElement';
import IHTMLOptGroupElement from '../html-opt-group-element/IHTMLOptGroupElement';
import IHTMLOptionsCollection from '../html-option-element/IHTMLOptionsCollection';
import INode from '../node/INode';
import NodeTypeEnum from '../node/NodeTypeEnum';
import HTMLCollection from '../element/HTMLCollection';
import HTMLFormElement from '../html-form-element/HTMLFormElement';
import IAttr from '../attr/IAttr';
import IElement from '../element/IElement';

/**
 * HTML Select Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement.
 */
export default class HTMLSelectElement extends HTMLElement implements IHTMLSelectElement {
	// Public properties.
	public labels: INodeList<IHTMLLabelElement>;
	public readonly length = 0;
	public readonly options: IHTMLOptionsCollection = new HTMLOptionsCollection(this);
	public readonly validationMessage = '';
	public readonly validity = new ValidityState(this);

	// Private properties
	public _selectNode: INode = this;

	// Events
	public onchange: (event: Event) => void | null = null;
	public oninput: (event: Event) => void | null = null;

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
	 * Returns multiple.
	 *
	 * @returns Multiple.
	 */
	public get multiple(): boolean {
		return this.getAttributeNS(null, 'multiple') !== null;
	}

	/**
	 * Sets multiple.
	 *
	 * @param multiple Multiple.
	 */
	public set multiple(multiple: boolean) {
		if (!multiple) {
			this.removeAttributeNS(null, 'multiple');
		} else {
			this.setAttributeNS(null, 'multiple', '');
		}
	}

	/**
	 * Returns autofocus.
	 *
	 * @returns Autofocus.
	 */
	public get autofocus(): boolean {
		return this.getAttributeNS(null, 'autofocus') !== null;
	}

	/**
	 * Sets autofocus.
	 *
	 * @param autofocus Autofocus.
	 */
	public set autofocus(autofocus: boolean) {
		if (!autofocus) {
			this.removeAttributeNS(null, 'autofocus');
		} else {
			this.setAttributeNS(null, 'autofocus', '');
		}
	}

	/**
	 * Returns required.
	 *
	 * @returns Required.
	 */
	public get required(): boolean {
		return this.getAttributeNS(null, 'required') !== null;
	}

	/**
	 * Sets required.
	 *
	 * @param required Required.
	 */
	public set required(required: boolean) {
		if (!required) {
			this.removeAttributeNS(null, 'required');
		} else {
			this.setAttributeNS(null, 'required', '');
		}
	}

	/**
	 * Returns type.
	 *
	 * @returns type.
	 */
	public get type(): string {
		return this.hasAttributeNS(null, 'multiple') ? 'select-multiple' : 'select-one';
	}

	/**
	 * Returns value.
	 *
	 * @returns Value.
	 */
	public get value(): string {
		for (let i = 0, max = this.options.length; i < max; i++) {
			const option = <HTMLOptionElement>this.options[i];
			if (option._selectedness) {
				return option.value;
			}
		}

		return '';
	}

	/**
	 * Sets value.
	 *
	 * @param value Value.
	 */
	public set value(value: string) {
		for (let i = 0, max = this.options.length; i < max; i++) {
			const option = <HTMLOptionElement>this.options[i];
			if (option.value === value) {
				option._selectedness = true;
				option._dirtyness = true;
			} else {
				option._selectedness = false;
			}
		}
	}

	/**
	 * Returns value.
	 *
	 * @returns Value.
	 */
	public get selectedIndex(): number {
		for (let i = 0, max = this.options.length; i < max; i++) {
			if ((<HTMLOptionElement>this.options[i])._selectedness) {
				return i;
			}
		}
		return -1;
	}

	/**
	 * Sets value.
	 *
	 * @param selectedIndex Selected index.
	 */
	public set selectedIndex(selectedIndex: number) {
		if (typeof selectedIndex === 'number' && !isNaN(selectedIndex)) {
			for (let i = 0, max = this.options.length; i < max; i++) {
				(<HTMLOptionElement>this.options[i])._selectedness = false;
			}

			const selectedOption = <HTMLOptionElement>this.options[selectedIndex];
			if (selectedOption) {
				selectedOption._selectedness = true;
				selectedOption._dirtyness = true;
			}
		}
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
	 * Returns "true" if it will validate.
	 *
	 * @returns "true" if it will validate.
	 */
	public get willValidate(): boolean {
		return (
			this.type !== 'hidden' &&
			this.type !== 'reset' &&
			this.type !== 'button' &&
			!this.disabled &&
			!this['readOnly']
		);
	}

	/**
	 * Returns item from options collection by index.
	 *
	 * @param index Index.
	 */
	public item(index: number): IHTMLOptionElement | IHTMLOptGroupElement {
		return this.options.item(index);
	}

	/**
	 * Adds new option to options collection.
	 *
	 * @param element HTMLOptionElement or HTMLOptGroupElement to add.
	 * @param before HTMLOptionElement or index number.
	 */
	public add(
		element: IHTMLOptionElement | IHTMLOptGroupElement,
		before?: number | IHTMLOptionElement | IHTMLOptGroupElement
	): void {
		this.options.add(element, before);
	}

	/**
	 * Removes indexed element from collection or the select element.
	 *
	 * @param [index] Index.
	 */
	public override remove(index?: number): void {
		if (typeof index === 'number') {
			this.options.remove(index);
		} else {
			super.remove();
		}
	}

	/**
	 * Sets validation message.
	 *
	 * @param message Message.
	 */
	public setCustomValidity(message: string): void {
		(<string>this.validationMessage) = String(message);
	}

	/**
	 * Checks validity.
	 *
	 * @returns "true" if the field is valid.
	 */
	public checkValidity(): boolean {
		const valid = this.disabled || this.validity.valid;
		if (!valid) {
			this.dispatchEvent(new Event('invalid', { bubbles: true, cancelable: true }));
		}
		return valid;
	}

	/**
	 * Reports validity.
	 *
	 * @returns "true" if the field is valid.
	 */
	public reportValidity(): boolean {
		return this.checkValidity();
	}

	/**
	 * Appends option item.
	 *
	 * @param node Node.
	 */
	public _appendOptionItem(node: IHTMLOptionElement | IHTMLOptGroupElement): void {
		if (!this.options.includes(node)) {
			this.options.push(node);
			this[this.length] = node;
			(<number>this.length)++;
			this._resetOptionSelectednes();
		}
	}

	/**
	 * Appends form control item.
	 *
	 * @param node Node.
	 */
	public _removeOptionItem(node: IHTMLOptionElement | IHTMLOptGroupElement): void {
		const index = this.options.indexOf(node);

		if (index !== -1) {
			this.options.splice(index, 1);
			for (let i = index; i < this.length; i++) {
				this[i] = this[i + 1];
			}
			delete this[this.length - 1];
			(<number>this.length)--;
			this._resetOptionSelectednes();
		}
	}

	/**
	 * Resets the option selectedness.
	 *
	 * Based on:
	 * https://github.com/jsdom/jsdom/blob/master/lib/jsdom/living/nodes/HTMLSelectElement-impl.js
	 *
	 * @param [newOption] Optional new option element to be selected.
	 * @see https://html.spec.whatwg.org/multipage/form-elements.html#selectedness-setting-algorithm
	 */
	public _resetOptionSelectednes(newOption?: IHTMLOptionElement): void {
		if (this.hasAttributeNS(null, 'multiple')) {
			return;
		}

		const selected: HTMLOptionElement[] = [];

		for (let i = 0, max = this.options.length; i < max; i++) {
			if (newOption) {
				(<HTMLOptionElement>this.options[i])._selectedness = this.options[i] === newOption;
			}

			if ((<HTMLOptionElement>this.options[i])._selectedness) {
				selected.push(<HTMLOptionElement>this.options[i]);
			}
		}

		const size = this._getDisplaySize();

		if (size === 1 && !selected.length) {
			for (let i = 0, max = this.options.length; i < max; i++) {
				const option = <HTMLOptionElement>this.options[i];

				let disabled = option.hasAttributeNS(null, 'disabled');
				const parentNode = <IHTMLElement>option.parentNode;
				if (
					parentNode &&
					parentNode.nodeType === NodeTypeEnum.elementNode &&
					parentNode.tagName === 'OPTGROUP' &&
					parentNode.hasAttributeNS(null, 'disabled')
				) {
					disabled = true;
				}

				if (!disabled) {
					option._selectedness = true;
					break;
				}
			}
		} else if (selected.length >= 2) {
			for (let i = 0, max = this.options.length; i < max; i++) {
				(<HTMLOptionElement>this.options[i])._selectedness = i === selected.length - 1;
			}
		}
	}

	/**
	 * @override
	 */
	public override setAttributeNode(attribute: IAttr): IAttr {
		const replacedAttribute = super.setAttributeNode(attribute);

		if (
			attribute.name === 'name' &&
			this.parentNode &&
			(<IElement>this.parentNode).children &&
			attribute.value !== replacedAttribute.value
		) {
			if (replacedAttribute.value) {
				(<HTMLCollection<IElement>>(<IElement>this.parentNode).children)._removeNamedItem(this);
				if (this._formNode) {
					(<HTMLFormElement>this._formNode)._removeFormControlItem(this);
				}
			}
			if (attribute.value) {
				(<HTMLCollection<IElement>>(<IElement>this.parentNode).children)._appendNamedItem(this);
				if (this._formNode) {
					(<HTMLFormElement>this._formNode)._appendFormControlItem(this);
				}
			}
		}

		return replacedAttribute;
	}

	/**
	 * @override
	 */
	public override removeAttributeNode(attribute: IAttr): IAttr {
		super.removeAttributeNode(attribute);

		if (
			attribute.name === 'name' &&
			this.parentNode &&
			(<IElement>this.parentNode).children &&
			attribute.value
		) {
			(<HTMLCollection<IElement>>(<IElement>this.parentNode).children)._removeNamedItem(this);
			if (this._formNode) {
				(<HTMLFormElement>this._formNode)._removeFormControlItem(this);
			}
		}

		return attribute;
	}

	/**
	 * @override
	 */
	public override _connectToNode(parentNode: INode = null): void {
		const oldFormNode = <HTMLFormElement>this._formNode;

		super._connectToNode(parentNode);

		if (oldFormNode !== this._formNode) {
			if (oldFormNode) {
				oldFormNode._removeFormControlItem(this);
			}
			if (this._formNode) {
				(<HTMLFormElement>this._formNode)._appendFormControlItem(this);
			}
		}
	}

	/**
	 * Returns display size.
	 *
	 * @returns Display size.
	 */
	protected _getDisplaySize(): number {
		if (this.hasAttributeNS(null, 'size')) {
			const size = parseInt(this.getAttributeNS(null, 'size'));
			if (!isNaN(size) && size >= 0) {
				return size;
			}
		}
		return this.hasAttributeNS(null, 'multiple') ? 4 : 1;
	}
}
