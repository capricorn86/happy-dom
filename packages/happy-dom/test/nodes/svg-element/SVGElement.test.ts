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
	});
});
