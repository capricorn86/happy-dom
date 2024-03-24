import HTMLLIElement from '../../../src/nodes/html-li-element/HTMLLIElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('HTMLLIElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLLIElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('li');
	});

	describe('constructor()', () => {
		it('Should be an instanceof HTMLLIElement', () => {
			expect(element instanceof HTMLLIElement).toBe(true);
		});
	});
});
