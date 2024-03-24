import HTMLHRElement from '../../../src/nodes/html-hr-element/HTMLHRElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('HTMLHRElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLHRElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('hr');
	});

	describe('constructor()', () => {
		it('Should be an instanceof HTMLHRElement', () => {
			expect(element instanceof HTMLHRElement).toBe(true);
		});
	});
});
