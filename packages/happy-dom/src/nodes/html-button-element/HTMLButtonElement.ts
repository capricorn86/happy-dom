import Event from '../../event/Event';
import EventPhaseEnum from '../../event/EventPhaseEnum';
import ValidityState from '../../validity-state/ValidityState';
import IAttr from '../attr/IAttr';
import IDocument from '../document/IDocument';
import HTMLElement from '../html-element/HTMLElement';
import HTMLFormElement from '../html-form-element/HTMLFormElement';
import IHTMLFormElement from '../html-form-element/IHTMLFormElement';
import IHTMLLabelElement from '../html-label-element/IHTMLLabelElement';
import INode from '../node/INode';
import INodeList from '../node/INodeList';
import NodeList from '../node/NodeList';
import IShadowRoot from '../shadow-root/IShadowRoot';
import IHTMLButtonElement from './IHTMLButtonElement';

const BUTTON_TYPES = ['submit', 'reset', 'button', 'menu'];

/**
 * HTML Button Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLButtonElement.
 */
export default class HTMLButtonElement extends HTMLElement implements IHTMLButtonElement {
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
