import HTMLTableCellElement from '../../../src/nodes/html-table-cell-element/HTMLTableCellElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('HTMLTableCellElement', () => {
	let window: Window;
	let document: Document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	describe('constructor()', () => {
		it('Should be an instanceof HTMLTableCellElement', () => {
			const element = document.createElement('th');
			expect(element instanceof HTMLTableCellElement).toBe(true);
			const element2 = document.createElement('td');
			expect(element2 instanceof HTMLTableCellElement).toBe(true);
		});
	});
});
