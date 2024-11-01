import SVGDefsElement from '../../../src/nodes/svg-defs-element/SVGDefsElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import SVGGraphicsElement from '../../../src/nodes/svg-graphics-element/SVGGraphicsElement.js';

describe('SVGDefsElement', () => {
	let window: Window;
	let document: Document;
	let element: SVGDefsElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
	});

	describe('constructor()', () => {
		it('Should be an instanceof SVGDefsElement', () => {
			expect(element instanceof SVGDefsElement).toBe(true);
		});

		it('Should be an instanceof SVGGraphicsElement', () => {
			expect(element instanceof SVGGraphicsElement).toBe(true);
		});
	});
});
