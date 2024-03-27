import HTMLDataElement from '../../../src/nodes/html-data-element/HTMLDataElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('HTMLDataElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLDataElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('data');
	});

	describe('constructor()', () => {
		it('Should be an instanceof HTMLDataElement', () => {
			expect(element instanceof HTMLDataElement).toBe(true);
		});
	});
});
