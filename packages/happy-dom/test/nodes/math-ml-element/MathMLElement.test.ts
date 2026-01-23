import { beforeEach, describe, it, expect } from 'vitest';
import BrowserWindow from '../../../src/window/BrowserWindow.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import MathMLElement from '../../../src/nodes/math-ml-element/MathMLElement.js';
import NamespaceURI from '../../../src/config/NamespaceURI.js';

describe('MathMLElement', () => {
	let window: BrowserWindow;
	let document: Document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	describe('constructor()', () => {
		it('Creates a MathML element with the correct namespace.', () => {
			const element = document.createElementNS(NamespaceURI.mathML, 'math');
			expect(element).toBeInstanceOf(MathMLElement);
			expect(element.namespaceURI).toBe(NamespaceURI.mathML);
		});
	});

	describe('get dataset()', () => {
		it('Returns a DOMStringMap object.', () => {
			const element = document.createElementNS(NamespaceURI.mathML, 'math');
			expect(element.dataset).toBeDefined();
			expect(typeof element.dataset).toBe('object');
		});

		it('Returns data attributes.', () => {
			const element = document.createElementNS(NamespaceURI.mathML, 'math');
			element.setAttribute('data-test', 'value');
			expect(element.dataset.test).toBe('value');
		});
	});

	describe('get style()', () => {
		it('Returns a CSSStyleDeclaration object.', () => {
			const element = document.createElementNS(NamespaceURI.mathML, 'math');
			expect(element.style).toBeInstanceOf(window.CSSStyleDeclaration);
		});

		it('Can set and get style properties.', () => {
			const element = document.createElementNS(NamespaceURI.mathML, 'math');
			element.style.color = 'red';
			expect(element.style.color).toBe('red');
		});
	});

	describe('get/set tabIndex()', () => {
		it('Returns -1 by default.', () => {
			const element = document.createElementNS(NamespaceURI.mathML, 'math');
			expect(element.tabIndex).toBe(-1);
		});

		it('Can set and get tabIndex.', () => {
			const element = document.createElementNS(NamespaceURI.mathML, 'math');
			element.tabIndex = 0;
			expect(element.tabIndex).toBe(0);
			expect(element.getAttribute('tabindex')).toBe('0');
		});

		it('Removes tabindex attribute when set to -1.', () => {
			const element = document.createElementNS(NamespaceURI.mathML, 'math');
			element.tabIndex = 0;
			element.tabIndex = -1;
			expect(element.getAttribute('tabindex')).toBe(null);
		});
	});

	describe('blur()', () => {
		it('Triggers blur event.', () => {
			const element = <MathMLElement>document.createElementNS(NamespaceURI.mathML, 'math');
			let blurred = false;
			document.body.appendChild(element);
			element.focus();
			element.addEventListener('blur', () => {
				blurred = true;
			});
			element.blur();
			expect(blurred).toBe(true);
		});
	});

	describe('focus()', () => {
		it('Triggers focus event.', () => {
			const element = <MathMLElement>document.createElementNS(NamespaceURI.mathML, 'math');
			let focused = false;
			document.body.appendChild(element);
			element.addEventListener('focus', () => {
				focused = true;
			});
			element.focus();
			expect(focused).toBe(true);
		});
	});
});
