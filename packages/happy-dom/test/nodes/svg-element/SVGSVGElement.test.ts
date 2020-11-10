import Window from '../../../src/window/Window';
import Document from '../../../src/nodes/document/Document';
import SVGSVGElement from '../../../src/nodes/svg-element/SVGSVGElement';
import NamespaceURI from '../../../src/config/NamespaceURI';

const PROPERTIES = {
	preserveAspectRatio: 'preserveAspectRatio',
	width: 'width',
	height: 'height',
	x: 'x',
	y: 'y',
	contentScriptType: 'contentScriptType',
	currentScale: 10
};

describe('SVGSVGElement', () => {
	let window: Window;
	let document: Document;
	let element: SVGSVGElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = <SVGSVGElement>document.createElementNS(NamespaceURI.svg, 'svg');
	});

	describe('removeAttributeNode()', () => {
		test('Sets properties to its default value.', () => {
			const newSVG = <SVGSVGElement>document.createElementNS(NamespaceURI.svg, 'svg');

			for (const key of Object.keys(PROPERTIES)) {
				element.setAttribute(key, PROPERTIES[key]);
				element.removeAttribute(key);
				expect(element[key]).toBe(newSVG[key]);
			}
		});
	});

	describe('setAttributeNode()', () => {
		test('Sets attributes as properties.', () => {
			for (const key of Object.keys(PROPERTIES)) {
				element.setAttribute(key, PROPERTIES[key]);
				expect(element[key]).toBe(PROPERTIES[key]);
			}
		});
	});
});
