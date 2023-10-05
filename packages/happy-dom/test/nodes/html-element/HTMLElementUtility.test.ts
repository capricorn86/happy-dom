import ISVGElement from '../../../src/nodes/svg-element/ISVGElement.js';
import FocusEvent from '../../../src/event/events/FocusEvent.js';
import IDocument from '../../../src/nodes/document/IDocument.js';
import IHTMLElement from '../../../src/nodes/html-element/IHTMLElement.js';
import IWindow from '../../../src/window/IWindow.js';
import Window from '../../../src/window/Window.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('HTMLElementUtility', () => {
	let window: IWindow;
	let document: IDocument;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	describe('blur()', () => {
		it('Dispatches "blur" and "focusout" event.', () => {
			for (const element of [
				<IHTMLElement>document.createElement('div'),
				<ISVGElement>document.createElementNS('http://www.w3.org/2000/svg', 'svg')
			]) {
				let triggeredBlurEvent: FocusEvent | null = null;
				let triggeredFocusOutEvent: FocusEvent | null = null;

				document.body.appendChild(element);

				element.addEventListener('blur', (event) => {
					triggeredBlurEvent = <FocusEvent>event;
				});

				element.addEventListener('focusout', (event) => {
					triggeredFocusOutEvent = <FocusEvent>event;
				});

				element.focus();
				element.blur();

				expect((<FocusEvent>(<unknown>triggeredBlurEvent)).type).toBe('blur');
				expect((<FocusEvent>(<unknown>triggeredBlurEvent)).bubbles).toBe(false);
				expect((<FocusEvent>(<unknown>triggeredBlurEvent)).composed).toBe(true);
				expect((<FocusEvent>(<unknown>triggeredBlurEvent)).target === element).toBe(true);

				expect((<FocusEvent>(<unknown>triggeredFocusOutEvent)).type).toBe('focusout');
				expect((<FocusEvent>(<unknown>triggeredFocusOutEvent)).bubbles).toBe(true);
				expect((<FocusEvent>(<unknown>triggeredFocusOutEvent)).composed).toBe(true);
				expect((<FocusEvent>(<unknown>triggeredFocusOutEvent)).target === element).toBe(true);

				expect(document.activeElement === document.body).toBe(true);
			}
		});

		it('Does not dispatch "blur" event if not connected to the DOM.', () => {
			for (const element of [
				<IHTMLElement>document.createElement('div'),
				<ISVGElement>document.createElementNS('http://www.w3.org/2000/svg', 'svg')
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
				<IHTMLElement>document.createElement('div'),
				<ISVGElement>document.createElementNS('http://www.w3.org/2000/svg', 'svg')
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
				<IHTMLElement>document.createElement('div'),
				<ISVGElement>document.createElementNS('http://www.w3.org/2000/svg', 'svg')
			]) {
				let triggeredFocusEvent: FocusEvent | null = null;
				let triggeredFocusInEvent: FocusEvent | null = null;

				document.body.appendChild(element);

				element.addEventListener('focus', (event) => {
					triggeredFocusEvent = <FocusEvent>event;
				});

				element.addEventListener('focusin', (event) => {
					triggeredFocusInEvent = <FocusEvent>event;
				});

				element.focus();

				expect((<FocusEvent>(<unknown>triggeredFocusEvent)).type).toBe('focus');
				expect((<FocusEvent>(<unknown>triggeredFocusEvent)).bubbles).toBe(false);
				expect((<FocusEvent>(<unknown>triggeredFocusEvent)).composed).toBe(true);
				expect((<FocusEvent>(<unknown>triggeredFocusEvent)).target === element).toBe(true);

				expect((<FocusEvent>(<unknown>triggeredFocusInEvent)).type).toBe('focusin');
				expect((<FocusEvent>(<unknown>triggeredFocusInEvent)).bubbles).toBe(true);
				expect((<FocusEvent>(<unknown>triggeredFocusInEvent)).composed).toBe(true);
				expect((<FocusEvent>(<unknown>triggeredFocusInEvent)).target === element).toBe(true);

				expect(document.activeElement === element).toBe(true);
			}
		});

		it('Does not dispatch "focus" event if not connected to the DOM.', () => {
			for (const element of [
				<IHTMLElement>document.createElement('div'),
				<ISVGElement>document.createElementNS('http://www.w3.org/2000/svg', 'svg')
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
				<IHTMLElement>document.createElement('div'),
				<ISVGElement>document.createElementNS('http://www.w3.org/2000/svg', 'svg')
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
				<IHTMLElement>document.createElement('div'),
				<ISVGElement>document.createElementNS('http://www.w3.org/2000/svg', 'svg')
			]) {
				const previousElement = <IHTMLElement>document.createElement('div');
				let triggeredEvent: FocusEvent | null = null;

				document.body.appendChild(element);
				document.body.appendChild(previousElement);

				previousElement.focus();

				previousElement.addEventListener('blur', (event) => {
					triggeredEvent = <FocusEvent>event;
				});

				element.focus();

				expect((<FocusEvent>(<unknown>triggeredEvent)).type).toBe('blur');
				expect((<FocusEvent>(<unknown>triggeredEvent)).bubbles).toBe(false);
				expect((<FocusEvent>(<unknown>triggeredEvent)).composed).toBe(true);
				expect((<FocusEvent>(<unknown>triggeredEvent)).target === previousElement).toBe(true);
			}
		});
	});

	describe('Related targets', () => {
		it('Sets relatedTarget.', () => {
			for (const element of [
				<IHTMLElement>document.createElement('div'),
				<ISVGElement>document.createElementNS('http://www.w3.org/2000/svg', 'svg')
			]) {
				const focusElement = <IHTMLElement | ISVGElement>element.cloneNode();
				const blurElement = <IHTMLElement | ISVGElement>element.cloneNode();
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
				<IHTMLElement>document.createElement('div'),
				<ISVGElement>document.createElementNS('http://www.w3.org/2000/svg', 'svg')
			]) {
				const focusElement = <IHTMLElement | ISVGElement>element.cloneNode();
				const blurElement = <IHTMLElement | ISVGElement>element.cloneNode();
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
