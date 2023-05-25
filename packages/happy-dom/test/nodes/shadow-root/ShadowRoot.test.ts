import IHTMLElement from '../../../src/nodes/html-element/IHTMLElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import CustomElement from '../../CustomElement.js';

describe('ShadowRoot', () => {
	let window: Window;
	let document: Document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		window.customElements.define('custom-element', CustomElement);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('set innerHTML()', () => {
		it('Sets the innerHTML of the shadow root.', () => {
			const shadowRoot = document.createElement('custom-element').shadowRoot;
			shadowRoot.innerHTML = '<div attr1="value1" attr2="value2"><span>Test</span></div>';
			expect(shadowRoot.childNodes.length).toBe(1);
			expect(shadowRoot.childNodes[0].childNodes.length).toBe(1);
			expect((<IHTMLElement>shadowRoot.childNodes[0]).tagName).toBe('DIV');
			expect((<IHTMLElement>shadowRoot.childNodes[0].childNodes[0]).tagName).toBe('SPAN');
		});
	});

	describe('get innerHTML()', () => {
		it('Returns the innerHTML of the shadow root.', () => {
			const html = '<div attr1="value1" attr2="value2"><span>Test</span></div>';
			const shadowRoot = document.createElement('custom-element').shadowRoot;
			shadowRoot.innerHTML = html;
			expect(shadowRoot.innerHTML).toBe(html);
		});
	});

	describe('get activeElement()', () => {
		it('Returns the currently active element within the ShadowRoot.', () => {
			const customElement = document.createElement('custom-element');
			const shadowRoot = customElement.shadowRoot;
			const div = <IHTMLElement>document.createElement('div');
			const span = <IHTMLElement>document.createElement('span');

			document.body.appendChild(customElement);

			shadowRoot.appendChild(div);
			shadowRoot.appendChild(span);

			expect(shadowRoot.activeElement === null).toBe(true);

			div.focus();

			expect(shadowRoot.activeElement === div).toBe(true);

			span.focus();

			expect(shadowRoot.activeElement === span).toBe(true);

			span.blur();

			expect(shadowRoot.activeElement === null).toBe(true);

			document.body.appendChild(span);

			span.focus();

			expect(shadowRoot.activeElement === null).toBe(true);
		});

		it('Unsets the active element when it gets disconnected.', () => {
			const customElement = document.createElement('custom-element');
			const shadowRoot = customElement.shadowRoot;
			const div = <IHTMLElement>document.createElement('div');

			document.body.appendChild(customElement);

			shadowRoot.appendChild(div);

			expect(shadowRoot.activeElement === null).toBe(true);

			div.focus();

			expect(shadowRoot.activeElement === div).toBe(true);

			customElement.remove();

			expect(shadowRoot.activeElement === null).toBe(true);
		});
	});

	describe('toString()', () => {
		it('Returns the innerHTML of the shadow root.', () => {
			const html = '<div attr1="value1" attr2="value2"><span>Test</span></div>';
			const shadowRoot = document.createElement('custom-element').shadowRoot;
			shadowRoot.innerHTML = html;
			expect(shadowRoot.toString()).toBe(html);
		});
	});

	describe('cloneNode()', () => {
		it('Clones the value of the "mode" property when cloned.', () => {
			const shadowRoot = document.createElement('custom-element').shadowRoot;
			const clone = shadowRoot.cloneNode();
			expect(shadowRoot.mode).toBe('open');
			expect(clone.mode).toBe('open');
		});
	});
});
