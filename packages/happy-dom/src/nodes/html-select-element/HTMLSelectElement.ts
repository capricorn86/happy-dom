import HTMLElement from '../html-element/HTMLElement.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import IHTMLElement from '../html-element/IHTMLElement.js';
import IHTMLFormElement from '../html-form-element/IHTMLFormElement.js';
import ValidityState from '../../validity-state/ValidityState.js';
import IHTMLLabelElement from '../html-label-element/IHTMLLabelElement.js';
import HTMLOptionElement from '../html-option-element/HTMLOptionElement.js';
import HTMLOptionsCollection from './HTMLOptionsCollection.js';
import INodeList from '../node/INodeList.js';
import IHTMLSelectElement from './IHTMLSelectElement.js';
import Event from '../../event/Event.js';
import IHTMLOptionElement from '../html-option-element/IHTMLOptionElement.js';
import IHTMLOptionsCollection from './IHTMLOptionsCollection.js';
import INode from '../node/INode.js';
import NodeTypeEnum from '../node/NodeTypeEnum.js';
import HTMLFormElement from '../html-form-element/HTMLFormElement.js';
import IHTMLCollection from '../element/IHTMLCollection.js';
import HTMLLabelElementUtility from '../html-label-element/HTMLLabelElementUtility.js';
import INamedNodeMap from '../../named-node-map/INamedNodeMap.js';
import HTMLSelectElementNamedNodeMap from './HTMLSelectElementNamedNodeMap.js';

/**
 * HTML Select Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement.
 */
export default class HTMLSelectElement extends HTMLElement implements IHTMLSelectElement {
	// Internal properties.
	public override [PropertySymbol.attributes]: INamedNodeMap = new HTMLSelectElementNamedNodeMap(
		this
	);
	public [PropertySymbol.validationMessage] = '';
	public [PropertySymbol.validity] = new ValidityState(this);
	public [PropertySymbol.selectNode]: INode = this;
	public [PropertySymbol.length] = 0;
	public [PropertySymbol.options]: IHTMLOptionsCollection = new HTMLOptionsCollection(this);

	// Events
	public onchange: (event: Event) => void | null = null;
	public oninput: (event: Event) => void | null = null;

	/**
	 * Returns length.
	 *
	 * @returns Length.
	 */
	public get length(): number {
		return this[PropertySymbol.length];
	}

	/**
	 * Returns options.
	 *
	 * @returns Options.
	 */
	public get options(): IHTMLOptionsCollection {
		return this[PropertySymbol.options];
	}

	/**
	 * Returns validation message.
	 *
	 * @returns Validation message.
	 */
	public get validationMessage(): string {
		return this[PropertySymbol.validationMessage];
	}

	/**
	 * Returns validity.
	 *
	 * @returns Validity.
	 */
	public get validity(): ValidityState {
		return this[PropertySymbol.validity];
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
	 * Returns disabled.
	 *
	 * @returns Disabled.
	 */
	public get disabled(): boolean {
		return this.getAttribute('disabled') !== null;
	}

	/**
	 * Sets disabled.
	 *
	 * @param disabled Disabled.
	 */
	public set disabled(disabled: boolean) {
		if (!disabled) {
			this.removeAttribute('disabled');
		} else {
			this.setAttribute('disabled', '');
		}
	}

	/**
	 * Returns multiple.
	 *
	 * @returns Multiple.
	 */
	public get multiple(): boolean {
		return this.getAttribute('multiple') !== null;
	}

	/**
	 * Sets multiple.
	 *
	 * @param multiple Multiple.
	 */
	public set multiple(multiple: boolean) {
		if (!multiple) {
			this.removeAttribute('multiple');
		} else {
			this.setAttribute('multiple', '');
		}
	}

	/**
	 * Returns autofocus.
	 *
	 * @returns Autofocus.
	 */
	public get autofocus(): boolean {
		return this.getAttribute('autofocus') !== null;
	}

	/**
	 * Sets autofocus.
	 *
	 * @param autofocus Autofocus.
	 */
	public set autofocus(autofocus: boolean) {
		if (!autofocus) {
			this.removeAttribute('autofocus');
		} else {
			this.setAttribute('autofocus', '');
		}
	}

	/**
	 * Returns required.
	 *
	 * @returns Required.
	 */
	public get required(): boolean {
		return this.getAttribute('required') !== null;
	}

	/**
	 * Sets required.
	 *
	 * @param required Required.
	 */
	public set required(required: boolean) {
		if (!required) {
			this.removeAttribute('required');
		} else {
			this.setAttribute('required', '');
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
		for (let i = 0, max = this[PropertySymbol.options].length; i < max; i++) {
			const option = <HTMLOptionElement>this[PropertySymbol.options][i];
			if (option[PropertySymbol.selectedness]) {
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
		for (let i = 0, max = this[PropertySymbol.options].length; i < max; i++) {
			const option = <HTMLOptionElement>this[PropertySymbol.options][i];
			if (option.value === value) {
				option[PropertySymbol.selectedness] = true;
				option[PropertySymbol.dirtyness] = true;
			} else {
				option[PropertySymbol.selectedness] = false;
			}
		}
	}

	/**
	 * Returns value.
	 *
	 * @returns Value.
	 */
	public get selectedIndex(): number {
		for (let i = 0, max = this[PropertySymbol.options].length; i < max; i++) {
			if ((<HTMLOptionElement>this[PropertySymbol.options][i])[PropertySymbol.selectedness]) {
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
			for (let i = 0, max = this[PropertySymbol.options].length; i < max; i++) {
				(<HTMLOptionElement>this[PropertySymbol.options][i])[PropertySymbol.selectedness] = false;
			}

			const selectedOption = <HTMLOptionElement>this[PropertySymbol.options][selectedIndex];
			if (selectedOption) {
				selectedOption[PropertySymbol.selectedness] = true;
				selectedOption[PropertySymbol.dirtyness] = true;
			}
		}
	}

	/**
	 * Returns the associated label elements.
	 *
	 * @returns Label elements.
	 */
	public get labels(): INodeList<IHTMLLabelElement> {
		return HTMLLabelElementUtility.getAssociatedLabelElements(this);
	}

	/**
	 * Returns the parent form element.
	 *
	 * @returns Form.
	 */
	public get form(): IHTMLFormElement {
		return <IHTMLFormElement>this[PropertySymbol.formNode];
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
	public item(index: number): IHTMLOptionElement {
		return this[PropertySymbol.options].item(index);
	}

	/**
	 * Adds new option to options collection.
	 *
	 * @param element HTMLOptionElement to add.
	 * @param before HTMLOptionElement or index number.
	 */
	public add(element: IHTMLOptionElement, before?: number | IHTMLOptionElement): void {
		this[PropertySymbol.options].add(element, before);
	}

	/**
	 * Removes indexed element from collection or the select element.
	 *
	 * @param [index] Index.
	 */
	public override remove(index?: number): void {
		if (typeof index === 'number') {
			this[PropertySymbol.options].remove(index);
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
		this[PropertySymbol.validationMessage] = String(message);
	}

	/**
	 * Checks validity.
	 *
	 * @returns "true" if the field is valid.
	 */
	public checkValidity(): boolean {
		const valid = this.disabled || this[PropertySymbol.validity].valid;
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
	 * Updates option item.
	 *
	 * Based on:
	 * https://github.com/jsdom/jsdom/blob/master/lib/jsdom/living/nodes/HTMLSelectElement-impl.js
	 *
	 * @see https://html.spec.whatwg.org/multipage/form-elements.html#selectedness-setting-algorithm
	 * @param [selectedOption] Selected option.
	 */
	public [PropertySymbol.updateOptionItems](selectedOption?: IHTMLOptionElement): void {
		const optionElements = <IHTMLCollection<IHTMLOptionElement>>this.getElementsByTagName('option');

		if (optionElements.length < this[PropertySymbol.options].length) {
			this[PropertySymbol.options].splice(
				this[PropertySymbol.options].length - 1,
				this[PropertySymbol.options].length - optionElements.length
			);

			for (let i = optionElements.length - 1, max = this[PropertySymbol.length]; i < max; i++) {
				delete this[i];
			}
		}

		const isMultiple = this.hasAttributeNS(null, 'multiple');
		const selected: HTMLOptionElement[] = [];

		for (let i = 0; i < optionElements.length; i++) {
			this[PropertySymbol.options][i] = optionElements[i];
			this[i] = optionElements[i];

			if (!isMultiple) {
				if (selectedOption) {
					(<HTMLOptionElement>optionElements[i])[PropertySymbol.selectedness] =
						optionElements[i] === selectedOption;
				}

				if ((<HTMLOptionElement>optionElements[i])[PropertySymbol.selectedness]) {
					selected.push(<HTMLOptionElement>optionElements[i]);
				}
			}
		}

		(<number>this[PropertySymbol.length]) = optionElements.length;

		const size = this.#getDisplaySize();

		if (size === 1 && !selected.length) {
			for (let i = 0, max = optionElements.length; i < max; i++) {
				const option = <HTMLOptionElement>optionElements[i];

				let disabled = option.hasAttributeNS(null, 'disabled');
				const parentNode = <IHTMLElement>option[PropertySymbol.parentNode];
				if (
					parentNode &&
					parentNode[PropertySymbol.nodeType] === NodeTypeEnum.elementNode &&
					parentNode[PropertySymbol.tagName] === 'OPTGROUP' &&
					parentNode.hasAttributeNS(null, 'disabled')
				) {
					disabled = true;
				}

				if (!disabled) {
					option[PropertySymbol.selectedness] = true;
					break;
				}
			}
		} else if (selected.length >= 2) {
			for (let i = 0, max = optionElements.length; i < max; i++) {
				(<HTMLOptionElement>optionElements[i])[PropertySymbol.selectedness] =
					i === selected.length - 1;
			}
		}
	}

	/**
	 * @override
	 */
	public override [PropertySymbol.connectToNode](parentNode: INode = null): void {
		const oldFormNode = <HTMLFormElement>this[PropertySymbol.formNode];

		super[PropertySymbol.connectToNode](parentNode);

		if (oldFormNode !== this[PropertySymbol.formNode]) {
			if (oldFormNode) {
				oldFormNode[PropertySymbol.removeFormControlItem](this, this.name);
				oldFormNode[PropertySymbol.removeFormControlItem](this, this.id);
			}
			if (this[PropertySymbol.formNode]) {
				(<HTMLFormElement>this[PropertySymbol.formNode])[PropertySymbol.appendFormControlItem](
					this,
					this.name
				);
				(<HTMLFormElement>this[PropertySymbol.formNode])[PropertySymbol.appendFormControlItem](
					this,
					this.id
				);
			}
		}
	}

	/**
	 * Returns display size.
	 *
	 * @returns Display size.
	 */
	#getDisplaySize(): number {
		if (this.hasAttributeNS(null, 'size')) {
			const size = parseInt(this.getAttribute('size'));
			if (!isNaN(size) && size >= 0) {
				return size;
			}
		}
		return this.hasAttributeNS(null, 'multiple') ? 4 : 1;
	}
}
