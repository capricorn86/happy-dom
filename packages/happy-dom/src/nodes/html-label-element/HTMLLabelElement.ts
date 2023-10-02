import HTMLElement from '../html-element/HTMLElement.js';
import IHTMLElement from '../html-element/IHTMLElement.js';
import IHTMLFormElement from '../html-form-element/IHTMLFormElement.js';
import IHTMLLabelElement from './IHTMLLabelElement.js';
import Event from '../../event/Event.js';
import EventPhaseEnum from '../../event/EventPhaseEnum.js';
import PointerEvent from '../../event/events/PointerEvent.js';

/**
 * HTML Label Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement.
 */
export default class HTMLLabelElement extends HTMLElement implements IHTMLLabelElement {
	/**
	 * Returns a string containing the ID of the labeled control. This reflects the "for" attribute.
	 *
	 * @returns ID of the labeled control.
	 */
	public get htmlFor(): string {
		const htmlFor = this.getAttribute('for');
		if (htmlFor !== null) {
			return htmlFor;
		}
		return htmlFor !== null ? htmlFor : '';
	}

	/**
	 * Sets a string containing the ID of the labeled control. This reflects the "for" attribute.
	 *
	 * @param htmlFor ID of the labeled control.
	 */
	public set htmlFor(htmlFor: string) {
		this.setAttribute('for', htmlFor);
	}

	/**
	 * Returns an HTML element representing the control with which the label is associated.
	 *
	 * @returns Control element.
	 */
	public get control(): IHTMLElement {
		const htmlFor = this.htmlFor;
		if (htmlFor) {
			const control = <IHTMLElement>this.ownerDocument.getElementById(htmlFor);
			return control !== this ? control : null;
		}
		return <IHTMLElement>(
			this.querySelector('button,input:not([type="hidden"]),meter,output,progress,select,textarea')
		);
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
	 * Clones a node.
	 *
	 * @override
	 * @param [deep=false] "true" to clone deep.
	 * @returns Cloned node.
	 */
	public cloneNode(deep = false): IHTMLLabelElement {
		return <HTMLLabelElement>super.cloneNode(deep);
	}

	/**
	 * @override
	 */
	public override dispatchEvent(event: Event): boolean {
		const returnValue = super.dispatchEvent(event);

		if (
			event.type === 'click' &&
			(event.eventPhase === EventPhaseEnum.atTarget || event.eventPhase === EventPhaseEnum.bubbling)
		) {
			const control = this.control;
			if (control && event.target !== control) {
				control.dispatchEvent(new PointerEvent('click', { bubbles: true, cancelable: true }));
			}
		}

		return returnValue;
	}
}
