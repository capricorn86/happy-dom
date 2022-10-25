import HTMLElement from '../html-element/HTMLElement';
import IHTMLElement from '../html-element/IHTMLElement';
import IHTMLFormElement from '../html-form-element/IHTMLFormElement';
import ValidityState from '../validity-state/ValidityState';
import IHTMLLabelElement from '../html-label-element/IHTMLLabelElement';
import HTMLOptionElement from '../html-option-element/HTMLOptionElement';
import HTMLOptionsCollection from '../html-option-element/HTMLOptionsCollection';
import INodeList from '../node/INodeList';
import IHTMLSelectElement from './IHTMLSelectElement';
import Event from '../../event/Event';
import IHTMLOptionElement from '../html-option-element/IHTMLOptionElement';
import IHTMLOptGroupElement from '../html-opt-group-element/IHTMLOptGroupElement';
import IHTMLOptionsCollection from '../html-option-element/IHTMLOptionsCollection';
import INode from '../node/INode';
import NodeTypeEnum from '../node/NodeTypeEnum';

/**
 * HTML Select Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement.
 */
export default class HTMLSelectElement extends HTMLElement implements IHTMLSelectElement {
	public labels: INodeList<IHTMLLabelElement>;
	public readonly options: IHTMLOptionsCollection = new HTMLOptionsCollection(this);

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
	 * Returns length.
	 *
	 * @returns length.
	 */
	public get length(): number {
		return this.options.length;
	}

	/**
	 * Sets length.
	 *
	 * @param length Length.
	 */
	public set length(length: number) {
		this.options.length = length;
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
		let parent = <IHTMLElement>this.parentNode;
		while (parent && parent.tagName !== 'FORM') {
			parent = <IHTMLElement>parent.parentNode;
		}
		return <IHTMLFormElement>parent;
	}

	/**
	 * Returns validity state.
	 *
	 * @returns Validity state.
	 */
	public get validity(): ValidityState {
		return new ValidityState(this);
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
	 * @override
	 */
	public override appendChild(node: INode): INode {
		if (node.nodeType === NodeTypeEnum.elementNode) {
			const element = <IHTMLElement>node;
			const previousLength = this.options.length;

			if (element.tagName === 'OPTION' || element.tagName === 'OPTGROUP') {
				this.options.push(<IHTMLOptionElement | IHTMLOptGroupElement>element);
			}

			this._updateIndexProperties(previousLength, this.options.length);
			this._resetOptionSelectednes();
		}

		return super.appendChild(node);
	}

	/**
	 * @override
	 */
	public override insertBefore(newNode: INode, referenceNode: INode | null): INode {
		const returnValue = super.insertBefore(newNode, referenceNode);

		if (
			newNode.nodeType === NodeTypeEnum.elementNode &&
			referenceNode?.nodeType === NodeTypeEnum.elementNode
		) {
			const newElement = <IHTMLElement>newNode;
			const previousLength = this.options.length;

			if (newElement.tagName === 'OPTION' || newElement.tagName === 'OPTGROUP') {
				const referenceElement = <IHTMLElement>referenceNode;

				if (
					referenceElement &&
					(referenceElement.tagName === 'OPTION' || referenceElement.tagName === 'OPTGROUP')
				) {
					const referenceIndex = this.options.indexOf(
						<IHTMLOptGroupElement | IHTMLOptionElement>referenceElement
					);
					if (referenceIndex !== -1) {
						this.options.splice(
							referenceIndex,
							0,
							<IHTMLOptionElement | IHTMLOptGroupElement>newElement
						);
					}
				} else {
					this.options.push(<IHTMLOptionElement | IHTMLOptGroupElement>newElement);
				}
			}

			this._updateIndexProperties(previousLength, this.options.length);
		}

		if (newNode.nodeType === NodeTypeEnum.elementNode) {
			this._resetOptionSelectednes();
		}

		return returnValue;
	}

	/**
	 * @override
	 */
	public override removeChild(node: INode): INode {
		if (node.nodeType === NodeTypeEnum.elementNode) {
			const element = <IHTMLElement>node;
			const previousLength = this.options.length;

			if (element.tagName === 'OPTION' || element.tagName === 'OPTION') {
				const index = this.options.indexOf(<IHTMLOptionElement | IHTMLOptGroupElement>node);

				if (index !== -1) {
					this.options.splice(index, 1);
				}
			}

			this._updateIndexProperties(previousLength, this.options.length);
			this._resetOptionSelectednes();
		}

		return super.removeChild(node);
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

	/**
	 * Updates index properties.
	 *
	 * @param previousLength Length before the update.
	 * @param newLength Length after the update.
	 */
	protected _updateIndexProperties(previousLength: number, newLength: number): void {
		if (previousLength > newLength) {
			for (let i = newLength; i < previousLength; i++) {
				if (this.hasOwnProperty(String(i))) {
					delete this[String(i)];
				}
			}
		} else if (previousLength < newLength) {
			for (let i = previousLength; i < newLength; i++) {
				Object.defineProperty(this, String(i), {
					get: () => {
						return this.options[i];
					},
					enumerable: true,
					configurable: true
				});
			}
		}
	}
}
