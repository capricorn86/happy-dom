import DOMException from '../../exception/DOMException';
import DOMExceptionNameEnum from '../../exception/DOMExceptionNameEnum';
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
import Node from '../node/Node';

/**
 * HTML Select Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement.
 */
export default class HTMLSelectElement extends HTMLElement implements IHTMLSelectElement {
	public labels: INodeList<IHTMLLabelElement>;
	private readonly _options: HTMLOptionsCollection;

	// Events
	public onchange: (event: Event) => void | null = null;
	public oninput: (event: Event) => void | null = null;

	/**
	 * Constructor.
	 */
	constructor() {
		super();

		this._options = new HTMLOptionsCollection();
	}

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
		if (this.options.selectedIndex === -1) {
			return '';
		}

		const option = this.options[this.options.selectedIndex];

		return option instanceof HTMLOptionElement ? option.value : '';
	}

	/**
	 * Sets value.
	 *
	 * @param value Value.
	 */
	public set value(value: string) {
		this.options.selectedIndex = this.options.findIndex(
			(o) => o instanceof HTMLOptionElement && o.value === value
		);
	}

	/**
	 * Returns value.
	 *
	 * @returns Value.
	 */
	public get selectedIndex(): number {
		return this._options ? this._options.selectedIndex : -1;
	}

	/**
	 * Sets value.
	 *
	 * @param value Value.
	 */
	public set selectedIndex(value: number) {
		if (value > this.options.length - 1 || value < -1) {
			throw new DOMException(
				'Select elements selected index must be valid',
				DOMExceptionNameEnum.indexSizeError
			);
		}

		this._options.selectedIndex = value;
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
	 * Returns options.
	 *
	 * @returns Options.
	 */
	public get options(): IHTMLOptionsCollection {
		return this._options;
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
	 * Append a child node to childNodes.
	 *
	 * @override
	 * @param  node Node to append.
	 * @returns Appended node.
	 */
	public override appendChild(node: INode): INode {
		if (node.nodeType === Node.ELEMENT_NODE) {
			const element = <IHTMLElement>node;
			if (element.tagName === 'OPTION' || element.tagName === 'OPTGROUP') {
				this.options.add(<IHTMLOptionElement | IHTMLOptGroupElement>element);
			}
		}

		return super.appendChild(node);
	}

	/**
	 * Inserts a node before another.
	 *
	 * @override
	 * @param newNode Node to insert.
	 * @param [referenceNode] Node to insert before.
	 * @returns Inserted node.
	 */
	public override insertBefore(newNode: INode, referenceNode?: INode): INode {
		const returnValue = super.insertBefore(newNode, referenceNode);

		if (newNode.nodeType === Node.ELEMENT_NODE && referenceNode?.nodeType === Node.ELEMENT_NODE) {
			const newElement = <IHTMLElement>newNode;

			if (newElement.tagName === 'OPTION' || newElement.tagName === 'OPTGROUP') {
				const referenceElement = <IHTMLElement>referenceNode;
				const referenceOptElement =
					referenceElement.tagName === 'OPTION' || referenceElement.tagName === 'OPTGROUP'
						? <IHTMLOptionElement | IHTMLOptGroupElement>referenceElement
						: undefined;

				this.options.add(
					<IHTMLOptionElement | IHTMLOptGroupElement>newElement,
					referenceOptElement
				);
			}
		}

		return returnValue;
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
	 * Removes indexed element from options collection.
	 *
	 * @param index Index.
	 */
	public override remove(index?: number): void {
		if (!arguments.length) {
			super.remove();
		}

		this.options.remove(index);
	}

	/**
	 * Remove Child element from childNodes array.
	 *
	 * @override
	 * @param node Node to remove.
	 */
	public override removeChild(node: INode): INode {
		if (node.nodeType === Node.ELEMENT_NODE) {
			const element = <IHTMLElement>node;
			if (element.tagName === 'OPTION' || element.tagName === 'OPTION') {
				const index = this.options.indexOf(<IHTMLOptionElement | IHTMLOptGroupElement>node);
				if (index !== -1) {
					this.options.remove(index);
				}
			}
		}

		return super.removeChild(node);
	}
}
