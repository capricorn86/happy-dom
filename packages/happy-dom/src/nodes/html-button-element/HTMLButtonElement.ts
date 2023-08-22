import Event from '../../event/Event.js';
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
	public override readonly attributes: INamedNodeMap = new HTMLButtonElementNamedNodeMap(this);
	public readonly validationMessage = '';
	public readonly validity = new ValidityState(this);

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
		return this._sanitizeType(this.getAttribute('type'));
	}

	/**
	 * Sets type
	 *
	 * @param v Type
	 */
	public set type(v: string) {
		this.setAttribute('type', this._sanitizeType(v));
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
		return <IHTMLFormElement>this._formNode;
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
			this.disabled || this.type === 'reset' || this.type === 'button' || this.validity.valid;
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
		(<string>this.validationMessage) = String(message);
	}

	/**
	 * Sanitizes type.
	 *
	 * TODO: We can improve performance a bit if we make the types as a constant.
	 *
	 * @param type Type.
	 * @returns Type sanitized.
	 */
	protected _sanitizeType(type: string): string {
		type = (type && type.toLowerCase()) || 'submit';

		if (!BUTTON_TYPES.includes(type)) {
			type = 'submit';
		}

		return type;
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
			this._formNode &&
			this.isConnected
		) {
			const form = <IHTMLFormElement>this._formNode;
			switch (this.type) {
				case 'submit':
					form.requestSubmit();
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
