import HTMLTableCaptionElement from '../../../src/nodes/html-table-caption-element/HTMLTableCaptionElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('HTMLTableCaptionElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLTableCaptionElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('caption');
	});

	describe('constructor()', () => {
		it('Should be an instanceof HTMLTableCaptionElement', () => {
			expect(element instanceof HTMLTableCaptionElement).toBe(true);
		});
	});
});
