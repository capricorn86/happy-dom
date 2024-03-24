import HTMLParagraphElement from '../../../src/nodes/html-paragraph-element/HTMLParagraphElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('HTMLParagraphElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLParagraphElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('p');
	});

	describe('constructor()', () => {
		it('Should be an instanceof HTMLParagraphElement', () => {
			expect(element instanceof HTMLParagraphElement).toBe(true);
		});
	});
});
