import HTMLDataListElement from '../../../src/nodes/html-data-list-element/HTMLDataListElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('HTMLDataListElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLDataListElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('datalist');
	});

	describe('constructor()', () => {
		it('Should be an instanceof HTMLDataListElement', () => {
			expect(element instanceof HTMLDataListElement).toBe(true);
		});
	});
});
