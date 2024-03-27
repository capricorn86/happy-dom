import HTMLTableElement from '../../../src/nodes/html-table-element/HTMLTableElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('HTMLTableElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLTableElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('table');
	});

	describe('constructor()', () => {
		it('Should be an instanceof HTMLTableElement', () => {
			expect(element instanceof HTMLTableElement).toBe(true);
		});
	});
});
