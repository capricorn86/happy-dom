import SVGAnimateElement from '../../../src/nodes/svg-animate-element/SVGAnimateElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import SVGAnimationElement from '../../../src/nodes/svg-animation-element/SVGAnimationElement.js';

describe('SVGAnimateElement', () => {
	let window: Window;
	let document: Document;
	let element: SVGAnimateElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
	});

	describe('constructor()', () => {
		it('Should be an instanceof SVGAnimateElement', () => {
			expect(element instanceof SVGAnimateElement).toBe(true);
		});

		it('Should be an instanceof SVGAnimationElement', () => {
			expect(element instanceof SVGAnimationElement).toBe(true);
		});
	});
});
