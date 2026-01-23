import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import SVGFETurbulenceElement from '../../../src/nodes/svg-fe-turbulence-element/SVGFETurbulenceElement.js';
import SVGElement from '../../../src/nodes/svg-element/SVGElement.js';
import SVGLength from '../../../src/svg/SVGLength.js';

describe('SVGFETurbulenceElement', () => {
	let window: Window;
	let document: Document;
	let element: SVGFETurbulenceElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElementNS('http://www.w3.org/2000/svg', 'feTurbulence');
	});

	describe('constructor()', () => {
		it('Should be an instanceof SVGFETurbulenceElement', () => {
			expect(element instanceof SVGFETurbulenceElement).toBe(true);
		});

		it('Should be an instanceof SVGElement', () => {
			expect(element instanceof SVGElement).toBe(true);
		});
	});

	describe('get static SVG_TURBULENCE_TYPE_UNKNOWN()', () => {
		it('Should return 0', () => {
			expect(SVGFETurbulenceElement.SVG_TURBULENCE_TYPE_UNKNOWN).toBe(0);
		});
	});

	describe('get static SVG_TURBULENCE_TYPE_FRACTALNOISE()', () => {
		it('Should return 1', () => {
			expect(SVGFETurbulenceElement.SVG_TURBULENCE_TYPE_FRACTALNOISE).toBe(1);
		});
	});

	describe('get static SVG_TURBULENCE_TYPE_TURBULENCE()', () => {
		it('Should return 2', () => {
			expect(SVGFETurbulenceElement.SVG_TURBULENCE_TYPE_TURBULENCE).toBe(2);
		});
	});

	describe('get static SVG_STITCHTYPE_UNKNOWN()', () => {
		it('Should return 0', () => {
			expect(SVGFETurbulenceElement.SVG_STITCHTYPE_UNKNOWN).toBe(0);
		});
	});

	describe('get static SVG_STITCHTYPE_STITCH()', () => {
		it('Should return 1', () => {
			expect(SVGFETurbulenceElement.SVG_STITCHTYPE_STITCH).toBe(1);
		});
	});

	describe('get static SVG_STITCHTYPE_NOSTITCH()', () => {
		it('Should return 2', () => {
			expect(SVGFETurbulenceElement.SVG_STITCHTYPE_NOSTITCH).toBe(2);
		});
	});

	describe('get baseFrequencyX()', () => {
		it('Should return an instance of SVGAnimatedNumber', () => {
			const baseFrequencyX = element.baseFrequencyX;
			expect(baseFrequencyX).toBeInstanceOf(window.SVGAnimatedNumber);
			expect(element.baseFrequencyX).toBe(baseFrequencyX);
		});

		it('Returns 1 by default', () => {
			expect(element.baseFrequencyX.baseVal).toBe(0);
			expect(element.baseFrequencyX.animVal).toBe(0);
		});

		it('Reflects the "baseFrequencyX" attribute', () => {
			element.setAttribute('baseFrequencyX', '2.2');

			expect(element.baseFrequencyX.baseVal).toBe(2.2);
			expect(element.baseFrequencyX.animVal).toBe(2.2);

			element.baseFrequencyX.baseVal = 3.3;

			expect(element.getAttribute('baseFrequencyX')).toBe('3.3');

			// Should do nothing
			element.baseFrequencyX.animVal = 4;

			expect(element.getAttribute('baseFrequencyX')).toBe('3.3');
		});

		it('Should return default value if attribute value is not a number', () => {
			element.setAttribute('baseFrequencyX', 'test');
			expect(element.baseFrequencyX.baseVal).toBe(0);
			expect(element.baseFrequencyX.animVal).toBe(0);
		});

		it('Should throw an error if setting a value that is not a number', () => {
			expect(() => {
				element.baseFrequencyX.baseVal = <number>(<unknown>'test');
			}).toThrow(
				new TypeError(
					`TypeError: Failed to set the 'baseVal' property on 'SVGAnimatedNumber': The provided float value is non-finite.`
				)
			);
		});
	});

	describe('get baseFrequencyY()', () => {
		it('Should return an instance of SVGAnimatedNumber', () => {
			const baseFrequencyY = element.baseFrequencyY;
			expect(baseFrequencyY).toBeInstanceOf(window.SVGAnimatedNumber);
			expect(element.baseFrequencyY).toBe(baseFrequencyY);
		});

		it('Returns 1 by default', () => {
			expect(element.baseFrequencyY.baseVal).toBe(0);
			expect(element.baseFrequencyY.animVal).toBe(0);
		});

		it('Reflects the "baseFrequencyY" attribute', () => {
			element.setAttribute('baseFrequencyY', '2.2');

			expect(element.baseFrequencyY.baseVal).toBe(2.2);
			expect(element.baseFrequencyY.animVal).toBe(2.2);

			element.baseFrequencyY.baseVal = 3.3;

			expect(element.getAttribute('baseFrequencyY')).toBe('3.3');

			// Should do nothing
			element.baseFrequencyY.animVal = 4;

			expect(element.getAttribute('baseFrequencyY')).toBe('3.3');
		});

		it('Should return default value if attribute value is not a number', () => {
			element.setAttribute('baseFrequencyY', 'test');
			expect(element.baseFrequencyY.baseVal).toBe(0);
			expect(element.baseFrequencyY.animVal).toBe(0);
		});

		it('Should throw an error if setting a value that is not a number', () => {
			expect(() => {
				element.baseFrequencyY.baseVal = <number>(<unknown>'test');
			}).toThrow(
				new TypeError(
					`TypeError: Failed to set the 'baseVal' property on 'SVGAnimatedNumber': The provided float value is non-finite.`
				)
			);
		});
	});

	describe('get height()', () => {
		it('Should return an instance of SVGAnimatedLength', () => {
			const height = element.height;
			expect(height).toBeInstanceOf(window.SVGAnimatedLength);
			expect(element.height).toBe(height);
		});

		it('Reflects the "height" attribute', () => {
			element.setAttribute('height', '10cm');

			expect(element.height.baseVal.unitType).toBe(SVGLength.SVG_LENGTHTYPE_CM);
			expect(element.height.baseVal.valueAsString).toBe('10cm');
			expect(element.height.baseVal.valueInSpecifiedUnits).toBe(10);

			expect(element.height.animVal.unitType).toBe(SVGLength.SVG_LENGTHTYPE_CM);
			expect(element.height.animVal.valueAsString).toBe('10cm');
			expect(element.height.animVal.valueInSpecifiedUnits).toBe(10);

			element.height.baseVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 20);

			expect(element.getAttribute('height')).toBe('20px');

			expect(() =>
				element.height.animVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 20)
			).toThrow(
				new TypeError(
					`Failed to execute 'newValueSpecifiedUnits' on 'SVGLength': The object is read-only.`
				)
			);
		});
	});

	describe('get numOctaves()', () => {
		it('Should return an instance of SVGAnimatedInteger', () => {
			const numOctaves = element.numOctaves;
			expect(numOctaves).toBeInstanceOf(window.SVGAnimatedInteger);
			expect(element.numOctaves).toBe(numOctaves);
		});

		it('Reflects the "numOctaves" attribute', () => {
			element.setAttribute('numOctaves', '10');

			expect(element.numOctaves.baseVal).toBe(10);
			expect(element.numOctaves.animVal).toBe(10);

			element.numOctaves.baseVal = 20;

			expect(element.getAttribute('numOctaves')).toBe('20');

			element.setAttribute('numOctaves', '20.5');

			expect(element.numOctaves.baseVal).toBe(20);

			element.numOctaves.baseVal = 20.6;

			expect(element.getAttribute('numOctaves')).toBe('20');

			// Does nothing
			element.numOctaves.animVal = 30;

			expect(element.getAttribute('numOctaves')).toBe('20');
		});
	});

	describe('get result()', () => {
		it('Should return an instance of SVGAnimatedString', () => {
			const result = element.result;
			expect(result).toBeInstanceOf(window.SVGAnimatedString);
			expect(element.result).toBe(result);
		});

		it('Reflects the "result" attribute', () => {
			element.setAttribute('result', 'SourceGraphic');

			expect(element.result.baseVal).toBe('SourceGraphic');
			expect(element.result.animVal).toBe('SourceGraphic');

			element.result.baseVal = 'BackgroundImage';

			expect(element.getAttribute('result')).toBe('BackgroundImage');

			// Does nothing
			element.result.animVal = 'Test';

			expect(element.getAttribute('result')).toBe('BackgroundImage');
		});
	});

	describe('get seed()', () => {
		it('Should return an instance of SVGAnimatedNumber', () => {
			const seed = element.seed;
			expect(seed).toBeInstanceOf(window.SVGAnimatedNumber);
			expect(element.seed).toBe(seed);
		});

		it('Returns 0 by default', () => {
			expect(element.seed.baseVal).toBe(0);
			expect(element.seed.animVal).toBe(0);
		});

		it('Reflects the "seed" attribute', () => {
			element.setAttribute('seed', '2.2');

			expect(element.seed.baseVal).toBe(2.2);
			expect(element.seed.animVal).toBe(2.2);

			element.seed.baseVal = 3.3;

			expect(element.getAttribute('seed')).toBe('3.3');

			// Should do nothing
			element.seed.animVal = 4;

			expect(element.getAttribute('seed')).toBe('3.3');
		});

		it('Should return default value if attribute value is not a number', () => {
			element.setAttribute('seed', 'test');
			expect(element.seed.baseVal).toBe(0);
			expect(element.seed.animVal).toBe(0);
		});

		it('Should throw an error if setting a value that is not a number', () => {
			expect(() => {
				element.seed.baseVal = <number>(<unknown>'test');
			}).toThrow(
				new TypeError(
					`TypeError: Failed to set the 'baseVal' property on 'SVGAnimatedNumber': The provided float value is non-finite.`
				)
			);
		});
	});

	describe('get stitchTiles()', () => {
		it('Should return an instance of SVGAnimatedEnumeration', () => {
			const stitchTiles = element.stitchTiles;
			expect(stitchTiles).toBeInstanceOf(window.SVGAnimatedEnumeration);
			expect(element.stitchTiles).toBe(stitchTiles);
		});

		it('Should return "stitch" as the default value', () => {
			expect(element.stitchTiles.baseVal).toBe(SVGFETurbulenceElement.SVG_STITCHTYPE_STITCH);
			expect(element.stitchTiles.animVal).toBe(SVGFETurbulenceElement.SVG_STITCHTYPE_STITCH);
		});

		for (const stitchTiles of ['stitch', 'noStitch']) {
			it(`Reflects the "stitchTiles" attribute for "${stitchTiles}"`, () => {
				const propertyName = `SVG_STITCHTYPE_${stitchTiles.toUpperCase().replace(/-/g, '_')}`;

				element.setAttribute('stitchTiles', stitchTiles);

				expect(element.stitchTiles.baseVal).toBe(SVGFETurbulenceElement[propertyName]);
				expect(element.stitchTiles.animVal).toBe(SVGFETurbulenceElement[propertyName]);

				element.removeAttribute('stitchTiles');

				element.stitchTiles.baseVal = SVGFETurbulenceElement[propertyName];

				expect(element.getAttribute('stitchTiles')).toBe(stitchTiles);

				element.removeAttribute('stitchTiles');

				// Does nothing
				element.stitchTiles.animVal = SVGFETurbulenceElement.SVG_STITCHTYPE_STITCH;

				expect(element.getAttribute('stitchTiles')).toBe(null);
			});
		}
	});

	describe('get type()', () => {
		it('Should return an instance of SVGAnimatedEnumeration', () => {
			const type = element.type;
			expect(type).toBeInstanceOf(window.SVGAnimatedEnumeration);
			expect(element.type).toBe(type);
		});

		it('Should return "turbulence" as the default value', () => {
			expect(element.type.baseVal).toBe(SVGFETurbulenceElement.SVG_TURBULENCE_TYPE_TURBULENCE);
			expect(element.type.animVal).toBe(SVGFETurbulenceElement.SVG_TURBULENCE_TYPE_TURBULENCE);
		});

		for (const type of ['turbulence', 'fractalNoise']) {
			it(`Reflects the "type" attribute for "${type}"`, () => {
				const propertyName = `SVG_TURBULENCE_TYPE_${type.toUpperCase().replace(/-/g, '_')}`;

				element.setAttribute('type', type);

				expect(element.type.baseVal).toBe(SVGFETurbulenceElement[propertyName]);
				expect(element.type.animVal).toBe(SVGFETurbulenceElement[propertyName]);

				element.removeAttribute('type');

				element.type.baseVal = SVGFETurbulenceElement[propertyName];

				expect(element.getAttribute('type')).toBe(type);

				element.removeAttribute('type');

				// Does nothing
				element.type.animVal = SVGFETurbulenceElement.SVG_TURBULENCE_TYPE_TURBULENCE;

				expect(element.getAttribute('type')).toBe(null);
			});
		}
	});

	describe('get width()', () => {
		it('Should return an instance of SVGAnimatedLength', () => {
			const width = element.width;
			expect(width).toBeInstanceOf(window.SVGAnimatedLength);
			expect(element.width).toBe(width);
		});

		it('Reflects the "width" attribute', () => {
			element.setAttribute('width', '10cm');

			expect(element.width.baseVal.unitType).toBe(SVGLength.SVG_LENGTHTYPE_CM);
			expect(element.width.baseVal.valueAsString).toBe('10cm');
			expect(element.width.baseVal.valueInSpecifiedUnits).toBe(10);

			expect(element.width.animVal.unitType).toBe(SVGLength.SVG_LENGTHTYPE_CM);
			expect(element.width.animVal.valueAsString).toBe('10cm');
			expect(element.width.animVal.valueInSpecifiedUnits).toBe(10);

			element.width.baseVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 20);

			expect(element.getAttribute('width')).toBe('20px');

			expect(() =>
				element.width.animVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 20)
			).toThrow(
				new TypeError(
					`Failed to execute 'newValueSpecifiedUnits' on 'SVGLength': The object is read-only.`
				)
			);
		});
	});

	describe('get x()', () => {
		it('Should return an instance of SVGAnimatedLength', () => {
			const x = element.x;
			expect(x).toBeInstanceOf(window.SVGAnimatedLength);
			expect(element.x).toBe(x);
		});

		it('Reflects the "x" attribute', () => {
			element.setAttribute('x', '10cm');

			expect(element.x.baseVal.unitType).toBe(SVGLength.SVG_LENGTHTYPE_CM);
			expect(element.x.baseVal.valueAsString).toBe('10cm');
			expect(element.x.baseVal.valueInSpecifiedUnits).toBe(10);

			expect(element.x.animVal.unitType).toBe(SVGLength.SVG_LENGTHTYPE_CM);
			expect(element.x.animVal.valueAsString).toBe('10cm');
			expect(element.x.animVal.valueInSpecifiedUnits).toBe(10);

			element.x.baseVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 20);

			expect(element.getAttribute('x')).toBe('20px');

			expect(() =>
				element.x.animVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 20)
			).toThrow(
				new TypeError(
					`Failed to execute 'newValueSpecifiedUnits' on 'SVGLength': The object is read-only.`
				)
			);
		});
	});

	describe('get y()', () => {
		it('Should return an instance of SVGAnimatedLength', () => {
			const y = element.y;
			expect(y).toBeInstanceOf(window.SVGAnimatedLength);
			expect(element.y).toBe(y);
		});

		it('Reflects the "y" attribute', () => {
			element.setAttribute('y', '10cm');

			expect(element.y.baseVal.unitType).toBe(SVGLength.SVG_LENGTHTYPE_CM);
			expect(element.y.baseVal.valueAsString).toBe('10cm');
			expect(element.y.baseVal.valueInSpecifiedUnits).toBe(10);

			expect(element.y.animVal.unitType).toBe(SVGLength.SVG_LENGTHTYPE_CM);
			expect(element.y.animVal.valueAsString).toBe('10cm');
			expect(element.y.animVal.valueInSpecifiedUnits).toBe(10);

			element.y.baseVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 20);

			expect(element.getAttribute('y')).toBe('20px');

			expect(() =>
				element.y.animVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 20)
			).toThrow(
				new TypeError(
					`Failed to execute 'newValueSpecifiedUnits' on 'SVGLength': The object is read-only.`
				)
			);
		});
	});
});
