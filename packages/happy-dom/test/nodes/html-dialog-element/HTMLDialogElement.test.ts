import Event from '../../../src/event/Event.js';
import HTMLDialogElement from '../../../src/nodes/html-dialog-element/HTMLDialogElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import KeyboardEvent from '../../../src/event/events/KeyboardEvent.js';

describe('HTMLDialogElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLDialogElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = <HTMLDialogElement>document.createElement('dialog');
	});

	describe('Object.prototype.toString', () => {
		it('Returns `[object HTMLDialogElement]`', () => {
			expect(Object.prototype.toString.call(element)).toBe('[object HTMLDialogElement]');
		});
	});

	for (const event of ['cancel', 'close']) {
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

	describe('set open()', () => {
		it('Should set the open state', () => {
			element.open = true;
			expect(element.open).toBe(true);
			element.open = false;
			expect(element.open).toBe(false);
		});
	});

	describe('get open()', () => {
		it('Should be closed by default', () => {
			expect(element.open).toBe(false);
		});

		it('Should be open when show has been called', () => {
			element.show();
			expect(element.open).toBe(true);
		});

		it('Should be open when showModal has been called', () => {
			element.showModal();
			expect(element.open).toBe(true);
		});
	});

	describe('get returnValue()', () => {
		it('Should be empty string by default', () => {
			expect(element.returnValue).toBe('');
		});

		it('Should be set when close has been called with a return value', () => {
			element.close('foo');
			expect(element.returnValue).toBe('foo');
		});
	});

	describe('set returnValue()', () => {
		it('Should be possible to set manually', () => {
			element.returnValue = 'foo';
			expect(element.returnValue).toBe('foo');
			element.returnValue = <string>(<unknown>undefined);
			expect(element.returnValue).toBe('undefined');
		});
	});

	describe('close()', () => {
		it('Should be possible to close an open dialog', () => {
			element.show();
			element.close();
			expect(element.open).toBe(false);
			expect(element.getAttribute('open')).toBe(null);
		});

		it('Should be possible to close an open modal dialog', () => {
			element.showModal();
			element.close();
			expect(element.open).toBe(false);
			expect(element.getAttribute('open')).toBe(null);
		});

		it('Should be possible to close the dialog with a return value', () => {
			element.show();
			element.close('foo');
			expect(element.returnValue).toBe('foo');
			element.show();
			element.close(undefined);
			expect(element.returnValue).toBe('');
			element.show();
			element.close(<string>(<unknown>null));
			expect(element.returnValue).toBe('null');
		});

		it('Should be possible to close the modal dialog with a return value', () => {
			element.showModal();
			element.close('foo');
			expect(element.returnValue).toBe('foo');
		});

		it('Should dispatch a close event', () => {
			let dispatched: Event | null = null;
			element.addEventListener('close', (event: Event) => (dispatched = event));
			element.show();
			element.close();
			expect((<Event>(<unknown>dispatched)).cancelable).toBe(false);
			expect((<Event>(<unknown>dispatched)).bubbles).toBe(false);
		});

		it("Should only dispatch a close event when dialog wasn't already closed", () => {
			let dispatched: Event | null = null;
			element.addEventListener('close', (event: Event) => (dispatched = event));
			element.close();
			expect(dispatched).toBe(null);
		});

		it('Should dispatch a close event when closing a modal', () => {
			let dispatched: Event | null = null;
			element.addEventListener('close', (event: Event) => (dispatched = event));
			element.showModal();
			element.close();
			expect((<Event>(<unknown>dispatched)).cancelable).toBe(false);
			expect((<Event>(<unknown>dispatched)).bubbles).toBe(false);
		});
	});

	describe('showModal()', () => {
		it('Should be possible to show a modal dialog', () => {
			element.showModal();
			expect(element.open).toBe(true);
			expect(element.getAttributeNS(null, 'open')).toBe('');
		});
	});

	describe('show()', () => {
		it('Should be possible to show a dialog', () => {
			element.show();
			expect(element.open).toBe(true);
			expect(element.getAttributeNS(null, 'open')).toBe('');
		});
	});
});
