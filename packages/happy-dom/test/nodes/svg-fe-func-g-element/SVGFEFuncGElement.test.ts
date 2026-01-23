import SVGFEFuncGElement from '../../../src/nodes/svg-fe-func-g-element/SVGFEFuncGElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import SVGComponentTransferFunctionElement from '../../../src/nodes/svg-component-transfer-function-element/SVGComponentTransferFunctionElement.js';

describe('SVGFEFuncGElement', () => {
	let window: Window;
	let document: Document;
	let element: SVGFEFuncGElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElementNS('http://www.w3.org/2000/svg', 'feFuncG');
	});

	describe('constructor()', () => {
		it('Should be an instanceof SVGFEFuncGElement', () => {
			expect(element instanceof SVGFEFuncGElement).toBe(true);
		});

		it('Should be an instanceof SVGAnimationElement', () => {
			expect(element instanceof SVGComponentTransferFunctionElement).toBe(true);
		});
	});
});
