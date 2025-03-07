import HTMLDetailsElement from '../../../src/nodes/html-details-element/HTMLDetailsElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import Event from '../../../src/event/Event.js';
import MouseEvent from '../../../src/event/events/MouseEvent.js';

describe('HTMLDetailsElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLDetailsElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('details');
	});

	describe('constructor()', () => {
		it('Should be an instanceof HTMLDetailsElement', () => {
			expect(element instanceof HTMLDetailsElement).toBe(true);
		});
	});

	for (const event of ['toggle']) {
		describe(`get on${event}()`, () => {
			it('Returns the event listener.', () => {
				element.setAttribute(`on${event}`, 'window.test = 1');
				expect(element[`on${event}`]).toBeTypeOf('function');
				element[`on${event}`](new Event(event));
				expect(window['test']).toBe(1);
			});
		});

		describe(`set on${event}()`, () => {
			it('Sets the event listener.', () => {
				element[`on${event}`] = () => {
					window['test'] = 1;
				};
				element.dispatchEvent(new Event(event));
				expect(element.getAttribute(`on${event}`)).toBe(null);
				expect(window['test']).toBe(1);
			});
		});
	}

	describe('get open()', () => {
		it('Should return false by default', () => {
			expect(element.open).toBe(false);
		});

		it('Should return true if the "open" attribute has been set', () => {
			element.setAttribute('open', '');
			expect(element.open).toBe(true);
		});
	});

	describe('set open()', () => {
		it('Should set the "open" attribute', () => {
			element.open = true;
			expect(element.hasAttribute('open')).toBe(true);
			element.open = false;
			expect(element.hasAttribute('open')).toBe(false);
		});
	});

	describe('dispatchEvent()', () => {
		it('Should dispatch a "toggle" event when the "open" attribute is set', () => {
			let triggeredEvent: Event | null = null;
			element.addEventListener('toggle', (event) => (triggeredEvent = event));
			element.open = true;
			expect((<Event>(<unknown>triggeredEvent)).type).toBe('toggle');
			triggeredEvent = null;
			element.open = false;
			expect((<Event>(<unknown>triggeredEvent)).type).toBe('toggle');
		});

		it('Should not toggle the open state when a click event is dispatched directly on the details element', () => {
			element.dispatchEvent(new MouseEvent('click'));
			expect(element.open).toBe(false);
		});

		it('Should toggle the "open" attribute when a click event is dispatched on a summary element, which is a child of the details element', () => {
			const summary = document.createElement('summary');
			element.appendChild(summary);

			summary.click();
			expect(element.open).toBe(true);

			summary.click();
			expect(element.open).toBe(false);
		});
	});
});
