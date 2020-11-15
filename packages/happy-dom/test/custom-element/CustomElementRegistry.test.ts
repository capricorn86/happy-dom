import CustomElement from '../CustomElement';
import CustomElementRegistry from '../../src/custom-element/CustomElementRegistry';

describe('CustomElementRegistry', () => {
	let customElements;

	beforeEach(() => {
		customElements = new CustomElementRegistry();
		CustomElement.observedAttributesCallCount = 0;
	});

	describe('define()', () => {
		test('Defines an HTML element and returns it with get().', () => {
			customElements.define('custom-element', CustomElement);
			expect(customElements.get('custom-element')).toBe(CustomElement);
		});

		test('Defines an HTML element and sets the "extends" option to "ul".', () => {
			customElements.define('custom-element', CustomElement, {
				extends: 'ul'
			});
			expect(customElements.get('custom-element')).toBe(CustomElement);
			expect(customElements._registry['custom-element'].extends).toBe('ul');
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

		test('Calls observed attributes and set _observedAttributes as a property on the element class.', () => {
			customElements.define('custom-element', CustomElement);
			expect(CustomElement.observedAttributesCallCount).toBe(1);
			expect(CustomElement._observedAttributes).toEqual(['key1', 'key2']);
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
