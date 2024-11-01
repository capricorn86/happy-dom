import SVGViewElement from '../../../src/nodes/svg-view-element/SVGViewElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import BrowserWindow from '../../../src/window/BrowserWindow.js';
import SVGElement from '../../../src/nodes/svg-element/SVGElement.js';

describe('SVGViewElement', () => {
	let window: BrowserWindow;
	let document: Document;
	let element: SVGViewElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElementNS('http://www.w3.org/2000/svg', 'view');
	});

	describe('constructor()', () => {
		it('Should be an instanceof SVGViewElement', () => {
			expect(element instanceof SVGViewElement).toBe(true);
		});

		it('Should be an instanceof SVGElement', () => {
			expect(element instanceof SVGElement).toBe(true);
		});
	});
});
