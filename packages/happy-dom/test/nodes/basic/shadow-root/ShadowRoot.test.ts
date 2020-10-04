import Window from '../../../../src/window/Window';
import CustomElement from '../../../CustomElement';

describe('ShadowRoot', () => {
	let window, document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		window.customElements.define('custom-element', CustomElement);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('set innerHTML()', () => {
		test('Sets the innerHTML of the shadow root.', () => {
			const shadowRoot = document.createElement('custom-element').shadowRoot;
			shadowRoot.innerHTML = '<div attr1="value1" attr2="value2"><span>Test</span></div>';
			expect(shadowRoot.childNodes.length).toBe(1);
			expect(shadowRoot.childNodes[0].childNodes.length).toBe(1);
			expect(shadowRoot.childNodes[0].tagName).toBe('DIV');
			expect(shadowRoot.childNodes[0].childNodes[0].tagName).toBe('SPAN');
		});
	});

	describe('get innerHTML()', () => {
		test('Returns the innerHTML of the shadow root.', () => {
			const html = '<div attr1="value1" attr2="value2"><span>Test</span></div>';
			const shadowRoot = document.createElement('custom-element').shadowRoot;
			shadowRoot.innerHTML = html;
			expect(shadowRoot.innerHTML).toBe(html);
		});
	});

	describe('toString()', () => {
		test('Returns the innerHTML of the shadow root.', () => {
			const html = '<div attr1="value1" attr2="value2"><span>Test</span></div>';
			const shadowRoot = document.createElement('custom-element').shadowRoot;
			shadowRoot.innerHTML = html;
			expect(shadowRoot.toString()).toBe(html);
		});
	});
});
