import HTMLElement from '../html-element/HTMLElement.js';
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
	public override readonly attributes: INamedNodeMap = new HTMLSelectElementNamedNodeMap(this);

	// Public properties.
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
	public item(index: number): IHTMLOptionElement {
		return this.options.item(index);
	}

	/**
	 * Adds new option to options collection.
	 *
	 * @param element HTMLOptionElement to add.
	 * @param before HTMLOptionElement or index number.
	 */
	public add(element: IHTMLOptionElement, before?: number | IHTMLOptionElement): void {
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
	 * Updates option item.
	 *
	 * Based on:
	 * https://github.com/jsdom/jsdom/blob/master/lib/jsdom/living/nodes/HTMLSelectElement-impl.js
	 *
	 * @see https://html.spec.whatwg.org/multipage/form-elements.html#selectedness-setting-algorithm
	 * @param [selectedOption] Selected option.
	 */
	public _updateOptionItems(selectedOption?: IHTMLOptionElement): void {
		const optionElements = <IHTMLCollection<IHTMLOptionElement>>this.getElementsByTagName('option');

		if (optionElements.length < this.options.length) {
			this.options.splice(this.options.length - 1, this.options.length - optionElements.length);

			for (let i = optionElements.length - 1, max = this.length; i < max; i++) {
				delete this[i];
			}
		}

		const isMultiple = this.hasAttributeNS(null, 'multiple');
		const selected: HTMLOptionElement[] = [];

		for (let i = 0; i < optionElements.length; i++) {
			this.options[i] = optionElements[i];
			this[i] = optionElements[i];

			if (!isMultiple) {
				if (selectedOption) {
					(<HTMLOptionElement>optionElements[i])._selectedness =
						optionElements[i] === selectedOption;
				}

				if ((<HTMLOptionElement>optionElements[i])._selectedness) {
					selected.push(<HTMLOptionElement>optionElements[i]);
				}
			}
		}

		(<number>this.length) = optionElements.length;

		const size = this._getDisplaySize();

		if (size === 1 && !selected.length) {
			for (let i = 0, max = optionElements.length; i < max; i++) {
				const option = <HTMLOptionElement>optionElements[i];

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
			for (let i = 0, max = optionElements.length; i < max; i++) {
				(<HTMLOptionElement>optionElements[i])._selectedness = i === selected.length - 1;
			}
		}
	}

	/**
	 * @override
	 */
	public override _connectToNode(parentNode: INode = null): void {
		const oldFormNode = <HTMLFormElement>this._formNode;

		super._connectToNode(parentNode);

		if (oldFormNode !== this._formNode) {
			if (oldFormNode) {
				oldFormNode._removeFormControlItem(this, this.name);
				oldFormNode._removeFormControlItem(this, this.id);
			}
			if (this._formNode) {
				(<HTMLFormElement>this._formNode)._appendFormControlItem(this, this.name);
				(<HTMLFormElement>this._formNode)._appendFormControlItem(this, this.id);
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
			const size = parseInt(this.getAttribute('size'));
			if (!isNaN(size) && size >= 0) {
				return size;
			}
		}
		return this.hasAttributeNS(null, 'multiple') ? 4 : 1;
	}
}
