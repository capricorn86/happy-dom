import SVGAnimateMotionElement from '../../../src/nodes/svg-animate-motion-element/SVGAnimateMotionElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import SVGAnimationElement from '../../../src/nodes/svg-animation-element/SVGAnimationElement.js';

describe('SVGAnimateMotionElement', () => {
	let window: Window;
	let document: Document;
	let element: SVGAnimateMotionElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElementNS('http://www.w3.org/2000/svg', 'animateMotion');
	});

	describe('constructor()', () => {
		it('Should be an instanceof SVGAnimateMotionElement', () => {
			expect(element instanceof SVGAnimateMotionElement).toBe(true);
		});

		it('Should be an instanceof SVGAnimationElement', () => {
			expect(element instanceof SVGAnimationElement).toBe(true);
		});
	});
});
