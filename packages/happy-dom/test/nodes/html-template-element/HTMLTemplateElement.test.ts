import Window from '../../../src/window/Window';
import Document from '../../../src/nodes/document/Document';
import HTMLTemplateElement from '../../../src/nodes/html-template-element/HTMLTemplateElement';

describe('HTMLTemplateElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLTemplateElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = <HTMLTemplateElement>document.createElement('template');
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('InnerHTML', () => {
		const div = '<div>happy-dom is cool!</div>';
		expect(element.content.childNodes.length).toBe(0);
		element.innerHTML = div;
		expect(element.innerHTML).toBe(div);
		expect(element.content.childNodes.length).toBe(1);
		element.innerHTML = '';
		expect(element.content.childNodes.length).toBe(0);
	});
});
