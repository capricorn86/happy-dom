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

		it('Should only dispatch a close event when dialog wasnt already closed', () => {
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

		it('Should close a modal on pressing ESC key', () => {
			element.showModal();
			expect(element.open).toBe(true);
			document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
			expect(element.open).toBe(false);
			expect(element.getAttribute('open')).toBe(null);
		});

		it('Should not close a dialog on pressing ESC key', () => {
			element.show();
			expect(element.open).toBe(true);
			document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
			expect(element.open).toBe(true);
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
