import Event from '../../event/Event.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import EventPhaseEnum from '../../event/EventPhaseEnum.js';
import INamedNodeMap from '../../named-node-map/INamedNodeMap.js';
import ValidityState from '../../validity-state/ValidityState.js';
import HTMLElement from '../html-element/HTMLElement.js';
import HTMLFormElement from '../html-form-element/HTMLFormElement.js';
import IHTMLFormElement from '../html-form-element/IHTMLFormElement.js';
import HTMLLabelElementUtility from '../html-label-element/HTMLLabelElementUtility.js';
import IHTMLLabelElement from '../html-label-element/IHTMLLabelElement.js';
import INode from '../node/INode.js';
import INodeList from '../node/INodeList.js';
import HTMLButtonElementNamedNodeMap from './HTMLButtonElementNamedNodeMap.js';
import IHTMLButtonElement from './IHTMLButtonElement.js';

const BUTTON_TYPES = ['submit', 'reset', 'button', 'menu'];

/**
 * HTML Button Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLButtonElement.
 */
export default class HTMLButtonElement extends HTMLElement implements IHTMLButtonElement {
	public override [PropertySymbol.attributes]: INamedNodeMap = new HTMLButtonElementNamedNodeMap(
		this
	);
	public [PropertySymbol.validationMessage] = '';
	public [PropertySymbol.validity] = new ValidityState(this);

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
	 * Returns value.
	 *
	 * @returns Value.
	 */
	public get value(): string {
		return this.getAttribute('value');
	}

	/**
	 * Sets value.
	 *
	 * @param value Value.
	 */
	public set value(value: string) {
		this.setAttribute('value', value);
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
	 * Returns type
	 *
	 * @returns Type
	 */
	public get type(): string {
		return this.#sanitizeType(this.getAttribute('type'));
	}

	/**
	 * Sets type
	 *
	 * @param v Type
	 */
	public set type(v: string) {
		this.setAttribute('type', this.#sanitizeType(v));
	}

	/**
	 * Returns no validate.
	 *
	 * @returns No validate.
	 */
	public get formNoValidate(): boolean {
		return this.getAttribute('formnovalidate') !== null;
	}

	/**
	 * Sets no validate.
	 *
	 * @param formNoValidate No validate.
	 */
	public set formNoValidate(formNoValidate: boolean) {
		if (!formNoValidate) {
			this.removeAttribute('formnovalidate');
		} else {
			this.setAttribute('formnovalidate', '');
		}
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
	 * Returns the associated label elements.
	 *
	 * @returns Label elements.
	 */
	public get labels(): INodeList<IHTMLLabelElement> {
		return HTMLLabelElementUtility.getAssociatedLabelElements(this);
	}

	/**
	 * Checks validity.
	 *
	 * @returns "true" if the field is valid.
	 */
	public checkValidity(): boolean {
		const valid =
			this.disabled ||
			this.type === 'reset' ||
			this.type === 'button' ||
			this[PropertySymbol.validity].valid;
		if (!valid) {
			this.dispatchEvent(new Event('invalid', { bubbles: true, cancelable: true }));
		}
		return valid;
	}

	/**
	 * Reports validity.
	 *
	 * @returns Validity.
	 */
	public reportValidity(): boolean {
		return this.checkValidity();
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
	 * @override
	 */
	public override dispatchEvent(event: Event): boolean {
		if (event.type === 'click' && event.eventPhase === EventPhaseEnum.none && this.disabled) {
			return false;
		}

		const returnValue = super.dispatchEvent(event);

		if (
			event.type === 'click' &&
			(event.eventPhase === EventPhaseEnum.atTarget ||
				event.eventPhase === EventPhaseEnum.bubbling) &&
			this[PropertySymbol.formNode] &&
			this[PropertySymbol.isConnected]
		) {
			const form = <IHTMLFormElement>this[PropertySymbol.formNode];
			switch (this.type) {
				case 'submit':
					form.requestSubmit(this);
					break;
				case 'reset':
					form.reset();
					break;
			}
		}

		return returnValue;
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
	 * Sanitizes type.
	 *
	 * TODO: We can improve performance a bit if we make the types as a constant.
	 *
	 * @param type Type.
	 * @returns Type sanitized.
	 */
	#sanitizeType(type: string): string {
		type = (type && type.toLowerCase()) || 'submit';

		if (!BUTTON_TYPES.includes(type)) {
			type = 'submit';
		}

		return type;
	}
}
