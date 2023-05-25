import Event from '../../../src/event/Event.js';
import IHTMLDialogElement from '../../../src/nodes/html-dialog-element/IHTMLDialogElement.js';
import Window from '../../../src/window/Window.js';
import IWindow from '../../../src/window/IWindow.js';
import IDocument from '../../../src/nodes/document/IDocument.js';

describe('HTMLDialogElement', () => {
	let window: IWindow;
	let document: IDocument;
	let element: IHTMLDialogElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = <IHTMLDialogElement>document.createElement('dialog');
	});

	describe('Object.prototype.toString', () => {
		it('Returns `[object HTMLDialogElement]`', () => {
			expect(Object.prototype.toString.call(element)).toBe('[object HTMLDialogElement]');
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
			expect(element.getAttributeNS(null, 'open')).toBe(null);
		});

		it('Should be possible to close an open modal dialog', () => {
			element.showModal();
			element.close();
			expect(element.open).toBe(false);
			expect(element.getAttributeNS(null, 'open')).toBe(null);
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
			let dispatched: Event = null;
			element.addEventListener('close', (event: Event) => (dispatched = event));
			element.show();
			element.close();
			expect(dispatched.cancelable).toBe(false);
			expect(dispatched.bubbles).toBe(false);
		});

		it('Should dispatch a close event when closing a modal', () => {
			let dispatched: Event = null;
			element.addEventListener('close', (event: Event) => (dispatched = event));
			element.showModal();
			element.close();
			expect(dispatched.cancelable).toBe(false);
			expect(dispatched.bubbles).toBe(false);
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
