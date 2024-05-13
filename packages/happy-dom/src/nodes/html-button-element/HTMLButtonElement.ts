import Event from '../../event/Event.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import EventPhaseEnum from '../../event/EventPhaseEnum.js';
import NamedNodeMap from '../../named-node-map/NamedNodeMap.js';
import ValidityState from '../../validity-state/ValidityState.js';
import HTMLElement from '../html-element/HTMLElement.js';
import HTMLFormElement from '../html-form-element/HTMLFormElement.js';
import HTMLLabelElementUtility from '../html-label-element/HTMLLabelElementUtility.js';
import HTMLLabelElement from '../html-label-element/HTMLLabelElement.js';
import Node from '../node/Node.js';
import NodeList from '../node/NodeList.js';
import HTMLButtonElementNamedNodeMap from './HTMLButtonElementNamedNodeMap.js';
import { URL } from 'url';
import MouseEvent from '../../event/events/MouseEvent.js';

const BUTTON_TYPES = ['submit', 'reset', 'button', 'menu'];

/**
 * HTML Button Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLButtonElement.
 */
export default class HTMLButtonElement extends HTMLElement {
	public override [PropertySymbol.attributes]: NamedNodeMap = new HTMLButtonElementNamedNodeMap(
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
	 * Returns form action.
	 *
	 * @returns Form action.
	 */
	public get formAction(): string {
		if (!this.hasAttribute('formaction')) {
			return this[PropertySymbol.ownerDocument].location.href;
		}

		try {
			return new URL(
				this.getAttribute('formaction'),
				this[PropertySymbol.ownerDocument].location.href
			).href;
		} catch (e) {
			return '';
		}
	}

	/**
	 * Sets form action.
	 *
	 * @param formAction Form action.
	 */
	public set formAction(formAction: string) {
		this.setAttribute('formaction', formAction);
	}

	/**
	 * Returns form enctype.
	 *
	 * @returns Form enctype.
	 */
	public get formEnctype(): string {
		return this.getAttribute('formenctype') || '';
	}

	/**
	 * Sets form enctype.
	 *
	 * @param formEnctype Form enctype.
	 */
	public set formEnctype(formEnctype: string) {
		this.setAttribute('formenctype', formEnctype);
	}

	/**
	 * Returns form method.
	 *
	 * @returns Form method.
	 */
	public get formMethod(): string {
		return this.getAttribute('formmethod') || '';
	}

	/**
	 * Sets form method.
	 *
	 * @param formMethod Form method.
	 */
	public set formMethod(formMethod: string) {
		this.setAttribute('formmethod', formMethod);
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
	 * Returns form target.
	 *
	 * @returns Form target.
	 */
	public get formTarget(): string {
		return this.getAttribute('formtarget') || '';
	}

	/**
	 * Sets form target.
	 *
	 * @param formTarget Form target.
	 */
	public set formTarget(formTarget: string) {
		this.setAttribute('formtarget', formTarget);
	}

	/**
	 * Returns the parent form element.
	 *
	 * @returns Form.
	 */
	public get form(): HTMLFormElement | null {
		if (this[PropertySymbol.formNode]) {
			return <HTMLFormElement>this[PropertySymbol.formNode];
		}
		if (!this.isConnected) {
			return null;
		}
		const formID = this.getAttribute('form');
		return formID
			? <HTMLFormElement>this[PropertySymbol.ownerDocument].getElementById(formID)
			: null;
	}

	/**
	 * Returns the associated label elements.
	 *
	 * @returns Label elements.
	 */
	public get labels(): NodeList<HTMLLabelElement> {
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
		if (
			event.type === 'click' &&
			event instanceof MouseEvent &&
			event.eventPhase === EventPhaseEnum.none &&
			this.disabled
		) {
			return false;
		}

		const returnValue = super.dispatchEvent(event);

		if (
			event.type === 'click' &&
			event instanceof MouseEvent &&
			(event.eventPhase === EventPhaseEnum.atTarget ||
				event.eventPhase === EventPhaseEnum.bubbling) &&
			this[PropertySymbol.isConnected]
		) {
			const form = this.form;
			if (!form) {
				return returnValue;
			}
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
	public override [PropertySymbol.connectToNode](parentNode: Node = null): void {
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
