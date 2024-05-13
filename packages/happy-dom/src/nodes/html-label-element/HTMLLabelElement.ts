import HTMLElement from '../html-element/HTMLElement.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import HTMLFormElement from '../html-form-element/HTMLFormElement.js';
import Event from '../../event/Event.js';
import EventPhaseEnum from '../../event/EventPhaseEnum.js';
import MouseEvent from '../../event/events/MouseEvent.js';

/**
 * HTML Label Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement.
 */
export default class HTMLLabelElement extends HTMLElement {
	// Public properties
	public cloneNode: (deep?: boolean) => HTMLLabelElement;

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
	public get control(): HTMLElement {
		const htmlFor = this.htmlFor;
		if (htmlFor) {
			const control = <HTMLElement>this[PropertySymbol.ownerDocument].getElementById(htmlFor);
			return control !== this ? control : null;
		}
		return <HTMLElement>(
			this.querySelector('button,input:not([type="hidden"]),meter,output,progress,select,textarea')
		);
	}

	/**
	 * Returns the parent form element.
	 *
	 * @returns Form.
	 */
	public get form(): HTMLFormElement {
		return <HTMLFormElement>this[PropertySymbol.formNode];
	}

	/**
	 * @override
	 */
	public override [PropertySymbol.cloneNode](deep = false): HTMLLabelElement {
		return <HTMLLabelElement>super[PropertySymbol.cloneNode](deep);
	}

	/**
	 * @override
	 */
	public override dispatchEvent(event: Event): boolean {
		const returnValue = super.dispatchEvent(event);

		if (
			event.type === 'click' &&
			event instanceof MouseEvent &&
			(event.eventPhase === EventPhaseEnum.atTarget || event.eventPhase === EventPhaseEnum.bubbling)
		) {
			const control = this.control;
			if (control && event.target !== control) {
				control.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
			}
		}

		return returnValue;
	}
}
