import SVGTitleElement from '../../../src/nodes/svg-title-element/SVGTitleElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import BrowserWindow from '../../../src/window/BrowserWindow.js';
import SVGElement from '../../../src/nodes/svg-element/SVGElement.js';

describe('SVGTitleElement', () => {
	let window: BrowserWindow;
	let document: Document;
	let element: SVGTitleElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElementNS('http://www.w3.org/2000/svg', 'title');
	});

	describe('constructor()', () => {
		it('Should be an instanceof SVGTitleElement', () => {
			expect(element instanceof SVGTitleElement).toBe(true);
		});

		it('Should be an instanceof SVGElement', () => {
			expect(element instanceof SVGElement).toBe(true);
		});
	});
});
