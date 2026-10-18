import Window from '../../../src/window/Window.js';
import type Document from '../../../src/nodes/document/Document.js';
import type HTMLTemplateElement from '../../../src/nodes/html-template-element/HTMLTemplateElement.js';
import HTMLSerializer from '../../../src/html-serializer/HTMLSerializer.js';
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import CustomElement from '../../CustomElement.js';
import type Element from '../../../src/nodes/element/Element.js';

describe('HTMLTemplateElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLTemplateElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = <HTMLTemplateElement>document.createElement('template');
	});

	afterEach(() => {
		CustomElement.serializable = false;
		vi.restoreAllMocks();
	});

	describe('Object.prototype.toString', () => {
		it('Returns `[object HTMLTemplateElement]`', () => {
			expect(Object.prototype.toString.call(element)).toBe('[object HTMLTemplateElement]');
		});
	});

	describe('get content()', () => {
		it('Contains the children of a parsed <template>.', () => {
			document.body.innerHTML =
				'<template><div>Test</div><template><b>Nested</b></template></template>';

			const template = <HTMLTemplateElement>document.body.children[0];
			const nested = <HTMLTemplateElement>template.content.children[1];

			expect(template.childNodes.length).toBe(0);
			expect(template.content.childNodes.length).toBe(2);
			expect(nested.childNodes.length).toBe(0);
			expect(nested.content.children[0].outerHTML).toBe('<b>Nested</b>');
			expect(document.body.innerHTML).toBe(
				'<template><div>Test</div><template><b>Nested</b></template></template>'
			);
		});

		it('Contains the children of a <template> parsed as XHTML.', () => {
			const xhtml = new window.DOMParser().parseFromString(
				'<html xmlns="http://www.w3.org/1999/xhtml"><body><template><p>Test</p></template></body></html>',
				'application/xhtml+xml'
			);
			const template = <HTMLTemplateElement>xhtml.querySelector('template');

			expect(template.childNodes.length).toBe(0);
			expect(template.content.childNodes.length).toBe(1);
			expect((<Element>template.content.childNodes[0]).localName).toBe('p');
		});
	});

	describe('get innerHTML()', () => {
		it('Returns inner HTML of the "content" node.', () => {
			const div = document.createElement('div');

			div.innerHTML = 'Test';

			expect(element.content.childNodes.length).toBe(0);
			expect(element.innerHTML).toBe('');

			element.content.appendChild(div);

			expect(element.childNodes.length).toBe(0);
			expect(element.innerHTML).toBe('<div>Test</div>');
			expect(new HTMLSerializer().serializeToString(element.content)).toBe('<div>Test</div>');

			element.content.removeChild(div);

			expect(element.content.childNodes.length).toBe(0);
			expect(element.innerHTML).toBe('');
		});
	});

	describe('set innerHTML()', () => {
		it('Serializes the HTML into nodes and appends them to the "content" node.', () => {
			expect(element.content.childNodes.length).toBe(0);
			expect(element.innerHTML).toBe('');

			element.innerHTML = '<div>Test</div>';

			expect(element.childNodes.length).toBe(0);
			expect(element.innerHTML).toBe('<div>Test</div>');
			expect(new HTMLSerializer().serializeToString(element.content)).toBe('<div>Test</div>');

			element.innerHTML = '';

			expect(element.content.childNodes.length).toBe(0);
			expect(element.innerHTML).toBe('');
		});
	});

	describe('get outerHTML()', () => {
		it('Serializes the HTML into nodes and appends them to the "content" node.', () => {
			expect(element.content.childNodes.length).toBe(0);
			expect(element.innerHTML).toBe('');

			element.innerHTML = '<div>Test</div>';

			expect(element.childNodes.length).toBe(0);
			expect(element.outerHTML).toBe('<template><div>Test</div></template>');

			element.innerHTML = '';

			expect(element.outerHTML).toBe('<template></template>');
		});
	});

	describe('set outerHTML()', () => {
		it('Replaces the template with a span.', () => {
			element.innerHTML = '<div>Test</div>';

			document.body.appendChild(element);

			expect(document.body.innerHTML).toBe('<template><div>Test</div></template>');

			element.outerHTML = '<span>Test</span>';

			expect(document.body.innerHTML).toBe('<span>Test</span>');
		});
	});

	describe('get firstChild()', () => {
		it('Returns first child.', () => {
			const div = document.createElement('div');
			const span = document.createElement('span');
			element.appendChild(div);
			element.appendChild(span);
			expect(element.firstChild).toBe(div);
		});

		it('Ignores the children of the "content" node.', () => {
			element.innerHTML = '<div></div>';
			expect(element.firstChild).toBe(null);
		});
	});

	describe('get lastChild()', () => {
		it('Returns last child.', () => {
			const div = document.createElement('div');
			const span = document.createElement('span');
			element.appendChild(div);
			element.appendChild(span);
			expect(element.lastChild).toBe(span);
		});

		it('Ignores the children of the "content" node.', () => {
			element.innerHTML = '<div></div>';
			expect(element.lastChild).toBe(null);
		});
	});

	describe('getInnerHTML()', () => {
		it('Returns inner HTML of the "content" node.', () => {
			const div = document.createElement('div');

			div.innerHTML = 'Test';

			expect(element.content.childNodes.length).toBe(0);
			expect(element.getInnerHTML()).toBe('');

			element.content.appendChild(div);

			expect(element.childNodes.length).toBe(0);
			expect(element.getInnerHTML()).toBe('<div>Test</div>');
			expect(new HTMLSerializer().serializeToString(element.content)).toBe('<div>Test</div>');

			element.content.removeChild(div);

			expect(element.content.childNodes.length).toBe(0);
			expect(element.getInnerHTML()).toBe('');
		});

		it('Should ignore shadow roots, as they should not be included in HTMLTemplateElement.', () => {
			window.customElements.define('custom-element', CustomElement);

			element.innerHTML = '<div><custom-element></custom-element></div>';

			expect(element.getInnerHTML({ includeShadowRoots: true })).toBe(
				'<div><custom-element></custom-element></div>'
			);
		});
	});

	describe('getHTML()', () => {
		it('Returns HTML of children as a concatenated string.', () => {
			const div = document.createElement('div');

			div.innerHTML = 'Test';

			expect(element.content.childNodes.length).toBe(0);
			expect(element.getHTML()).toBe('');

			element.content.appendChild(div);

			expect(element.childNodes.length).toBe(0);
			expect(element.getHTML()).toBe('<div>Test</div>');
			expect(new HTMLSerializer().serializeToString(element.content)).toBe('<div>Test</div>');

			element.content.removeChild(div);

			expect(element.content.childNodes.length).toBe(0);
			expect(element.getHTML()).toBe('');
		});

		it('Should ignore shadow roots, as they should not be included in HTMLTemplateElement.', () => {
			CustomElement.serializable = true;

			window.customElements.define('custom-element', CustomElement);

			element.innerHTML = '<div><custom-element></custom-element></div>';

			document.body.appendChild(element);

			expect(element.getHTML({ serializableShadowRoots: true })).toBe(
				'<div><custom-element></custom-element></div>'
			);
		});
	});

	describe('appendChild()', () => {
		it('Appends a node to the element and not to the "content" node.', () => {
			const div = document.createElement('div');

			element.appendChild(div);

			expect(element.childNodes.length).toBe(1);
			expect(element.childNodes[0]).toBe(div);
			expect(element.content.childNodes.length).toBe(0);
			expect(element.outerHTML).toBe('<template></template>');
		});
	});

	describe('removeChild()', () => {
		it('Removes a node from the element.', () => {
			const div = document.createElement('div');

			element.appendChild(div);
			element.removeChild(div);

			expect(element.childNodes.length).toBe(0);
		});
	});

	describe('insertBefore()', () => {
		it('Inserts a node before another node in the element.', () => {
			const div = document.createElement('div');
			const span = document.createElement('span');
			const underline = document.createElement('u');
			element.appendChild(div);
			element.appendChild(span);
			element.insertBefore(underline, span);
			expect(Array.from(element.childNodes)).toEqual([div, underline, span]);
			expect(element.content.childNodes.length).toBe(0);
		});
	});

	describe('replaceChild()', () => {
		it('Replaces a node in the element.', () => {
			const div = document.createElement('div');
			const span = document.createElement('span');
			const underline = document.createElement('u');
			const bold = document.createElement('b');
			element.appendChild(div);
			element.appendChild(underline);
			element.appendChild(span);
			element.replaceChild(bold, underline);
			expect(Array.from(element.childNodes)).toEqual([div, bold, span]);
			expect(element.content.childNodes.length).toBe(0);
		});
	});

	describe('cloneNode()', () => {
		it('Clones the nodes of the "content" node.', () => {
			element.innerHTML = '<div></div><b></b><span></span>';
			const clone = element.cloneNode(true);
			expect(clone.innerHTML).toBe('<div></div><b></b><span></span>');
		});
	});
});
