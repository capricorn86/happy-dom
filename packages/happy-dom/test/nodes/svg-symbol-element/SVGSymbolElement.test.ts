import SVGSymbolElement from '../../../src/nodes/svg-symbol-element/SVGSymbolElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import BrowserWindow from '../../../src/window/BrowserWindow.js';
import SVGGraphicsElement from '../../../src/nodes/svg-graphics-element/SVGGraphicsElement.js';

describe('SVGSymbolElement', () => {
	let window: BrowserWindow;
	let document: Document;
	let element: SVGSymbolElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElementNS('http://www.w3.org/2000/svg', 'symbol');
	});

	describe('constructor()', () => {
		it('Should be an instanceof SVGSymbolElement', () => {
			expect(element instanceof SVGSymbolElement).toBe(true);
		});

		it('Should be an instanceof SVGGraphicsElement', () => {
			expect(element instanceof SVGGraphicsElement).toBe(true);
		});
	});
});
