import SVGAnimateTransformElement from '../../../src/nodes/svg-animate-transform-element/SVGAnimateTransformElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import SVGAnimationElement from '../../../src/nodes/svg-animation-element/SVGAnimationElement.js';

describe('SVGAnimateTransformElement', () => {
	let window: Window;
	let document: Document;
	let element: SVGAnimateTransformElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElementNS('http://www.w3.org/2000/svg', 'animateTransform');
	});

	describe('constructor()', () => {
		it('Should be an instanceof SVGAnimateTransformElement', () => {
			expect(element instanceof SVGAnimateTransformElement).toBe(true);
		});

		it('Should be an instanceof SVGAnimationElement', () => {
			expect(element instanceof SVGAnimationElement).toBe(true);
		});
	});
});
