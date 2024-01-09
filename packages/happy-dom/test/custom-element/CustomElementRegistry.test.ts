import CustomElement from '../CustomElement.js';
import CustomElementRegistry from '../../src/custom-element/CustomElementRegistry.js';
import { beforeEach, describe, it, expect } from 'vitest';
import * as PropertySymbol from '../../src/PropertySymbol.js';

describe('CustomElementRegistry', () => {
	let customElements;

	beforeEach(() => {
		customElements = new CustomElementRegistry();
		CustomElement.observedAttributesCallCount = 0;
	});

	describe('define()', () => {
		it('Defines an HTML element and returns it with get().', () => {
			customElements.define('custom-element', CustomElement);
			expect(customElements.get('custom-element')).toBe(CustomElement);
		});

		it('Defines an HTML element and sets the "extends" option to "ul".', () => {
			customElements.define('custom-element', CustomElement, {
				extends: 'ul'
			});
			expect(customElements.get('custom-element')).toBe(CustomElement);
			expect(customElements[PropertySymbol.registry]['CUSTOM-ELEMENT'].extends).toBe('ul');
		});

		it('Throws an error if tag name does not contain "-".', () => {
			const tagName = 'element';
			expect(() => customElements.define(tagName, CustomElement)).toThrow(
				new Error(
					"Failed to execute 'define' on 'CustomElementRegistry': \"" +
						tagName +
						'" is not a valid custom element name.'
				)
			);
		});

		it('Calls observed attributes and set "[PropertySymbol.observedAttributes]" as a property on the element class.', () => {
			customElements.define('custom-element', CustomElement);
			expect(CustomElement.observedAttributesCallCount).toBe(1);
			expect(CustomElement[PropertySymbol.observedAttributes]).toEqual(['key1', 'key2']);
		});
	});

	describe('get()', () => {
		it('Returns element class if the tag name has been defined..', () => {
			customElements.define('custom-element', CustomElement);
			expect(customElements.get('custom-element')).toBe(CustomElement);
		});

		it('Returns undefined if the tag name has not been defined.', () => {
			expect(customElements.get('custom-element')).toBe(undefined);
		});
	});

	describe('whenDefined()', () => {
		it('Returns a promise which is fulfilled when an element is defined.', async () => {
			await new Promise((resolve) => {
				customElements.whenDefined('custom-element').then(resolve);
				customElements.define('custom-element', CustomElement);
			});
		});

		it('Resolves directly if the element is already defined.', async () => {
			await new Promise((resolve) => {
				customElements.define('custom-element', CustomElement);
				customElements.whenDefined('custom-element').then(resolve);
			});
		});
	});
});
