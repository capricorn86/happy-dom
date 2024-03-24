import HTMLDetailsElement from '../../../src/nodes/html-details-element/HTMLDetailsElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('HTMLDetailsElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLDetailsElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('details');
	});

	describe('constructor()', () => {
		it('Should be an instanceof HTMLDetailsElement', () => {
			expect(element instanceof HTMLDetailsElement).toBe(true);
		});
	});
});
