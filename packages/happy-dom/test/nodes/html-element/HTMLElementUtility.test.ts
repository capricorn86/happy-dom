import { ISVGElement } from '../../../src';
import IDocument from '../../../src/nodes/document/IDocument';
import IHTMLElement from '../../../src/nodes/html-element/IHTMLElement';
import IWindow from '../../../src/window/IWindow';
import Window from '../../../src/window/Window';

describe('HTMLElementUtility', () => {
	let window: IWindow = null;
	let document: IDocument = null;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('blur()', () => {
		it('Dispatches "blur" and "focusout" event.', () => {
			for (const element of [
				<IHTMLElement>document.createElement('div'),
				<ISVGElement>document.createElementNS('http://www.w3.org/2000/svg', 'svg')
			]) {
				let triggeredBlurEvent = null;
				let triggeredFocusOutEvent = null;

				document.body.appendChild(element);

				element.addEventListener('blur', (event) => {
					triggeredBlurEvent = event;
				});

				element.addEventListener('focusout', (event) => {
					triggeredFocusOutEvent = event;
				});

				element.focus();
				element.blur();

				expect(triggeredBlurEvent.type).toBe('blur');
				expect(triggeredBlurEvent.bubbles).toBe(false);
				expect(triggeredBlurEvent.composed).toBe(true);
				expect(triggeredBlurEvent.target === element).toBe(true);

				expect(triggeredFocusOutEvent.type).toBe('focusout');
				expect(triggeredFocusOutEvent.bubbles).toBe(true);
				expect(triggeredFocusOutEvent.composed).toBe(true);
				expect(triggeredFocusOutEvent.target === element).toBe(true);

				expect(document.activeElement === document.body).toBe(true);
			}
		});

		it('Does not dispatch "blur" event if not connected to the DOM.', () => {
			for (const element of [
				<IHTMLElement>document.createElement('div'),
				<ISVGElement>document.createElementNS('http://www.w3.org/2000/svg', 'svg')
			]) {
				let triggeredEvent = null;

				element.addEventListener('blur', (event) => {
					triggeredEvent = event;
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
				let triggeredEvent = null;

				document.body.appendChild(element);

				element.addEventListener('blur', (event) => {
					triggeredEvent = event;
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
				let triggeredFocusEvent = null;
				let triggeredFocusInEvent = null;

				document.body.appendChild(element);

				element.addEventListener('focus', (event) => {
					triggeredFocusEvent = event;
				});

				element.addEventListener('focusin', (event) => {
					triggeredFocusInEvent = event;
				});

				element.focus();

				expect(triggeredFocusEvent.type).toBe('focus');
				expect(triggeredFocusEvent.bubbles).toBe(false);
				expect(triggeredFocusEvent.composed).toBe(true);
				expect(triggeredFocusEvent.target === element).toBe(true);

				expect(triggeredFocusInEvent.type).toBe('focusin');
				expect(triggeredFocusInEvent.bubbles).toBe(true);
				expect(triggeredFocusInEvent.composed).toBe(true);
				expect(triggeredFocusInEvent.target === element).toBe(true);

				expect(document.activeElement === element).toBe(true);
			}
		});

		it('Does not dispatch "focus" event if not connected to the DOM.', () => {
			for (const element of [
				<IHTMLElement>document.createElement('div'),
				<ISVGElement>document.createElementNS('http://www.w3.org/2000/svg', 'svg')
			]) {
				let triggeredEvent = null;

				element.addEventListener('focus', (event) => {
					triggeredEvent = event;
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
				let triggeredEvent = null;

				document.body.appendChild(element);

				element.focus();

				element.addEventListener('focus', (event) => {
					triggeredEvent = event;
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
				let triggeredEvent = null;

				document.body.appendChild(element);
				document.body.appendChild(previousElement);

				previousElement.focus();

				previousElement.addEventListener('blur', (event) => {
					triggeredEvent = event;
				});

				element.focus();

				expect(triggeredEvent.type).toBe('blur');
				expect(triggeredEvent.bubbles).toBe(false);
				expect(triggeredEvent.composed).toBe(true);
				expect(triggeredEvent.target === previousElement).toBe(true);
			}
		});
	});
});
