import Window from '../../../src/window/Window';
import Document from '../../../src/nodes/document/Document';
import SVGSVGElement from '../../../src/nodes/svg-element/SVGSVGElement';
import NamespaceURI from '../../../src/config/NamespaceURI';
import SVGElement from '../../../src/nodes/svg-element/SVGElement';

describe('SVGElement', () => {
	let window: Window;
	let document: Document;
	let element: SVGSVGElement;
	let line: SVGElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = <SVGSVGElement>document.createElementNS(NamespaceURI.svg, 'svg');
		line = <SVGSVGElement>document.createElementNS(NamespaceURI.svg, 'line');
	});

	describe('get ownerSVGElement()', () => {
		it('Returns svg element when append to some svg.', () => {
			element.append(line);
			const ownerSVG = line.ownerSVGElement;
			expect(ownerSVG).toBe(element);
		});

		it('Returns null when dangling.', () => {
			const ownerSVG = line.ownerSVGElement;
			expect(ownerSVG).toBe(null);
		});

		describe('get dataset()', () => {
			it('Returns a Proxy behaving like an object that can add, remove, set and get element attributes prefixed with "data-".', () => {
				element.setAttribute('test-alpha', 'value1');
				element.setAttribute('data-test-alpha', 'value2');
				element.setAttribute('test-beta', 'value3');
				element.setAttribute('data-test-beta', 'value4');

				const dataset = element.dataset;

				expect(dataset).toBe(element.dataset);
				expect(Object.keys(dataset)).toEqual(['testAlpha', 'testBeta']);
				expect(Object.values(dataset)).toEqual(['value2', 'value4']);

				dataset.testGamma = 'value5';

				expect(element.getAttribute('data-test-gamma')).toBe('value5');
				expect(Object.keys(dataset)).toEqual(['testAlpha', 'testBeta', 'testGamma']);
				expect(Object.values(dataset)).toEqual(['value2', 'value4', 'value5']);

				element.setAttribute('data-test-delta', 'value6');

				expect(dataset.testDelta).toBe('value6');
				expect(Object.keys(dataset)).toEqual(['testAlpha', 'testBeta', 'testGamma', 'testDelta']);
				expect(Object.values(dataset)).toEqual(['value2', 'value4', 'value5', 'value6']);

				delete dataset.testDelta;

				expect(element.getAttribute('data-test-delta')).toBe(null);
				expect(Object.keys(dataset)).toEqual(['testAlpha', 'testBeta', 'testGamma']);
				expect(Object.values(dataset)).toEqual(['value2', 'value4', 'value5']);
			});
		});
	});
});
