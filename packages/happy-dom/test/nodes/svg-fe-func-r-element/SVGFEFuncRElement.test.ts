import SVGFEFuncRElement from '../../../src/nodes/svg-fe-func-r-element/SVGFEFuncRElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import SVGComponentTransferFunctionElement from '../../../src/nodes/svg-component-transfer-function-element/SVGComponentTransferFunctionElement.js';

describe('SVGFEFuncRElement', () => {
	let window: Window;
	let document: Document;
	let element: SVGFEFuncRElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElementNS('http://www.w3.org/2000/svg', 'feFuncR');
	});

	describe('constructor()', () => {
		it('Should be an instanceof SVGFEFuncRElement', () => {
			expect(element instanceof SVGFEFuncRElement).toBe(true);
		});

		it('Should be an instanceof SVGAnimationElement', () => {
			expect(element instanceof SVGComponentTransferFunctionElement).toBe(true);
		});
	});
});
