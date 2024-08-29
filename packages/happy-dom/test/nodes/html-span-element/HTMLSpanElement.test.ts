import HTMLSpanElement from '../../../src/nodes/html-span-element/HTMLSpanElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('HTMLSpanElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLSpanElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('span');
	});

	describe('constructor()', () => {
		it('Should be an instanceof HTMLSpanElement', () => {
			expect(element instanceof HTMLSpanElement).toBe(true);
		});
	});
});
