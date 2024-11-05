import SVGFEFuncBElement from '../../../src/nodes/svg-fe-func-b-element/SVGFEFuncBElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import SVGComponentTransferFunctionElement from '../../../src/nodes/svg-component-transfer-function-element/SVGComponentTransferFunctionElement.js';

describe('SVGFEFuncBElement', () => {
	let window: Window;
	let document: Document;
	let element: SVGFEFuncBElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElementNS('http://www.w3.org/2000/svg', 'feFuncB');
	});

	describe('constructor()', () => {
		it('Should be an instanceof SVGFEFuncBElement', () => {
			expect(element instanceof SVGFEFuncBElement).toBe(true);
		});

		it('Should be an instanceof SVGAnimationElement', () => {
			expect(element instanceof SVGComponentTransferFunctionElement).toBe(true);
		});
	});
});
