import DOMException from '../../exception/DOMException';
import DOMExceptionNameEnum from '../../exception/DOMExceptionNameEnum';
import HTMLElement from '../html-element/HTMLElement';
import IHTMLElement from '../html-element/IHTMLElement';
import IHTMLFormElement from '../html-form-element/IHTMLFormElement';
import ValidityState from '../validity-state/ValidityState';
import IHTMLLabelElement from '../html-label-element/IHTMLLabelElement';
import HTMLOptGroupElement from '../html-opt-group-element/HTMLOptGroupElement';
import HTMLOptionElement from '../html-option-element/HTMLOptionElement';
import HTMLOptionsCollection from '../html-option-element/HTMLOptionsCollection';
import IHTMLOptionsCollection from '../html-option-element/IHTMLOptionsCollection';
import INodeList from '../node/INodeList';
import HTMLSelectElementValueSanitizer from './HTMLSelectElementValueSanitizer';
import IHTMLSelectElement from './IHTMLSelectElement';

/**
 * HTML Select Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement.
 */
export default class HTMLSelectElement extends HTMLElement implements IHTMLSelectElement {
	public type: string;
	public labels: INodeList<IHTMLLabelElement>;

	public _value = null;
	public _selectedIndex = -1;
	public _options: IHTMLOptionsCollection = null;

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
	 * Returns value.
	 *
	 * @returns Value.
	 */
	public get value(): string {
		return this._value;
	}

	/**
	 * Sets value.
	 *
	 * @param value Value.
	 */
	public set value(value: string) {
		this._value = HTMLSelectElementValueSanitizer.sanitize(value);

		const idx = this.options.findIndex((o) => o.nodeValue === value);
		if (idx > -1) {
			this._selectedIndex = idx;
		}
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
		if (this.options.length - 1 > value || value < 0) {
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
		if (this._options === null) {
			this._options = new HTMLOptionsCollection();
			const childs = <INodeList<IHTMLElement>>this.childNodes;
			for (const child of childs) {
				if (child.tagName === 'OPTION') {
					this._options.add(<HTMLOptionElement | HTMLOptGroupElement>child);
				}
			}
		}

		return this._options;
	}
}
