import CustomElementRegistry from '../../src/custom-element/CustomElementRegistry';
import HTMLElement from '../../src/nodes/basic/html-element/HTMLElement';

class CustomElement extends HTMLElement {}

describe('CustomElementRegistry', () => {
	let customElements;

	beforeEach(() => {
		customElements = new CustomElementRegistry();
	});

	describe('define()', () => {
		test('Defines an HTML element and returns it with get().', () => {
			customElements.define('custom-element', CustomElement);
			expect(customElements.get('custom-element')).toBe(CustomElement);
		});

		test('Throws an error if tag name does not contain "-".', () => {
			const tagName = 'element';
			expect(() => customElements.define(tagName, CustomElement)).toThrow(
				new Error(
					"Failed to execute 'define' on 'CustomElementRegistry': \"" +
						tagName +
						'" is not a valid custom element name.'
				)
			);
		});
	});

	describe('whenDefined()', () => {
		test('Returns a promise which is fulfilled when an element is defined.', done => {
			customElements.whenDefined('custom-element').then(done);
			customElements.define('custom-element', CustomElement);
		});

		test('Resolves directly if the element is already defined.', done => {
			customElements.define('custom-element', CustomElement);
			customElements.whenDefined('custom-element').then(done);
		});
	});
});
