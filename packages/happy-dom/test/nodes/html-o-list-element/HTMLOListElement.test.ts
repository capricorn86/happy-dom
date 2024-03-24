import HTMLOListElement from '../../../src/nodes/html-o-list-element/HTMLOListElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('HTMLOListElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLOListElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('ol');
	});

	describe('constructor()', () => {
		it('Should be an instanceof HTMLOListElement', () => {
			expect(element instanceof HTMLOListElement).toBe(true);
		});
	});
});
