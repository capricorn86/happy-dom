import HTMLFieldSetElement from '../../../src/nodes/html-field-set-element/HTMLFieldSetElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('HTMLFieldSetElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLFieldSetElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('fieldset');
	});

	describe('constructor()', () => {
		it('Should be an instanceof HTMLFieldSetElement', () => {
			expect(element instanceof HTMLFieldSetElement).toBe(true);
		});
	});
});
