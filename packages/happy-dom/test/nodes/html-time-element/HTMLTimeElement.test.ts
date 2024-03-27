import HTMLTimeElement from '../../../src/nodes/html-time-element/HTMLTimeElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('HTMLTimeElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLTimeElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('time');
	});

	describe('constructor()', () => {
		it('Should be an instanceof HTMLTimeElement', () => {
			expect(element instanceof HTMLTimeElement).toBe(true);
		});
	});
});
