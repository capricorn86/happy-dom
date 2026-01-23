import SVGElement from '../../../src/nodes/svg-element/SVGElement.js';
import FocusEvent from '../../../src/event/events/FocusEvent.js';
import Document from '../../../src/nodes/document/Document.js';
import HTMLElement from '../../../src/nodes/html-element/HTMLElement.js';
import Window from '../../../src/window/Window.js';
import { beforeEach, describe, it, expect } from 'vitest';
import EventTarget from '../../../src/event/EventTarget.js';

describe('HTMLElementUtility', () => {
	let window: Window;
	let document: Document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	describe('blur()', () => {
		it('Dispatches "blur" and "focusout" event.', () => {
			for (const element of [
				<HTMLElement>document.createElement('div'),
				<SVGElement>document.createElementNS('http://www.w3.org/2000/svg', 'svg')
			]) {
				let blurEvent: FocusEvent | null = null;
				let blurTarget: EventTarget | null = null;
				let blurCurrentTarget: EventTarget | null = null;
				let focusOutEvent: FocusEvent | null = null;
				let focusOutTarget: EventTarget | null = null;
				let focusOutCurrentTarget: EventTarget | null = null;

				document.body.appendChild(element);

				element.addEventListener('blur', (event) => {
					blurEvent = <FocusEvent>event;
					blurTarget = event.target;
					blurCurrentTarget = event.currentTarget;
				});

				element.addEventListener('focusout', (event) => {
					focusOutEvent = <FocusEvent>event;
					focusOutTarget = event.target;
					focusOutCurrentTarget = event.currentTarget;
				});

				element.focus();
				element.blur();

				expect((<FocusEvent>(<unknown>blurEvent)).type).toBe('blur');
				expect((<FocusEvent>(<unknown>blurEvent)).bubbles).toBe(false);
				expect((<FocusEvent>(<unknown>blurEvent)).composed).toBe(true);
				expect((<FocusEvent>(<unknown>blurEvent)).target).toBe(element);
				expect(blurTarget).toBe(element);
				expect(blurCurrentTarget).toBe(element);

				expect((<FocusEvent>(<unknown>focusOutEvent)).type).toBe('focusout');
				expect((<FocusEvent>(<unknown>focusOutEvent)).bubbles).toBe(true);
				expect((<FocusEvent>(<unknown>focusOutEvent)).composed).toBe(true);
				expect((<FocusEvent>(<unknown>focusOutEvent)).target).toBe(element);
				expect(focusOutTarget).toBe(element);
				expect(focusOutCurrentTarget).toBe(element);

				expect(document.activeElement === document.body).toBe(true);
			}
		});

		it('Does not dispatch "blur" event if not connected to the DOM.', () => {
			for (const element of [
				<HTMLElement>document.createElement('div'),
				<SVGElement>document.createElementNS('http://www.w3.org/2000/svg', 'svg')
			]) {
				let triggeredEvent: FocusEvent | null = null;

				element.addEventListener('blur', (event) => {
					triggeredEvent = <FocusEvent>event;
				});

				element.focus();
				element.blur();

				expect(triggeredEvent).toBe(null);
			}
		});

		it('Does not dispatch "blur" event if it is not in focus.', () => {
			for (const element of [
				<HTMLElement>document.createElement('div'),
				<SVGElement>document.createElementNS('http://www.w3.org/2000/svg', 'svg')
			]) {
				let triggeredEvent: FocusEvent | null = null;

				document.body.appendChild(element);

				element.addEventListener('blur', (event) => {
					triggeredEvent = <FocusEvent>event;
				});

				element.blur();

				expect(triggeredEvent).toBe(null);
			}
		});
	});

	describe('focus()', () => {
		it('Dispatches "focus" and "focusin" event.', () => {
			for (const element of [
				<HTMLElement>document.createElement('div'),
				<SVGElement>document.createElementNS('http://www.w3.org/2000/svg', 'svg')
			]) {
				let focusEvent: FocusEvent | null = null;
				let focusTarget: EventTarget | null = null;
				let focusCurrentTarget: EventTarget | null = null;
				let focusInEvent: FocusEvent | null = null;
				let focusInTarget: EventTarget | null = null;
				let focusInCurrentTarget: EventTarget | null = null;

				document.body.appendChild(element);

				element.addEventListener('focus', (event) => {
					focusEvent = <FocusEvent>event;
					focusTarget = event.target;
					focusCurrentTarget = event.currentTarget;
				});

				element.addEventListener('focusin', (event) => {
					focusInEvent = <FocusEvent>event;
					focusInTarget = event.target;
					focusInCurrentTarget = event.currentTarget;
				});

				element.focus();

				expect((<FocusEvent>(<unknown>focusEvent)).type).toBe('focus');
				expect((<FocusEvent>(<unknown>focusEvent)).bubbles).toBe(false);
				expect((<FocusEvent>(<unknown>focusEvent)).composed).toBe(true);
				expect((<FocusEvent>(<unknown>focusEvent)).target).toBe(element);
				expect(focusTarget).toBe(element);
				expect(focusCurrentTarget).toBe(element);

				expect((<FocusEvent>(<unknown>focusInEvent)).type).toBe('focusin');
				expect((<FocusEvent>(<unknown>focusInEvent)).bubbles).toBe(true);
				expect((<FocusEvent>(<unknown>focusInEvent)).composed).toBe(true);
				expect((<FocusEvent>(<unknown>focusInEvent)).target).toBe(element);
				expect(focusInTarget).toBe(element);
				expect(focusInCurrentTarget).toBe(element);

				expect(document.activeElement).toBe(element);
			}
		});

		it('Does not dispatch "focus" event if not connected to the DOM.', () => {
			for (const element of [
				<HTMLElement>document.createElement('div'),
				<SVGElement>document.createElementNS('http://www.w3.org/2000/svg', 'svg')
			]) {
				let triggeredEvent: FocusEvent | null = null;

				element.addEventListener('focus', (event) => {
					triggeredEvent = <FocusEvent>event;
				});

				element.focus();

				expect(triggeredEvent).toBe(null);
			}
		});

		it('Does not dispatch "focus" event if it is already focused.', () => {
			for (const element of [
				<HTMLElement>document.createElement('div'),
				<SVGElement>document.createElementNS('http://www.w3.org/2000/svg', 'svg')
			]) {
				let triggeredEvent: FocusEvent | null = null;

				document.body.appendChild(element);

				element.focus();

				element.addEventListener('focus', (event) => {
					triggeredEvent = <FocusEvent>event;
				});

				element.focus();

				expect(triggeredEvent).toBe(null);
			}
		});

		it('Dispatches "blur" event on the previously focused element.', () => {
			for (const element of [
				<HTMLElement>document.createElement('div'),
				<SVGElement>document.createElementNS('http://www.w3.org/2000/svg', 'svg')
			]) {
				const previousElement = <HTMLElement>document.createElement('div');
				let event: FocusEvent | null = null;
				let target: EventTarget | null = null;
				let currentTarget: EventTarget | null = null;

				document.body.appendChild(element);
				document.body.appendChild(previousElement);

				previousElement.focus();

				previousElement.addEventListener('blur', (e) => {
					event = <FocusEvent>e;
					target = e.target;
					currentTarget = e.currentTarget;
				});

				element.focus();

				expect((<FocusEvent>(<unknown>event)).type).toBe('blur');
				expect((<FocusEvent>(<unknown>event)).bubbles).toBe(false);
				expect((<FocusEvent>(<unknown>event)).composed).toBe(true);
				expect((<FocusEvent>(<unknown>event)).target).toBe(previousElement);
				expect(target).toBe(previousElement);
				expect(currentTarget).toBe(previousElement);
			}
		});
	});

	describe('Related targets', () => {
		it('Sets relatedTarget.', () => {
			for (const element of [
				<HTMLElement>document.createElement('div'),
				<SVGElement>document.createElementNS('http://www.w3.org/2000/svg', 'svg')
			]) {
				const focusElement = <HTMLElement | SVGElement>element.cloneNode();
				const blurElement = <HTMLElement | SVGElement>element.cloneNode();
				let triggeredBlurEvent: FocusEvent | null = null;
				let triggeredFocusOutEvent: FocusEvent | null = null;
				let triggeredFocusEvent: FocusEvent | null = null;
				let triggeredFocusInEvent: FocusEvent | null = null;

				document.body.appendChild(focusElement);
				document.body.appendChild(blurElement);

				blurElement.addEventListener('blur', (event) => {
					triggeredBlurEvent = <FocusEvent>event;
				});

				blurElement.addEventListener('focusout', (event) => {
					triggeredFocusOutEvent = <FocusEvent>event;
				});

				focusElement.addEventListener('focus', (event) => {
					triggeredFocusEvent = <FocusEvent>event;
				});

				focusElement.addEventListener('focusin', (event) => {
					triggeredFocusInEvent = <FocusEvent>event;
				});

				blurElement.focus();
				focusElement.focus();

				expect((<FocusEvent>(<unknown>triggeredBlurEvent)).type).toBe('blur');
				expect((<FocusEvent>(<unknown>triggeredBlurEvent)).relatedTarget).toBe(focusElement);

				expect((<FocusEvent>(<unknown>triggeredFocusOutEvent)).type).toBe('focusout');
				expect((<FocusEvent>(<unknown>triggeredFocusOutEvent)).relatedTarget).toBe(focusElement);

				expect((<FocusEvent>(<unknown>triggeredFocusEvent)).type).toBe('focus');
				expect((<FocusEvent>(<unknown>triggeredFocusEvent)).relatedTarget).toBe(blurElement);

				expect((<FocusEvent>(<unknown>triggeredFocusInEvent)).type).toBe('focusin');
				expect((<FocusEvent>(<unknown>triggeredFocusInEvent)).relatedTarget).toBe(blurElement);
			}
		});

		it('Sets relatedTarget to null if blur does not have new focus target.', () => {
			for (const element of [
				<HTMLElement>document.createElement('div'),
				<SVGElement>document.createElementNS('http://www.w3.org/2000/svg', 'svg')
			]) {
				const focusElement = <HTMLElement | SVGElement>element.cloneNode();
				const blurElement = <HTMLElement | SVGElement>element.cloneNode();
				let triggeredBlurEvent: FocusEvent | null = null;
				let triggeredFocusOutEvent: FocusEvent | null = null;

				document.body.appendChild(focusElement);
				document.body.appendChild(blurElement);

				focusElement.addEventListener('blur', (event) => {
					triggeredBlurEvent = <FocusEvent>event;
				});

				focusElement.addEventListener('focusout', (event) => {
					triggeredFocusOutEvent = <FocusEvent>event;
				});

				blurElement.focus();
				focusElement.focus();
				focusElement.blur();

				expect((<FocusEvent>(<unknown>triggeredBlurEvent)).type).toBe('blur');
				expect((<FocusEvent>(<unknown>triggeredBlurEvent)).relatedTarget).toBeNull();

				expect((<FocusEvent>(<unknown>triggeredFocusOutEvent)).type).toBe('focusout');
				expect((<FocusEvent>(<unknown>triggeredFocusOutEvent)).relatedTarget).toBeNull();
			}
		});
	});
});
