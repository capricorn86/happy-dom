import HTMLMenuElement from '../../../src/nodes/html-menu-element/HTMLMenuElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('HTMLMenuElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLMenuElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('menu');
	});

	describe('constructor()', () => {
		it('Should be an instanceof HTMLMenuElement', () => {
			expect(element instanceof HTMLMenuElement).toBe(true);
		});
	});
});
