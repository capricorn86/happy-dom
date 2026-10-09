import HTMLElement from '../html-element/HTMLElement.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import type HTMLFormElement from '../html-form-element/HTMLFormElement.js';
import type Event from '../../event/Event.js';
import EventPhaseEnum from '../../event/EventPhaseEnum.js';
import type HTMLInputElement from '../html-input-element/HTMLInputElement.js';
import type Document from '../document/Document.js';
import MouseEvent from '../../event/events/MouseEvent.js';
import type Node from '../node/Node.js';
import NodeTypeEnum from '../node/NodeTypeEnum.js';
import type Element from '../element/Element.js';
import type HTMLButtonElement from '../html-button-element/HTMLButtonElement.js';
import type HTMLMeterElement from '../html-meter-element/HTMLMeterElement.js';
import type HTMLOutputElement from '../html-output-element/HTMLOutputElement.js';
import type HTMLProgressElement from '../html-progress-element/HTMLProgressElement.js';
import type HTMLSelectElement from '../html-select-element/HTMLSelectElement.js';
import type HTMLTextAreaElement from '../html-text-area-element/HTMLTextAreaElement.js';

/**
 * HTML Label Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement.
 */
export default class HTMLLabelElement extends HTMLElement {
	// Public properties
	public declare cloneNode: (deep?: boolean) => HTMLLabelElement;

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
	public get control():
		| HTMLInputElement
		| HTMLButtonElement
		| HTMLMeterElement
		| HTMLOutputElement
		| HTMLProgressElement
		| HTMLSelectElement
		| HTMLTextAreaElement
		| null {
		const htmlFor = this.getAttribute('for');
		if (htmlFor !== null) {
			if (!htmlFor || !this[PropertySymbol.isConnected]) {
				return null;
			}
			const control = <HTMLElement | null>(
				(<Document>this[PropertySymbol.rootNode]).getElementById(htmlFor)
			);
			if (control) {
				switch (control[PropertySymbol.tagName]) {
					case 'INPUT':
						return (<HTMLInputElement>control).type !== 'hidden' ? <HTMLInputElement>control : null;
					case 'BUTTON':
					case 'METER':
					case 'OUTPUT':
					case 'PROGRESS':
					case 'SELECT':
					case 'TEXTAREA':
						return <HTMLInputElement>control;
					default:
						return null;
				}
			}
		}
		return <HTMLInputElement | null>(
			this.querySelector('button,input:not([type="hidden"]),meter,output,progress,select,textarea')
		);
	}

	/**
	 * Returns the parent form element.
	 *
	 * @returns Form.
	 */
	public get form(): HTMLFormElement | null {
		return (<HTMLInputElement>this.control)?.form || null;
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
			!event[PropertySymbol.defaultPrevented] &&
			event.type === 'click' &&
			(event.eventPhase === EventPhaseEnum.atTarget ||
				event.eventPhase === EventPhaseEnum.bubbling) &&
			event instanceof MouseEvent
		) {
			const control = this.control;
			if (
				control &&
				event.target !== control &&
				!this.#isInInteractiveContent(<Node>event.target)
			) {
				control.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
			}
		}

		return returnValue;
	}

	/**
	 * Returns "true" if the node is, or is inside, an interactive content descendant of the label.
	 *
	 * Clicks on interactive content inside a label do not activate the label's control.
	 *
	 * @see https://html.spec.whatwg.org/multipage/forms.html#the-label-element
	 * @param node Node.
	 * @returns "true" if the node is in interactive content.
	 */
	#isInInteractiveContent(node: Node | null): boolean {
		while (node && node !== this) {
			if (
				node[PropertySymbol.nodeType] === NodeTypeEnum.elementNode &&
				this.#isInteractiveContent(<Element>node)
			) {
				return true;
			}
			node = node[PropertySymbol.parentNode];
		}
		return false;
	}

	/**
	 * Returns "true" if the element is interactive content.
	 *
	 * @see https://html.spec.whatwg.org/multipage/dom.html#interactive-content
	 * @param element Element.
	 * @returns "true" if the element is interactive content.
	 */
	#isInteractiveContent(element: Element): boolean {
		switch (element[PropertySymbol.tagName]) {
			case 'BUTTON':
			case 'DETAILS':
			case 'EMBED':
			case 'IFRAME':
			case 'LABEL':
			case 'SELECT':
			case 'TEXTAREA':
				return true;
			case 'A':
				return element.hasAttribute('href');
			case 'AUDIO':
			case 'VIDEO':
				return element.hasAttribute('controls');
			case 'IMG':
				return element.hasAttribute('usemap');
			case 'INPUT':
				return (<HTMLInputElement>element).type !== 'hidden';
			default:
				return false;
		}
	}
}
