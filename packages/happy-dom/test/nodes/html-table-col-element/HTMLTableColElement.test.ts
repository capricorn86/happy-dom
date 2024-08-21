import HTMLTableColElement from '../../../src/nodes/html-table-col-element/HTMLTableColElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('HTMLTableColElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLTableColElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('colgroup');
	});

	describe('constructor()', () => {
		it('Should be an instanceof HTMLTableColElement', () => {
			expect(element instanceof HTMLTableColElement).toBe(true);
		});
	});
});
