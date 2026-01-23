import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import SVGClipPathElement from '../../../src/nodes/svg-clip-path-element/SVGClipPathElement.js';
import SVGElement from '../../../src/nodes/svg-element/SVGElement.js';

describe('SVGClipPathElement', () => {
	let window: Window;
	let document: Document;
	let element: SVGClipPathElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
	});

	describe('constructor()', () => {
		it('Should be an instanceof SVGClipPathElement', () => {
			expect(element instanceof SVGClipPathElement).toBe(true);
		});

		it('Should be an instanceof SVGElement', () => {
			expect(element instanceof SVGElement).toBe(true);
		});
	});

	describe('get clipPathUnits()', () => {
		it('Should return an instance of SVGAnimatedEnumeration', () => {
			const clipPathUnits = element.clipPathUnits;
			expect(clipPathUnits).toBeInstanceOf(window.SVGAnimatedEnumeration);
			expect(element.clipPathUnits).toBe(clipPathUnits);
		});

		it('Should return userSpaceOnUse by default', () => {
			expect(element.clipPathUnits.animVal).toBe(window.SVGUnitTypes.SVG_UNIT_TYPE_USERSPACEONUSE);
			expect(element.clipPathUnits.baseVal).toBe(window.SVGUnitTypes.SVG_UNIT_TYPE_USERSPACEONUSE);
		});

		it('Reflects the "clipPathUnits" attribute', () => {
			element.setAttribute('clipPathUnits', 'userSpaceOnUse');

			expect(element.clipPathUnits.baseVal).toBe(window.SVGUnitTypes.SVG_UNIT_TYPE_USERSPACEONUSE);
			expect(element.clipPathUnits.animVal).toBe(window.SVGUnitTypes.SVG_UNIT_TYPE_USERSPACEONUSE);

			element.setAttribute('clipPathUnits', 'objectBoundingBox');

			expect(element.clipPathUnits.baseVal).toBe(
				window.SVGUnitTypes.SVG_UNIT_TYPE_OBJECTBOUNDINGBOX
			);
			expect(element.clipPathUnits.animVal).toBe(
				window.SVGUnitTypes.SVG_UNIT_TYPE_OBJECTBOUNDINGBOX
			);

			element.clipPathUnits.baseVal = window.SVGUnitTypes.SVG_UNIT_TYPE_USERSPACEONUSE;

			expect(element.getAttribute('clipPathUnits')).toBe('userSpaceOnUse');

			// Should do nothing
			element.clipPathUnits.animVal = window.SVGUnitTypes.SVG_UNIT_TYPE_OBJECTBOUNDINGBOX;

			expect(element.getAttribute('clipPathUnits')).toBe('userSpaceOnUse');
		});
	});
});
