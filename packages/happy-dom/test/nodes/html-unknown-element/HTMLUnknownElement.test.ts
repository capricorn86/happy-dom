import Window from '../../../src/window/Window';
import IWindow from '../../../src/window/IWindow';
import IDocument from '../../../src/nodes/document/IDocument';
import HTMLUnknownElement from '../../../src/nodes/html-unknown-element/HTMLUnknownElement';
import CustomElement from '../../CustomElement';

describe('HTMLUnknownElement', () => {
	let window: IWindow;
	let document: IDocument;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	describe('_connectNode()', () => {
		it('Waits for a custom element to be defined and replace it when it is.', () => {
			const element = <HTMLUnknownElement>document.createElement('custom-element');
			const parent = document.createElement('div');

			parent.appendChild(element);

			expect(window.customElements._callbacks['CUSTOM-ELEMENT'].length).toBe(1);

			parent.removeChild(element);

			expect(Object.keys(window.customElements._callbacks).length).toBe(0);

			parent.appendChild(element);

			window.customElements.define('custom-element', CustomElement);

			expect(parent.children.length).toBe(1);

			expect(parent.children[0] !== element).toBe(true);
			expect(parent.children[0].shadowRoot.children.length).toBe(0);

			document.body.appendChild(parent);

			expect(parent.children[0].shadowRoot.children.length).toBe(2);
		});
	});
});
