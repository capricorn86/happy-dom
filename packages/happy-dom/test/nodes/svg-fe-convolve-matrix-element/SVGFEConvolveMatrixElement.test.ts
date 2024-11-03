import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import SVGFEConvolveMatrixElement from '../../../src/nodes/svg-fe-convolve-matrix-element/SVGFEConvolveMatrixElement.js';
import SVGLength from '../../../src/svg/SVGLength.js';
import SVGElement from '../../../src/nodes/svg-element/SVGElement.js';
import * as PropertySymbol from '../../../src/PropertySymbol.js';

describe('SVGFEConvolveMatrixElement', () => {
	let window: Window;
	let document: Document;
	let element: SVGFEConvolveMatrixElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElementNS('http://www.w3.org/2000/svg', 'feConvolveMatrix');
	});

	describe('constructor()', () => {
		it('Should be an instanceof SVGFEConvolveMatrixElement', () => {
			expect(element instanceof SVGFEConvolveMatrixElement).toBe(true);
		});

		it('Should be an instanceof SVGElement', () => {
			expect(element instanceof SVGElement).toBe(true);
		});
	});

	describe('get static SVG_EDGEMODE_UNKNOWN()', () => {
		it('Should return 0', () => {
			expect(SVGFEConvolveMatrixElement.SVG_EDGEMODE_UNKNOWN).toBe(0);
		});
	});

	describe('get static SVG_EDGEMODE_DUPLICATE()', () => {
		it('Should return 1', () => {
			expect(SVGFEConvolveMatrixElement.SVG_EDGEMODE_DUPLICATE).toBe(1);
		});
	});

	describe('get static SVG_EDGEMODE_WRAP()', () => {
		it('Should return 2', () => {
			expect(SVGFEConvolveMatrixElement.SVG_EDGEMODE_WRAP).toBe(2);
		});
	});

	describe('get static SVG_EDGEMODE_NONE()', () => {
		it('Should return 3', () => {
			expect(SVGFEConvolveMatrixElement.SVG_EDGEMODE_NONE).toBe(3);
		});
	});

	describe('get bias()', () => {
		it('Should return an instance of SVGAnimatedNumber', () => {
			const bias = element.bias;
			expect(bias).toBeInstanceOf(window.SVGAnimatedNumber);
			expect(element.bias).toBe(bias);
		});

		it('Reflects the "bias" attribute', () => {
			element.setAttribute('bias', '10');

			expect(element.bias.baseVal).toBe(10);
			expect(element.bias.animVal).toBe(10);

			element.bias.baseVal = 20;

			expect(element.getAttribute('bias')).toBe('20');

			// Does nothing
			element.bias.animVal = 30;

			expect(element.getAttribute('bias')).toBe('20');
		});
	});

	describe('get divisor()', () => {
		it('Should return an instance of SVGAnimatedNumber', () => {
			const divisor = element.divisor;
			expect(divisor).toBeInstanceOf(window.SVGAnimatedNumber);
			expect(element.divisor).toBe(divisor);
		});

		it('Reflects the "divisor" attribute', () => {
			element.setAttribute('divisor', '10');

			expect(element.divisor.baseVal).toBe(10);
			expect(element.divisor.animVal).toBe(10);

			element.divisor.baseVal = 20;

			expect(element.getAttribute('divisor')).toBe('20');

			// Does nothing
			element.divisor.animVal = 30;

			expect(element.getAttribute('divisor')).toBe('20');
		});
	});

	describe('get edgeMode()', () => {
		it('Should return an instance of SVGAnimatedEnumeration', () => {
			const edgeMode = element.edgeMode;
			expect(edgeMode).toBeInstanceOf(window.SVGAnimatedEnumeration);
			expect(element.edgeMode).toBe(edgeMode);
		});

		it('Should return "duplicate" as the default value', () => {
			expect(element.edgeMode.baseVal).toBe(SVGFEConvolveMatrixElement.SVG_EDGEMODE_DUPLICATE);
			expect(element.edgeMode.animVal).toBe(SVGFEConvolveMatrixElement.SVG_EDGEMODE_DUPLICATE);
		});

		for (const edgeMode of ['duplicate', 'wrap', 'none']) {
			it(`Reflects the "edgeMode" attribute for "${edgeMode}"`, () => {
				const propertyName = `SVG_EDGEMODE_${edgeMode.toUpperCase()}`;

				element.setAttribute('edgeMode', edgeMode);

				expect(element.edgeMode.baseVal).toBe(SVGFEConvolveMatrixElement[propertyName]);
				expect(element.edgeMode.animVal).toBe(SVGFEConvolveMatrixElement[propertyName]);

				element.removeAttribute('edgeMode');

				element.edgeMode.baseVal = SVGFEConvolveMatrixElement[propertyName];

				expect(element.getAttribute('edgeMode')).toBe(edgeMode);

				element.removeAttribute('edgeMode');

				// Does nothing
				element.edgeMode.animVal = SVGFEConvolveMatrixElement.SVG_EDGEMODE_NONE;

				expect(element.getAttribute('edgeMode')).toBe(null);
			});
		}
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

	describe('get in1()', () => {
		it('Should return an instance of SVGAnimatedString', () => {
			const in1 = element.in1;
			expect(in1).toBeInstanceOf(window.SVGAnimatedString);
			expect(element.in1).toBe(in1);
		});

		it('Reflects the "in" attribute', () => {
			element.setAttribute('in', 'SourceGraphic');

			expect(element.in1.baseVal).toBe('SourceGraphic');
			expect(element.in1.animVal).toBe('SourceGraphic');

			element.in1.baseVal = 'BackgroundImage';

			expect(element.getAttribute('in')).toBe('BackgroundImage');

			// Does nothing
			element.in1.animVal = 'Test';

			expect(element.getAttribute('in')).toBe('BackgroundImage');
		});
	});

	describe('get kernelMatrix()', () => {
		it('Should return an instance of SVGAnimatedNumberList', () => {
			const kernelMatrix = element.kernelMatrix;
			expect(kernelMatrix).toBeInstanceOf(window.SVGAnimatedNumberList);
			expect(element.kernelMatrix).toBe(kernelMatrix);
		});

		it('Reflects the "kernelMatrix" attribute', () => {
			element.setAttribute('kernelMatrix', '1 2.2 3 4');

			expect(element.kernelMatrix.baseVal.numberOfItems).toBe(4);
			expect(element.kernelMatrix.baseVal.getItem(0).value).toBe(1);
			expect(element.kernelMatrix.baseVal.getItem(1).value).toBe(2.2);
			expect(element.kernelMatrix.baseVal.getItem(2).value).toBe(3);
			expect(element.kernelMatrix.baseVal.getItem(3).value).toBe(4);

			expect(element.kernelMatrix.animVal.numberOfItems).toBe(4);
			expect(element.kernelMatrix.animVal.getItem(0).value).toBe(1);
			expect(element.kernelMatrix.animVal.getItem(1).value).toBe(2.2);
			expect(element.kernelMatrix.animVal.getItem(2).value).toBe(3);
			expect(element.kernelMatrix.animVal.getItem(3).value).toBe(4);

			const number = new window.SVGNumber(PropertySymbol.illegalConstructor, window);
			number.value = 5;
			element.kernelMatrix.baseVal.appendItem(number);

			expect(element.getAttribute('kernelMatrix')).toBe('1 2.2 3 4 5');

			element.setAttribute('kernelMatrix', '7 8 9');

			expect(element.kernelMatrix.baseVal.length).toBe(3);
			expect(element.kernelMatrix.baseVal[0].value).toBe(7);
			expect(element.kernelMatrix.baseVal[1].value).toBe(8);
			expect(element.kernelMatrix.baseVal[2].value).toBe(9);

			element.kernelMatrix.baseVal.clear();

			expect(element.getAttribute('kernelMatrix')).toBe('');

			const number2 = new window.SVGNumber(PropertySymbol.illegalConstructor, window);
			number2.value = 6;
			expect(() => element.kernelMatrix.animVal.appendItem(number2)).toThrow(
				new TypeError(`Failed to execute 'appendItem' on 'SVGNumberList': The object is read-only.`)
			);
		});
	});

	describe('get kernelUnitLengthX()', () => {
		it('Should return an instance of SVGAnimatedNumber', () => {
			const kernelUnitLengthX = element.kernelUnitLengthX;
			expect(kernelUnitLengthX).toBeInstanceOf(window.SVGAnimatedNumber);
			expect(element.kernelUnitLengthX).toBe(kernelUnitLengthX);
		});

		it('Reflects the "kernelUnitLengthX" attribute', () => {
			element.setAttribute('kernelUnitLengthX', '10');

			expect(element.kernelUnitLengthX.baseVal).toBe(10);
			expect(element.kernelUnitLengthX.animVal).toBe(10);

			element.kernelUnitLengthX.baseVal = 20;

			expect(element.getAttribute('kernelUnitLengthX')).toBe('20');

			// Does nothing
			element.kernelUnitLengthX.animVal = 30;

			expect(element.getAttribute('kernelUnitLengthX')).toBe('20');
		});
	});

	describe('get kernelUnitLengthY()', () => {
		it('Should return an instance of SVGAnimatedNumber', () => {
			const kernelUnitLengthY = element.kernelUnitLengthY;
			expect(kernelUnitLengthY).toBeInstanceOf(window.SVGAnimatedNumber);
			expect(element.kernelUnitLengthY).toBe(kernelUnitLengthY);
		});

		it('Reflects the "kernelUnitLengthY" attribute', () => {
			element.setAttribute('kernelUnitLengthY', '10');

			expect(element.kernelUnitLengthY.baseVal).toBe(10);
			expect(element.kernelUnitLengthY.animVal).toBe(10);

			element.kernelUnitLengthY.baseVal = 20;

			expect(element.getAttribute('kernelUnitLengthY')).toBe('20');

			// Does nothing
			element.kernelUnitLengthY.animVal = 30;

			expect(element.getAttribute('kernelUnitLengthY')).toBe('20');
		});
	});

	describe('get orderX()', () => {
		it('Should return an instance of SVGAnimatedInteger', () => {
			const orderX = element.orderX;
			expect(orderX).toBeInstanceOf(window.SVGAnimatedInteger);
			expect(element.orderX).toBe(orderX);
		});

		it('Reflects the "orderX" attribute', () => {
			element.setAttribute('orderX', '10');

			expect(element.orderX.baseVal).toBe(10);
			expect(element.orderX.animVal).toBe(10);

			element.orderX.baseVal = 20;

			expect(element.getAttribute('orderX')).toBe('20');

			element.setAttribute('orderX', '20.5');

			expect(element.orderX.baseVal).toBe(20);

			element.orderX.baseVal = 20.6;

			expect(element.getAttribute('orderX')).toBe('20');

			// Does nothing
			element.orderX.animVal = 30;

			expect(element.getAttribute('orderX')).toBe('20');
		});
	});

	describe('get orderY()', () => {
		it('Should return an instance of SVGAnimatedInteger', () => {
			const orderY = element.orderY;
			expect(orderY).toBeInstanceOf(window.SVGAnimatedInteger);
			expect(element.orderY).toBe(orderY);
		});

		it('Reflects the "orderY" attribute', () => {
			element.setAttribute('orderY', '10');

			expect(element.orderY.baseVal).toBe(10);
			expect(element.orderY.animVal).toBe(10);

			element.orderY.baseVal = 20;

			expect(element.getAttribute('orderY')).toBe('20');

			element.setAttribute('orderY', '20.5');

			expect(element.orderY.baseVal).toBe(20);

			element.orderY.baseVal = 20.6;

			expect(element.getAttribute('orderY')).toBe('20');

			// Does nothing
			element.orderY.animVal = 30;

			expect(element.getAttribute('orderY')).toBe('20');
		});
	});

	describe('get preserveAlpha()', () => {
		it('Should return an instance of SVGAnimatedBoolean', () => {
			const preserveAlpha = element.preserveAlpha;
			expect(preserveAlpha).toBeInstanceOf(window.SVGAnimatedBoolean);
			expect(element.preserveAlpha).toBe(preserveAlpha);
		});

		it('Should return "false" as the default value', () => {
			expect(element.preserveAlpha.baseVal).toBe(false);
			expect(element.preserveAlpha.animVal).toBe(false);
		});

		it('Reflects the "preserveAlpha" attribute', () => {
			element.setAttribute('preserveAlpha', 'true');

			expect(element.preserveAlpha.baseVal).toBe(true);
			expect(element.preserveAlpha.animVal).toBe(true);

			element.preserveAlpha.baseVal = false;

			expect(element.getAttribute('preserveAlpha')).toBe('false');

			// Does nothing
			element.preserveAlpha.animVal = true;

			expect(element.getAttribute('preserveAlpha')).toBe('false');
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

	describe('get targetX()', () => {
		it('Should return an instance of SVGAnimatedInteger', () => {
			const targetX = element.targetX;
			expect(targetX).toBeInstanceOf(window.SVGAnimatedInteger);
			expect(element.targetX).toBe(targetX);
		});

		it('Reflects the "targetX" attribute', () => {
			element.setAttribute('targetX', '10');

			expect(element.targetX.baseVal).toBe(10);
			expect(element.targetX.animVal).toBe(10);

			element.targetX.baseVal = 20;

			expect(element.getAttribute('targetX')).toBe('20');

			element.setAttribute('targetX', '20.5');

			expect(element.targetX.baseVal).toBe(20);

			element.targetX.baseVal = 20.6;

			expect(element.getAttribute('targetX')).toBe('20');

			// Does nothing
			element.targetX.animVal = 30;

			expect(element.getAttribute('targetX')).toBe('20');
		});
	});

	describe('get targetY()', () => {
		it('Should return an instance of SVGAnimatedInteger', () => {
			const targetY = element.targetY;
			expect(targetY).toBeInstanceOf(window.SVGAnimatedInteger);
			expect(element.targetY).toBe(targetY);
		});

		it('Reflects the "targetY" attribute', () => {
			element.setAttribute('targetY', '10');

			expect(element.targetY.baseVal).toBe(10);
			expect(element.targetY.animVal).toBe(10);

			element.targetY.baseVal = 20;

			expect(element.getAttribute('targetY')).toBe('20');

			element.setAttribute('targetY', '20.5');

			expect(element.targetY.baseVal).toBe(20);

			element.targetY.baseVal = 20.6;

			expect(element.getAttribute('targetY')).toBe('20');

			// Does nothing
			element.targetY.animVal = 30;

			expect(element.getAttribute('targetY')).toBe('20');
		});
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
