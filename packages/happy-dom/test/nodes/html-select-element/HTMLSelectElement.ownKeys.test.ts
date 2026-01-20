import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import HTMLSelectElement from '../../../src/nodes/html-select-element/HTMLSelectElement.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('HTMLSelectElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLSelectElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = <HTMLSelectElement>document.createElement('select');
	});

	describe('Issue #1916: Reflect.ownKeys should return custom properties', () => {
		it('Returns option indices, custom string properties, and symbol properties.', () => {
			element.appendChild(document.createElement('option'));
			element.appendChild(document.createElement('option'));
			(<any>element).foo = 42;
			const barSymbol = Symbol('bar');
			(<any>element)[barSymbol] = 43;

			const keys = Reflect.ownKeys(element);

			expect(keys).toContain('0');
			expect(keys).toContain('1');
			expect(keys).toContain('foo');
			expect(keys).toContain(barSymbol);
		});

		it('Returns property descriptor for symbol properties.', () => {
			const barSymbol = Symbol('bar');
			(<any>element)[barSymbol] = 43;

			const descriptor = Object.getOwnPropertyDescriptor(element, barSymbol);

			expect(descriptor).toBeDefined();
			expect(descriptor!.value).toBe(43);
		});
	});
});
