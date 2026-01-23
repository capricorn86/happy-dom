import SVGPathElement from '../../../src/nodes/svg-path-element/SVGPathElement.js';
import Window from '../../../src/window/Window.js';
import BrowserWindow from '../../../src/window/BrowserWindow.js';
import { beforeEach, describe, it, expect } from 'vitest';
import SVGGeometryElement from '../../../src/nodes/svg-geometry-element/SVGGeometryElement.js';
import Document from '../../../src/nodes/document/Document.js';

describe('SVGPathElement', () => {
	let window: BrowserWindow;
	let document: Document;
	let element: SVGPathElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	});

	describe('constructor()', () => {
		it('Should be an instanceof SVGPathElement', () => {
			expect(element instanceof SVGPathElement).toBe(true);
		});

		it('Should be an instanceof SVGGeometryElement', () => {
			expect(element instanceof SVGGeometryElement).toBe(true);
		});
	});
});
