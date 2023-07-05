import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import HTMLOptGroupElement from '../../../src/nodes/html-opt-group-element/HTMLOptGroupElement.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('HTMLOptGroupElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLOptGroupElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = <HTMLOptGroupElement>document.createElement('optgroup');
	});

	describe('Object.prototype.toString', () => {
		it('Returns `[object HTMLOptGroupElement]`', () => {
			expect(Object.prototype.toString.call(element)).toBe('[object HTMLOptGroupElement]');
		});
	});

	describe(`get disabled()`, () => {
		it('Returns attribute value.', () => {
			expect(element.disabled).toBe(false);
			element.setAttribute('disabled', '');
			expect(element.disabled).toBe(true);
		});
	});

	describe(`set disabled()`, () => {
		it('Sets attribute value.', () => {
			element.disabled = true;
			expect(element.getAttribute('disabled')).toBe('');
		});
	});

	describe(`get label()`, () => {
		it('Returns attribute value.', () => {
			expect(element.label).toBe('');
			element.setAttribute('label', 'value');
			expect(element.label).toBe('value');
		});
	});

	describe(`set label()`, () => {
		it('Sets attribute value.', () => {
			element.label = 'value';
			expect(element.getAttribute('label')).toBe('value');
		});
	});
});
