import CustomElement from '../CustomElement.js';
import CustomElementRegistry from '../../src/custom-element/CustomElementRegistry.js';
import Window from '../../src/window/Window.js';
import Document from '../../src/nodes/document/Document.js';
import DOMException from '../../src/exception/DOMException.js';
import { beforeEach, describe, it, expect } from 'vitest';
import * as PropertySymbol from '../../src/PropertySymbol.js';
import NamespaceURI from '../../src/config/NamespaceURI.js';
import ICustomElementDefinition from '../../src/custom-element/ICustomElementDefinition.js';

describe('CustomElementRegistry', () => {
	let customElements;
	let window: Window;
	let document: Document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		customElements = new CustomElementRegistry(window);
		CustomElement.observedAttributesCallCount = 0;
	});

	describe('isValidCustomElementName()', () => {
		it('Validate custom elements tag name.', () => {});
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
			expect(customElements[PropertySymbol.registry].get('custom-element').extends).toBe('ul');
		});

		it('Can construct CustomElement instance using "new".', () => {
			customElements.define('custom-element', CustomElement);

			const customElement = new CustomElement();

			expect(customElement).toBeInstanceOf(CustomElement);
			expect(customElement.ownerDocument).toBe(document);
			expect(customElement.localName).toBe('custom-element');
			expect(customElement.tagName).toBe('CUSTOM-ELEMENT');
			expect(customElement.namespaceURI).toBe(NamespaceURI.html);

			const container = document.createElement('div');
			container.appendChild(customElement);
			expect(container.innerHTML).toBe('<custom-element></custom-element>');
		});

		it('Throws an error if tag name does not contain "-".', () => {
			expect(() => customElements.define('element', CustomElement)).toThrow(
				new DOMException(
					`Failed to execute 'define' on 'CustomElementRegistry': "element" is not a valid custom element name`
				)
			);
		});

		it('Throws an error if already defined.', () => {
			customElements.define('custom-element', CustomElement);
			expect(() => customElements.define('custom-element', CustomElement)).toThrow(
				new DOMException(
					`Failed to execute 'define' on 'CustomElementRegistry': the name "custom-element" has already been used with this registry`
				)
			);
		});

		it('Throws an error if already registered under a different tag name.', () => {
			customElements.define('custom-element', CustomElement);
			expect(() => customElements.define('custom-element2', CustomElement)).toThrow(
				new DOMException(
					`Failed to execute 'define' on 'CustomElementRegistry': this constructor has already been used with this registry`
				)
			);
		});

		for (const name of ['2a-b', 'A-B', 'aB-c', 'ab', 'font-face']) {
			it(`Throws an error when using the invalid custom element name "${name}".`, () => {
				expect(() => customElements.define(name, CustomElement)).toThrow(
					new DOMException(
						`Failed to execute 'define' on 'CustomElementRegistry': "${name}" is not a valid custom element name`
					)
				);
			});
		}

		for (const name of ['a-b', 'a2-b', 'a-\u00d9', 'a_b.c-d', 'a-Öa']) {
			it(`Allows using the valid name "${name}".`, () => {
				expect(() => customElements.define(name, CustomElement)).not.toThrow();
			});
		}

		it('Calls observed attributes only once and stores a defintion in the registry.', () => {
			customElements.define('custom-element', CustomElement);
			expect(CustomElement.observedAttributesCallCount).toBe(1);

			const definition = <ICustomElementDefinition>(
				customElements[PropertySymbol.registry].get('custom-element')
			);
			const observedAttributes: string[] = [];

			for (const attribute of definition.observedAttributes.values()) {
				observedAttributes.push(attribute);
			}

			expect(observedAttributes).toEqual(['key1', 'key2']);

			const element = new CustomElement();

			expect(definition.livecycleCallbacks.connectedCallback).toBe(element.connectedCallback);
			expect(definition.livecycleCallbacks.disconnectedCallback).toBe(element.disconnectedCallback);
			expect(definition.livecycleCallbacks.attributeChangedCallback).toBe(
				element.attributeChangedCallback
			);
		});

		it('Non-ASCII capital letter in localName.', () => {
			customElements.define('a-Öa', CustomElement);
			expect(customElements.get('a-Öa')).toBe(CustomElement);
		});
	});

	describe('get()', () => {
		it('Returns element class if the tag name has been defined.', () => {
			customElements.define('custom-element', CustomElement);
			expect(customElements.get('custom-element')).toBe(CustomElement);
		});

		it('Returns undefined if the tag name has not been defined.', () => {
			expect(customElements.get('custom-element')).toBe(undefined);
		});

		it('Case sensitivity of get().', () => {
			customElements.define('custom-element', CustomElement);
			expect(customElements.get('CUSTOM-ELEMENT')).toBe(undefined);
		});
	});

	describe('whenDefined()', () => {
		it('Throws an error if tag name looks invalid.', async () => {
			const tagName = 'element';
			expect(async () => await customElements.whenDefined(tagName)).rejects.toThrow();
		});

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

	describe('getName()', () => {
		it('Returns null if no tagName is found in the registry for element class', () => {
			expect(customElements.getName(CustomElement)).toBe(null);
		});

		it('Returns Tag name if element class is found in registry', () => {
			customElements.define('custom-element', CustomElement);
			expect(customElements.getName(CustomElement)).toMatch('custom-element');
		});
	});
});
