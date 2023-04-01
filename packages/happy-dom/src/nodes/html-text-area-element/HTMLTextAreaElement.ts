import Event from '../../event/Event';
import DOMException from '../../exception/DOMException';
import DOMExceptionNameEnum from '../../exception/DOMExceptionNameEnum';
import IAttr from '../attr/IAttr';
import HTMLElement from '../html-element/HTMLElement';
import HTMLFormElement from '../html-form-element/HTMLFormElement';
import IHTMLFormElement from '../html-form-element/IHTMLFormElement';
import HTMLInputElementSelectionDirectionEnum from '../html-input-element/HTMLInputElementSelectionDirectionEnum';
import HTMLInputElementSelectionModeEnum from '../html-input-element/HTMLInputElementSelectionModeEnum';
import INode from '../node/INode';
import ValidityState from '../../validity-state/ValidityState';
import IHTMLTextAreaElement from './IHTMLTextAreaElement';
import INodeList from '../node/INodeList';
import IHTMLLabelElement from '../html-label-element/IHTMLLabelElement';
import IDocument from '../document/IDocument';
import IShadowRoot from '../shadow-root/IShadowRoot';
import NodeList from '../node/NodeList';

/**
 * HTML Text Area Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement.
 */
export default class HTMLTextAreaElement extends HTMLElement implements IHTMLTextAreaElement {
	public readonly type = 'textarea';
	public readonly validationMessage = '';
	public readonly validity = new ValidityState(this);

	// Events
	public oninput: (event: Event) => void | null = null;
	public onselectionchange: (event: Event) => void | null = null;

	public _value = null;
	public _selectionStart = null;
	public _selectionEnd = null;
	public _selectionDirection = HTMLInputElementSelectionDirectionEnum.none;
	public _textAreaNode: HTMLTextAreaElement = this;

	/**
	 * Returns the default value.
	 *
	 * @returns Default value.
	 */
	public get defaultValue(): string {
		return this.textContent;
	}

	/**
	 * Sets the default value.
	 *
	 * @param defaultValue Default value.
	 */
	public set defaultValue(defaultValue: string) {
		this.textContent = defaultValue;
	}

	/**
	 * Returns minlength.
	 *
	 * @returns Min length.
	 */
	public get minLength(): number {
		const minLength = this.getAttribute('minlength');
		if (minLength !== null) {
			return parseInt(minLength);
		}
		return -1;
	}

	/**
	 * Sets minlength.
	 *
	 * @param minLength Min length.
	 */
	public set minLength(minlength: number) {
		this.setAttribute('minlength', String(minlength));
	}

	/**
	 * Returns maxlength.
	 *
	 * @returns Max length.
	 */
	public get maxLength(): number {
		const maxLength = this.getAttribute('maxlength');
		if (maxLength !== null) {
			return parseInt(maxLength);
		}
		return -1;
	}

	/**
	 * Sets maxlength.
	 *
	 * @param maxlength Max length.
	 */
	public set maxLength(maxLength: number) {
		this.setAttribute('maxlength', String(maxLength));
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
	 * Returns placeholder.
	 *
	 * @returns Placeholder.
	 */
	public get placeholder(): string {
		return this.getAttribute('placeholder') || '';
	}

	/**
	 * Sets placeholder.
	 *
	 * @param placeholder Placeholder.
	 */
	public set placeholder(placeholder: string) {
		this.setAttribute('placeholder', placeholder);
	}

	/**
	 * Returns inputmode.
	 *
	 * @returns Inputmode.
	 */
	public get inputmode(): string {
		return this.getAttribute('inputmode') || '';
	}

	/**
	 * Sets inputmode.
	 *
	 * @param inputmode Inputmode.
	 */
	public set inputmode(inputmode: string) {
		this.setAttribute('inputmode', inputmode);
	}

	/**
	 * Returns cols.
	 *
	 * @returns Cols.
	 */
	public get cols(): string {
		return this.getAttribute('cols') || '';
	}

	/**
	 * Sets cols.
	 *
	 * @param cols Cols.
	 */
	public set cols(cols: string) {
		this.setAttribute('cols', cols);
	}

	/**
	 * Returns rows.
	 *
	 * @returns Rows.
	 */
	public get rows(): string {
		return this.getAttribute('rows') || '';
	}

	/**
	 * Sets rows.
	 *
	 * @param rows Rows.
	 */
	public set rows(rows: string) {
		this.setAttribute('rows', rows);
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
	 * Returns readOnly.
	 *
	 * @returns ReadOnly.
	 */
	public get readOnly(): boolean {
		return this.getAttribute('readonly') !== null;
	}

	/**
	 * Sets readOnly.
	 *
	 * @param readOnly ReadOnly.
	 */
	public set readOnly(readOnly: boolean) {
		if (!readOnly) {
			this.removeAttribute('readonly');
		} else {
			this.setAttribute('readonly', '');
		}
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
	 * Returns value.
	 *
	 * @returns Value.
	 */
	public get value(): string {
		if (this._value === null) {
			return this.textContent;
		}

		return this._value;
	}

	/**
	 * Sets value.
	 *
	 * @param value Value.
	 */
	public set value(value: string) {
		const oldValue = this._value;
		this._value = value;

		if (oldValue !== this._value) {
			this._selectionStart = this._value.length;
			this._selectionEnd = this._value.length;
			this._selectionDirection = HTMLInputElementSelectionDirectionEnum.none;
		}
	}

	/**
	 * Returns selection start.
	 *
	 * @returns Selection start.
	 */
	public get selectionStart(): number {
		if (this._selectionStart === null) {
			return this.value.length;
		}

		return this._selectionStart;
	}

	/**
	 * Sets selection start.
	 *
	 * @param start Start.
	 */
	public set selectionStart(start: number) {
		this.setSelectionRange(start, Math.max(start, this.selectionEnd), this._selectionDirection);
	}

	/**
	 * Returns selection end.
	 *
	 * @returns Selection end.
	 */
	public get selectionEnd(): number {
		if (this._selectionEnd === null) {
			return this.value.length;
		}

		return this._selectionEnd;
	}

	/**
	 * Sets selection end.
	 *
	 * @param end End.
	 */
	public set selectionEnd(end: number) {
		this.setSelectionRange(this.selectionStart, end, this._selectionDirection);
	}

	/**
	 * Returns selection direction.
	 *
	 * @returns Selection direction.
	 */
	public get selectionDirection(): string {
		return this._selectionDirection;
	}

	/**
	 * Sets selection direction.
	 *
	 * @param direction Direction.
	 */
	public set selectionDirection(direction: string) {
		this.setSelectionRange(this.selectionStart, this.selectionEnd, direction);
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
	 * Returns text length.
	 *
	 * @param Text Length.
	 */
	public get textLength(): number {
		return this.value.length;
	}

	/**
	 * Returns the associated label elements.
	 *
	 * @returns Label elements.
	 */
	public get labels(): INodeList<IHTMLLabelElement> {
		const id = this.id;
		if (id) {
			const rootNode = <IDocument | IShadowRoot>this.getRootNode();
			const labels = rootNode.querySelectorAll(`label[for="${id}"]`);

			let parent = this.parentNode;
			while (parent) {
				if (parent['tagName'] === 'LABEL') {
					labels.push(<IHTMLLabelElement>parent);
					break;
				}
				parent = parent.parentNode;
			}

			return <INodeList<IHTMLLabelElement>>labels;
		}
		return new NodeList<IHTMLLabelElement>();
	}

	/**
	 * Selects the text.
	 */
	public select(): void {
		this._selectionStart = 0;
		this._selectionEnd = this.value.length;
		this._selectionDirection = HTMLInputElementSelectionDirectionEnum.none;

		this.dispatchEvent(new Event('select', { bubbles: true, cancelable: true }));
	}

	/**
	 * Set selection range.
	 *
	 * @param start Start.
	 * @param end End.
	 * @param [direction="none"] Direction.
	 */
	public setSelectionRange(start: number, end: number, direction = 'none'): void {
		this._selectionEnd = Math.min(end, this.value.length);
		this._selectionStart = Math.min(start, this.selectionEnd);
		this._selectionDirection =
			direction === HTMLInputElementSelectionDirectionEnum.forward ||
			direction === HTMLInputElementSelectionDirectionEnum.backward
				? direction
				: HTMLInputElementSelectionDirectionEnum.none;
		this.dispatchEvent(new Event('select', { bubbles: true, cancelable: true }));
	}

	/**
	 * Set range text.
	 *
	 * @param replacement Replacement.
	 * @param [start] Start.
	 * @param [end] End.
	 * @param [direction] Direction.
	 * @param selectionMode
	 */
	public setRangeText(
		replacement: string,
		start: number = null,
		end: number = null,
		selectionMode = HTMLInputElementSelectionModeEnum.preserve
	): void {
		if (start === null) {
			start = this._selectionStart;
		}
		if (end === null) {
			end = this._selectionEnd;
		}

		if (start > end) {
			throw new DOMException(
				'The index is not in the allowed range.',
				DOMExceptionNameEnum.invalidStateError
			);
		}

		start = Math.min(start, this.value.length);
		end = Math.min(end, this.value.length);

		const val = this.value;
		let selectionStart = this._selectionStart;
		let selectionEnd = this._selectionEnd;

		this.value = val.slice(0, start) + replacement + val.slice(end);

		const newEnd = start + this.value.length;

		switch (selectionMode) {
			case HTMLInputElementSelectionModeEnum.select:
				this.setSelectionRange(start, newEnd);
				break;
			case HTMLInputElementSelectionModeEnum.start:
				this.setSelectionRange(start, start);
				break;
			case HTMLInputElementSelectionModeEnum.end:
				this.setSelectionRange(newEnd, newEnd);
				break;
			default:
				const delta = replacement.length - (end - start);

				if (selectionStart > end) {
					selectionStart += delta;
				} else if (selectionStart > start) {
					selectionStart = start;
				}

				if (selectionEnd > end) {
					selectionEnd += delta;
				} else if (selectionEnd > start) {
					selectionEnd = newEnd;
				}

				this.setSelectionRange(selectionStart, selectionEnd);
				break;
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
		const valid = this.disabled || this.readOnly || this.validity.valid;
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
	 * Clones a node.
	 *
	 * @override
	 * @param [deep=false] "true" to clone deep.
	 * @returns Cloned node.
	 */
	public cloneNode(deep = false): IHTMLTextAreaElement {
		const clone = <HTMLTextAreaElement>super.cloneNode(deep);

		clone._value = this._value;
		clone._selectionStart = this._selectionStart;
		clone._selectionEnd = this._selectionEnd;
		clone._selectionDirection = this._selectionDirection;

		return clone;
	}

	/**
	 * Resets selection.
	 */
	public _resetSelection(): void {
		if (this._value === null) {
			this._selectionStart = null;
			this._selectionEnd = null;
			this._selectionDirection = HTMLInputElementSelectionDirectionEnum.none;
		}
	}

	/**
	 * @override
	 */
	public override setAttributeNode(attribute: IAttr): IAttr {
		const replacedAttribute = super.setAttributeNode(attribute);
		const oldValue = replacedAttribute ? replacedAttribute.value : null;

		if ((attribute.name === 'id' || attribute.name === 'name') && this._formNode) {
			if (oldValue) {
				(<HTMLFormElement>this._formNode)._removeFormControlItem(this, oldValue);
			}
			if (attribute.value) {
				(<HTMLFormElement>this._formNode)._appendFormControlItem(this, attribute.value);
			}
		}

		return replacedAttribute;
	}

	/**
	 * @override
	 */
	public override removeAttributeNode(attribute: IAttr): IAttr {
		super.removeAttributeNode(attribute);

		if ((attribute.name === 'id' || attribute.name === 'name') && this._formNode) {
			(<HTMLFormElement>this._formNode)._removeFormControlItem(this, attribute.value);
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
				oldFormNode._removeFormControlItem(this, this.name);
				oldFormNode._removeFormControlItem(this, this.id);
			}
			if (this._formNode) {
				(<HTMLFormElement>this._formNode)._appendFormControlItem(this, this.name);
				(<HTMLFormElement>this._formNode)._appendFormControlItem(this, this.id);
			}
		}
	}
}
