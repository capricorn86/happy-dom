import HTMLDListElement from '../../../src/nodes/html-d-list-element/HTMLDListElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('HTMLDListElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLDListElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('dl');
	});

	describe('constructor()', () => {
		it('Should be an instanceof HTMLDListElement', () => {
			expect(element instanceof HTMLDListElement).toBe(true);
		});
	});
});
