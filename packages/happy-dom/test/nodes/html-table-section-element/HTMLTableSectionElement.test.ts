import HTMLTableSectionElement from '../../../src/nodes/html-table-section-element/HTMLTableSectionElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('HTMLTableSectionElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLTableSectionElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('thead');
	});

	describe('constructor()', () => {
		it('Should be an instanceof HTMLTableSectionElement', () => {
			expect(element instanceof HTMLTableSectionElement).toBe(true);
		});
	});
});
