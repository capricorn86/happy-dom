import Window from '../../../src/window/Window.js';
import type Document from '../../../src/nodes/document/Document.js';
import type HTMLSelectElement from '../../../src/nodes/html-select-element/HTMLSelectElement.js';
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

	describe('Object.keys()', () => {
		it('Returns an empty array when there are no options.', () => {
			expect(Object.keys(element)).toEqual([]);
		});

		it('Returns only option indices when no custom properties are set.', () => {
			element.appendChild(document.createElement('option'));
			element.appendChild(document.createElement('option'));

			expect(Object.keys(element)).toEqual(['0', '1']);
		});

		it('Returns option indices and custom string properties.', () => {
			element.appendChild(document.createElement('option'));
			element.appendChild(document.createElement('option'));
			(<any>element).foo = 42;

			expect(Object.keys(element)).toEqual(['0', '1', 'foo']);
		});

		it('Does not include a deleted custom property.', () => {
			element.appendChild(document.createElement('option'));
			(<any>element).foo = 42;

			expect(Object.keys(element)).toEqual(['0', 'foo']);

			delete (<any>element).foo;

			expect(Object.keys(element)).toEqual(['0']);
		});
	});

	describe('Object.getOwnPropertySymbols()', () => {
		it('Returns custom symbol properties.', () => {
			const barSymbol = Symbol('bar');
			(<any>element)[barSymbol] = 43;

			expect(Object.getOwnPropertySymbols(element)).toEqual([barSymbol]);
		});
	});

	describe('Object.getOwnPropertyDescriptor()', () => {
		it('Returns descriptor for option index properties.', () => {
			element.appendChild(document.createElement('option'));

			const descriptor = Object.getOwnPropertyDescriptor(element, '0');

			expect(descriptor).toBeDefined();
			expect(descriptor!.value).toBe(element.options[0]);
			expect(descriptor!.enumerable).toBe(true);
			expect(descriptor!.configurable).toBe(true);
		});

		it('Returns descriptor for custom symbol properties.', () => {
			const barSymbol = Symbol('bar');
			(<any>element)[barSymbol] = 43;

			const descriptor = Object.getOwnPropertyDescriptor(element, barSymbol);

			expect(descriptor).toBeDefined();
			expect(descriptor!.value).toBe(43);
		});
	});
});
