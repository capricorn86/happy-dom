import SVGFEFuncAElement from '../../../src/nodes/svg-fe-func-a-element/SVGFEFuncAElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import SVGComponentTransferFunctionElement from '../../../src/nodes/svg-component-transfer-function-element/SVGComponentTransferFunctionElement.js';

describe('SVGFEFuncAElement', () => {
	let window: Window;
	let document: Document;
	let element: SVGFEFuncAElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElementNS('http://www.w3.org/2000/svg', 'feFuncA');
	});

	describe('constructor()', () => {
		it('Should be an instanceof SVGFEFuncAElement', () => {
			expect(element instanceof SVGFEFuncAElement).toBe(true);
		});

		it('Should be an instanceof SVGAnimationElement', () => {
			expect(element instanceof SVGComponentTransferFunctionElement).toBe(true);
		});
	});
});
