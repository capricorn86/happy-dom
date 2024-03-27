import HTMLBRElement from '../../../src/nodes/html-br-element/HTMLBRElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('HTMLBRElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLBRElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('br');
	});

	describe('constructor()', () => {
		it('Should be an instanceof HTMLBRElement', () => {
			expect(element instanceof HTMLBRElement).toBe(true);
		});
	});
});
